import os
import json
from datetime import datetime, timezone
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore

load_dotenv()
class FirebaseManager:
    """Singleton manager for Firebase Admin SDK initialization."""
    _instance = None
    _db = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def get_db(self):
        if self._db is None:
            self._init_firebase()
        return self._db

    @classmethod
    def _init_firebase(cls):
        """
        Initialize Firebase Admin SDK.
        Reads FIREBASE_CREDENTIALS_JSON from .env
        """
        if firebase_admin._apps:
            cls._db = firestore.client()
            return

        creds_json = os.getenv("FIREBASE_CREDENTIALS_JSON")
        if not creds_json:
            raise ValueError(
                "FIREBASE_CREDENTIALS_JSON environment variable is required. "
                "Add your Firebase service account JSON to .env file."
            )

        # Strip surrounding quotes if present (some .env loaders add them)
        creds_json = creds_json.strip().strip("'\"")

        try:
            creds_dict = json.loads(creds_json)
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid FIREBASE_CREDENTIALS_JSON format: {str(e)}")

        try:
            creds = credentials.Certificate(creds_dict)
            firebase_admin.initialize_app(creds)
            cls._db = firestore.client()
            print("Firebase initialized successfully.")
        except Exception as e:
            raise ValueError(f"Failed to initialize Firebase: {str(e)}")


def _sanitize_email_to_doc_id(email: str) -> str:
    """Convert email to a safe Firestore document ID."""
    return email.lower().replace("@", "_").replace(".", "_")


def store_research_response(email: str, input_message: str, response_data: dict) -> dict:
    """
    Store the research response in Firestore.

    Args:
        email: User's email address (used as document key).
        input_message: The original query/message from the user.
        response_data: The parsed JSON response from the agent.

    Returns:
        dict with 'success', 'message', and 'doc_id' keys.
    """
    try:
        db = FirebaseManager().get_db()
        doc_id = _sanitize_email_to_doc_id(email)

        payload = {
            "email": email,
            "input_message": input_message,
            "response": response_data,
            "timestamp": firestore.SERVER_TIMESTAMP,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }

        db.collection("research_responses").document(doc_id).set(payload, merge=True)

        return {
            "success": True,
            "message": f"Research data stored for {email}",
            "doc_id": doc_id,
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Firebase storage failed: {str(e)}",
            "error": str(e),
        }


def get_research_response(email: str) -> dict:
    """
    Retrieve research response from Firestore by email.

    Args:
        email: The email address used when storing the data.

    Returns:
        dict with 'success' and either 'data' or 'message' keys.
    """
    try:
        db = FirebaseManager().get_db()
        doc_id = _sanitize_email_to_doc_id(email)
        doc = db.collection("research_responses").document(doc_id).get()

        if not doc.exists:
            return {
                "success": False,
                "message": "No research data found for this email",
            }

        stored_data = doc.to_dict()

        # Convert Firestore Timestamp objects to ISO strings for JSON serialization
        if stored_data.get("timestamp"):
            stored_data["timestamp"] = stored_data["timestamp"].isoformat()

        return {
            "success": True,
            "data": stored_data,
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Firebase retrieval failed: {str(e)}",
            "error": str(e),
        }
