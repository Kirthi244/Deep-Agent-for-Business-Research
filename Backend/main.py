import os
import socket
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import load_dotenv
from endpoints import router

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


def find_free_port(start_port: int = 8000, host: str = "0.0.0.0") -> int:
    port = start_port
    while port < start_port + 10:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            try:
                sock.bind((host, port))
                return port
            except OSError:
                port += 1
    raise RuntimeError("No available ports in the range 8000-8009")


if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    start_port = int(os.getenv("PORT", 8000))
    port = find_free_port(start_port, host)
    if port != start_port:
        print(f"Port {start_port} is busy, starting on port {port} instead.")
    uvicorn.run(app, host=host, port=port)