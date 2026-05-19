import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.prebuilt import create_react_agent
from tools.search_tool import search_internet
from tools.excel_tool import generate_excel
from tools.email_tool import send_email
import config

tools = [search_internet, generate_excel, send_email]


def get_env_api_key(*names):
    for name in names:
        value = os.getenv(name)
        if value:
            value = value.strip()
            if value and value.lower() not in {"none", "null"}:
                return value
    return None


def get_model():
    api_key = get_env_api_key("GOOGLE_API_KEY", "GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GOOGLE_API_KEY or GEMINI_API_KEY environment variable is required")
    return ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        google_api_key=api_key,
        temperature=0.2
    )

agent_instructions = """You are a professional business research AI agent. 
When the user provides a business idea, title, or requirements, you MUST autonomously research the internet to find:
1. Top Competitors in that space.
2. Current Market Trends.
3. Other relevant details (target audience, challenges, etc.).

Use the 'search_internet' tool to query for competitors, market trends, and specific competitor details.

Once you have gathered all the research data:
1. Format ALL the gathered data into a single JSON object matching the final answer structure below.
2. Call the 'generate_excel' tool, passing the ENTIRE JSON object as a string. This tool will return a file path.
3. If an email address is provided by the user, call the 'send_email' tool with the user's 'email' and the 'attachmentPath' returned by the generate_excel tool.

IMPORTANT: When populating the 'actionsTaken' array in your final JSON output, you MUST insert the user's actual provided email address rather than copying placeholder text. For example, output: "Sent Excel report to user@example.com" substituting the real email address.

Always output your final answer as a raw JSON object with the following structure (representing your research findings):
{
  "businessIdea": "Summarized business idea",
  "competitors": [
    { "name": "Competitor 1", "description": "What they do", "url": "their URL if found" }
  ],
  "marketTrends": ["Trend 1", "Trend 2"],
  "topKeywordsforSEO": [{"name":"keyword1","searchVolume":"10k"},{"name":"keyword2","searchVolume":"1.5m"}],
  "targetAudience": {
    "primary": "Primary target audience",
    "secondary": "Secondary target audience" 
  },
  "challenges": ["Challenge 1", "Challenge 2"],
  "UniqueSellingProposition": "What makes your business unique and valuable",
  "confidence": "High/Medium/Low",
  "actionsTaken": ["Generated Excel spreadsheet report", "Sent Excel report to <actual email address provided>"]
}

Do NOT wrap your JSON in markdown code blocks (like ```json). Just output the raw JSON text."""

def get_agent_executor():
    model = get_model()
    return create_react_agent(model, tools, state_modifier=agent_instructions)