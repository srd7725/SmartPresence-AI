from fastapi import FastAPI, UploadFile, File, Form
import cv2
import numpy as np
import io
from PIL import Image
from face_recognition.engine import face_engine
from liveness_detection.liveness import liveness_detector
from engagement_detection.engagement import engagement_tracker

app = FastAPI(title="SmartPresence AI ML Service")

@app.post("/analyze")
async def analyze_frame(
    file: UploadFile = File(...),
    user_id: int = Form(...),
    classroom_id: int = Form(...)
):
    # Read image
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # 1. Liveness Check
    is_live, liveness_msg = liveness_detector.is_live(frame)
    
    # 2. Face Recognition (Verify if it's the correct student)
    # In a real app, you'd fetch the reference embedding from the DB
    # For now, we assume recognition is handled or mocked
    identity_verified = True 
    
    # 3. Engagement Analysis
    engagement_data = engagement_tracker.analyze_engagement(frame)

    # 4. Generate Confidence Score
    confidence_score = 0.95 if is_live and identity_verified else 0.4
    
    return {
        "user_id": user_id,
        "classroom_id": classroom_id,
        "is_live": is_live,
        "liveness_message": liveness_msg,
        "identity_verified": identity_verified,
        "engagement_score": engagement_data["engagement_score"],
        "confidence_score": confidence_score,
        "status": engagement_data["status"]
    }

@app.post("/extract-embedding")
async def extract_embedding(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    embedding = face_engine.extract_embedding(frame)
    return {"embedding": embedding}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
