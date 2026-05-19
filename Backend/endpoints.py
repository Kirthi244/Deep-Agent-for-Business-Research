import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from agent import get_agent_executor
from services import store_research_response, get_research_response

router = APIRouter()

class ResearchRequest(BaseModel):
    message: str
    email: str


def parse_agent_json(output: str):
    text = output.strip()
    if text.startswith("```") and text.endswith("```"):
        lines = text.splitlines()
        if lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].startswith("```"):
            lines = lines[:-1]
        text = "\n".join(lines).strip()

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1 and start < end:
            try:
                return json.loads(text[start:end+1])
            except json.JSONDecodeError:
                pass
        raise HTTPException(status_code=500, detail="Agent result is not valid JSON")


@router.post("/run-agent")
async def run_agent(req: ResearchRequest):
    try:
        agent_executor = get_agent_executor()
        full_query = f"{req.message}\n\nUser's email is: {req.email}. Send the report there."
        inputs = {"messages": [("user", full_query)]}
        result = agent_executor.invoke(inputs)
        final_answer = result["messages"][-1].content
        parsed = parse_agent_json(final_answer)

        # Store response in Firebase Firestore
        storage_result = store_research_response(
            email=req.email,
            input_message=req.message,
            response_data=parsed,
        )
        if not storage_result.get("success"):
            print(f"Warning: Firebase storage failed — {storage_result.get('message')}")

        return {
            "success": True,
            "data": parsed,
            "firebase_status": storage_result,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/research/{email}")
async def get_research(email: str):
    """Retrieve the stored research response for a given email address."""
    try:
        result = get_research_response(email)

        if not result.get("success"):
            raise HTTPException(status_code=404, detail=result.get("message"))

        return {"success": True, "data": result.get("data")}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
