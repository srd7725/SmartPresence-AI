import httpx
from app.core.config import settings

async def verify_face(image_bytes: bytes, enrollment_id: str):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{settings.ML_SERVICE_URL}/verify",
            files={"file": ("image.jpg", image_bytes, "image/jpeg")},
            data={"enrollment_id": enrollment_id}
        )
        if response.status_code == 200:
            return response.json()
        return None

async def analyze_frame(image_bytes: bytes):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{settings.ML_SERVICE_URL}/analyze",
            files={"file": ("frame.jpg", image_bytes, "image/jpeg")}
        )
        if response.status_code == 200:
            return response.json()
        return None
