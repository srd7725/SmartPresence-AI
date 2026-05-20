# SmartPresence AI 🚀
### Intelligent Attendance & Student Engagement Monitoring Platform

SmartPresence AI is a next-generation, AI-powered classroom integrity system designed for modern online and hybrid education. It leverages deep learning to ensure academic honesty while providing deep insights into student engagement.

---

## 🌟 Key Features

### 🛡️ Attendance Integrity
- **AI Face Recognition**: Eliminates proxy attendance by verifying student identity in real-time.
- **Liveness Detection**: Prevents spoofing attempts using photos or pre-recorded videos.
- **Blink Verification**: Advanced biometric check for human presence.

### 📊 Engagement Monitoring
- **Eye Tracking**: Analyzes if students are focused on the session.
- **Head Pose Estimation**: Detects distraction or absence from the camera frame.
- **Activity Tracking**: Monitors tab switching and background application usage.
- **Engagement Score**: Real-time KPI for student focus and participation.

### 👨‍🏫 Instructor Console
- **Live Classroom Grid**: Monitor all students' status simultaneously.
- **Real-time Alerts**: Instant notification for suspicious activities.
- **Analytics Dashboards**: Visualized data on classroom performance.

### 🧑‍🎓 Student Dashboard
- **Personal Analytics**: Track attendance trends and engagement history.
- **Face Enrollment**: Secure biometric registration process.
- **Live Feed Feedback**: Real-time indicators of focus and security status.

---

## 🏗️ Architecture
The platform follows a professional **Micro-service Architecture**:

- **Frontend**: React (Vite) + Tailwind CSS + Framer Motion (Glassmorphism UI)
- **Backend**: FastAPI + SQLAlchemy (REST & WebSockets)
- **ML Service**: Python + OpenCV + DeepFace + MediaPipe (Biometric Analysis)
- **Database**: PostgreSQL

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Bootstrap 5, Recharts, Framer Motion, Axios, React Webcam.
- **Backend**: FastAPI, Pydantic, JWT Authentication, WebSockets.
- **AI/ML**: OpenCV, MediaPipe, DeepFace, Scikit-learn, NumPy, Pandas.
- **DevOps**: Docker, Docker Compose.

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Python 3.9+ (for local development)
- Node.js 18+ (for local development)

### Deployment with Docker
```bash
# Clone the repository
git clone https://github.com/yourusername/smartpresence-ai.git
cd smartpresence-ai

# Build and run with Docker Compose
docker-compose up --build
```
Access the application at:
- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:8000`
- **ML Service**: `http://localhost:8001`

---

## 📂 Project Structure

```text
smartpresence-ai/
├── frontend/          # React + Vite application
├── backend/           # FastAPI service & Database logic
├── ml-service/        # AI/ML modules & detection engines
├── database/          # SQL migrations & seeds
├── docker/            # Service-specific docker configs
└── README.md
```

---

## 🛡️ Security & Privacy
- **JWT Authentication**: Secure role-based access control (Student, Teacher, Admin).
- **Data Encryption**: Biometric embeddings are stored as hashed vectors.
- **Privacy First**: No raw video footage is stored; only metadata and scores are persisted.

---

## 🔮 Future Roadmap
- [ ] Integration with LMS (Canvas/Moodle).
- [ ] Mobile application for cross-platform support.
- [ ] Multi-face detection for group studies.
- [ ] AI-generated automated progress reports for parents.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Developed with ❤️ for the future of education.
# update
