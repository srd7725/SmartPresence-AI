from pydantic import BaseModel

class DashboardStats(BaseModel):
    attendance_percentage: float
    active_students: int
    suspicious_students: int
    engagement_average: float
