# models/user.py

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)
    user_type = Column(String, nullable=False)  # discriminator field

    __mapper_args__ = {
        "polymorphic_identity": "user",
        "polymorphic_on": user_type,
    }

class Student(User):
    __tablename__ = "students"
    
    id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    major = Column(String)  # student-specific attribute
    # Establish back reference if needed:
    user = relationship("User", backref="student_profile", uselist=False)

    __mapper_args__ = {
        "polymorphic_identity": "student",
    }

class Faculty(User):
    __tablename__ = "faculties"
    
    id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    department = Column(String)  # faculty-specific attribute

    __mapper_args__ = {
        "polymorphic_identity": "faculty",
    }

class Admin(User):
    __tablename__ = "admins"
    
    id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    permissions = Column(String)  # admin-specific attribute

    __mapper_args__ = {
        "polymorphic_identity": "admin",
    }
