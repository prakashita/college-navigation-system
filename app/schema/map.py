from pydantic import BaseModel
from typing import Literal

# ------------------------ Location Schemas ------------------------ #
class LocationBase(BaseModel):
    name: str
    latitude: float
    longitude: float

class LocationCreate(LocationBase):
    pass

class LocationResponse(LocationBase):
    id: int
    class Config:
        orm_mode = True

# ------------------------ Facility Schemas ------------------------ #
class FacilityBase(BaseModel):
    name: str
    facility_type: Literal["foodcourt", "emergency_exit", "restroom"]
    latitude: float
    longitude: float

class FacilityCreate(FacilityBase):
    pass

class FacilityResponse(FacilityBase):
    id: int
    class Config:
        orm_mode = True

# ------------------------ Parking Spot Schemas ------------------------ #
class ParkingSpotBase(BaseModel):
    name: str
    status: Literal["available", "occupied"]
    latitude: float
    longitude: float

class ParkingSpotCreate(ParkingSpotBase):
    pass

class ParkingSpotResponse(ParkingSpotBase):
    id: int
    class Config:
        orm_mode = True

# ------------------------ Path Schemas ------------------------ #
class PathBase(BaseModel):
    source_id: int
    source_type: Literal["location", "facility", "parking_spot"]
    dest_id: int
    dest_type: Literal["location", "facility", "parking_spot"]
    distance: float

class PathCreate(PathBase):
    pass

class PathResponse(PathBase):
    id: int
    class Config:
        orm_mode = True
