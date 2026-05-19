import os
import requests
from langchain_core.tools import tool

@tool
def search_internet(query: str):
    """
    Useful for searching the internet to find competitors, market research, and trends.
    Input should be a precise search query.
    """
    url = "https://api.tavily.com/search"
    payload = {
        "api_key": os.getenv("TAVILY_API_KEY"),
        "query": query,
        "max_results": 5
    }
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        data = response.json()

        results = []
        for r in data.get("results", []):
            results.append(f"Title: {r['title']}\nSnippet: {r['content']}\nURL: {r['url']}")

        return "\n\n".join(results) if results else f"No results found for {query}"
    except Exception as e:
        return f"Search failed: {str(e)}"
