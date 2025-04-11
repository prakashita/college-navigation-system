from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schema.user import UserCreate, UserRead
from app.models.user import User, Student, Faculty, Admin
from app.core.database import get_db
from app.services.authentication import hash_password, verify_password

router = APIRouter()

@router.post("/register", response_model=UserRead)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == user_in.username).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already taken")
    
    hashed_password = hash_password(user_in.password)
    # Create the appropriate subclass based on user_type
    if user_in.user_type == "student":
        # For student, expect "major" in the incoming data.
        # In production, you might separate these endpoints or use a union of schemas.
        student = Student(
            username=user_in.username,
            password_hash=hashed_password,
            user_type="student",
            major=getattr(user_in, "major", None)
        )
        user_obj = student
    elif user_in.user_type == "faculty":
        faculty = Faculty(
            username=user_in.username,
            password_hash=hashed_password,
            user_type="faculty",
            department=getattr(user_in, "department", None)
        )
        user_obj = faculty
    elif user_in.user_type == "admin":
        admin = Admin(
            username=user_in.username,
            password_hash=hashed_password,
            user_type="admin",
            permissions=getattr(user_in, "permissions", None)
        )
        user_obj = admin
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user type")
    
    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)
    return user_obj

@router.post("/login")
def login_user(user_credentials: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == user_credentials.username).first()
    if not user or not verify_password(user_credentials.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    # Here you would typically generate and return a JWT token.
    return {"msg": "Login successful", "user_id": user.id}
