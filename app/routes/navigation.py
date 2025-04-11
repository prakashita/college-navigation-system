from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.navigation import compute_shortest_path

router = APIRouter()

@router.get("/shortest-route")
def get_shortest_route(start_id: int, start_type: str, end_id: int, end_type: str, db: Session = Depends(get_db)):
    route = compute_shortest_path(db, start_id, start_type, end_id, end_type)
    if route is None:
        raise HTTPException(status_code=404, detail="Route not found")
    return route
