from fastapi import WebSocket
from typing import List, Dict, Any

class WebSocketManager:
    """
    Production-ready WebSocket Manager for handling real-time connections,
    alerts, and live monitoring across the platform.
    """
    def __init__(self):
        # Store active connections. Can be organized by classroom_id for targeted broadcasting.
        # { classroom_id: [websocket1, websocket2, ...] }
        self.active_connections: Dict[int, List[WebSocket]] = {}
        
        # Track all connections globally if needed
        self.all_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket, classroom_id: int):
        """
        Accepts a new WebSocket connection and tracks it.
        """
        await websocket.accept()
        
        if classroom_id not in self.active_connections:
            self.active_connections[classroom_id] = []
            
        self.active_connections[classroom_id].append(websocket)
        self.all_connections.append(websocket)

    def disconnect(self, websocket: WebSocket, classroom_id: int):
        """
        Removes a WebSocket connection from active trackers upon disconnect.
        """
        if classroom_id in self.active_connections:
            if websocket in self.active_connections[classroom_id]:
                self.active_connections[classroom_id].remove(websocket)
            
            # Clean up empty lists
            if not self.active_connections[classroom_id]:
                del self.active_connections[classroom_id]
                
        if websocket in self.all_connections:
            self.all_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        """
        Sends a text message to a specific client.
        """
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        """
        Broadcasts a text message to ALL connected clients.
        """
        for connection in self.all_connections:
            try:
                await connection.send_text(message)
            except RuntimeError:
                pass # Connection might be closed

    async def broadcast_to_classroom(self, message: str, classroom_id: int):
        """
        Broadcasts a text message to all clients in a specific classroom.
        """
        if classroom_id in self.active_connections:
            for connection in self.active_connections[classroom_id]:
                try:
                    await connection.send_text(message)
                except RuntimeError:
                    pass

    async def broadcast_json_to_classroom(self, data: Dict[str, Any], classroom_id: int):
        """
        Broadcasts a JSON payload to all clients in a specific classroom.
        Used for attendance updates and real-time alerts.
        """
        if classroom_id in self.active_connections:
            for connection in self.active_connections[classroom_id]:
                try:
                    await connection.send_json(data)
                except RuntimeError:
                    pass

# Export a reusable singleton instance
ws_manager = WebSocketManager()
