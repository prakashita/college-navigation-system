# schemas/user.py

from pydantic import BaseModel

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str
    user_type: str  # should be "student", "faculty", "visitor",or "admin"

class StudentCreate(UserCreate):
    major: str

class FacultyCreate(UserCreate):
    department: str
class VisitorCreate(UserCreate):
    department: str

class AdminCreate(UserCreate):
    permissions: str

class UserRead(UserBase):
    id: int
    user_type: str

    class Config:
        orm_mode = True
