from pydantic import BaseModel
from typing import List

class RouteRead(BaseModel):
    path: List[int]        # List of location IDs representing the path
    total_distance: float

    class Config:
        orm_mode = True
