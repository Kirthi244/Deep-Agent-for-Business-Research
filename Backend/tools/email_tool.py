import json
import os
import smtplib
from email import encoders
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from langchain_core.tools import tool

@tool
def send_email(email: str, attachmentPath: str) -> str:
    """
    Sends the generated Excel report to the user's email address.
    """
    try:
        target_email = email.strip()
        file_path = attachmentPath.strip()

        if not target_email:
            return "Email failed: email address is required."
        if not file_path:
            return "Email failed: attachmentPath is required."
        if not os.path.isfile(file_path):
            return f"Email failed: attachment file does not exist at {file_path}."

        email_user = os.getenv("EMAIL_USER")
        email_pass = os.getenv("EMAIL_PASS")
        if not email_user or not email_pass:
            return "Email failed: EMAIL_USER and EMAIL_PASS environment variables are required."

        msg = MIMEMultipart()
        msg['From'] = email_user
        msg['To'] = target_email
        msg['Subject'] = "Your AI Business Research Report"
        msg.attach(MIMEText("Hello! Your AI business research is complete. Please find the report attached.", 'plain'))

        with open(file_path, "rb") as attachment:
            part = MIMEBase("application", "octet-stream")
            part.set_payload(attachment.read())
            encoders.encode_base64(part)
            part.add_header("Content-Disposition", f"attachment; filename={os.path.basename(file_path)}")
            msg.attach(part)

        host = os.getenv("SMTP_HOST", "smtp.gmail.com")
        port = int(os.getenv("SMTP_PORT", 465))

        server = smtplib.SMTP_SSL(host, port)
        server.login(email_user, email_pass)
        server.send_message(msg)
        server.quit()

        print(f"\n[EMAIL SUCCESS] Sent successfully to {target_email}\n")
        return f"Email sent successfully to {target_email}."
    except Exception as e:
        print(f"\n[EMAIL ERROR] Failed to send email: {str(e)}\n")
        return f"Email failed: {str(e)}"