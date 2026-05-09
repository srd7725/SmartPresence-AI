from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from app.services.websocket_manager import ws_manager

router = APIRouter()

@router.websocket("/live-monitor/{classroom_id}")
async def websocket_endpoint(websocket: WebSocket, classroom_id: int):
    await ws_manager.connect(websocket, classroom_id)
    try:
        while True:
            # Receive data from client (e.g. heartbeat)
            data = await websocket.receive_text()
            # Can process real-time events from client here if needed
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, classroom_id)
