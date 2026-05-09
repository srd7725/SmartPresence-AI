import cv2
import numpy as np
from deepface import DeepFace
import os

class FaceEngine:
    def __init__(self, model_name="VGG-Face"):
        self.model_name = model_name

    def extract_embedding(self, img_path_or_array):
        """Extract face embeddings from an image."""
        try:
            embeddings = DeepFace.represent(img_path_or_array, model_name=self.model_name, enforce_detection=True)
            return embeddings[0]["embedding"]
        except Exception as e:
            print(f"Error extracting embedding: {e}")
            return None

    def verify_faces(self, img1, img2):
        """Verify if two faces belong to the same person."""
        try:
            result = DeepFace.verify(img1, img2, model_name=self.model_name)
            return result["verified"], result["distance"]
        except Exception as e:
            print(f"Error verifying faces: {e}")
            return False, 1.0

    def detect_faces(self, frame):
        """Detect faces in a frame using OpenCV."""
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)
        return faces

face_engine = FaceEngine()
