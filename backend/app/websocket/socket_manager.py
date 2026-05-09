from typing import Dict, List
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        # active_connections: {classroom_id: [websocket1, websocket2, ...]}
        self.active_connections: Dict[int, List[WebSocket]] = {}
        # student_connections: {user_id: websocket}
        self.student_connections: Dict[int, WebSocket] = {}

    async def connect(self, websocket: WebSocket, classroom_id: int, user_id: int):
        await websocket.accept()
        if classroom_id not in self.active_connections:
            self.active_connections[classroom_id] = []
        self.active_connections[classroom_id].append(websocket)
        self.student_connections[user_id] = websocket

    def disconnect(self, websocket: WebSocket, classroom_id: int, user_id: int):
        if classroom_id in self.active_connections:
            self.active_connections[classroom_id].remove(websocket)
        if user_id in self.student_connections:
            del self.student_connections[user_id]

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast_to_classroom(self, message: dict, classroom_id: int):
        if classroom_id in self.active_connections:
            for connection in self.active_connections[classroom_id]:
                await connection.send_json(message)

manager = ConnectionManager()
