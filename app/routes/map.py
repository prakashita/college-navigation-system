from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.map import Location, Facility, ParkingSpot, Path
from app.schema.map import (
    LocationCreate, FacilityCreate, ParkingSpotCreate, PathCreate, 
    LocationResponse, FacilityResponse, ParkingSpotResponse, PathResponse
)

router = APIRouter()

# ------------------------ Location Routes ------------------------ #
@router.post("/locations/", response_model=LocationResponse)
def add_location(location: LocationCreate, db: Session = Depends(get_db)):
    new_location = Location(**location.dict())
    db.add(new_location)
    db.commit()
    db.refresh(new_location)
    return new_location

@router.get("/locations/", response_model=list[LocationResponse])
def get_locations(db: Session = Depends(get_db)):
    return db.query(Location).all()

@router.get("/locations/{location_id}", response_model=LocationResponse)
def get_location(location_id: int, db: Session = Depends(get_db)):
    location = db.query(Location).filter(Location.id == location_id).first()
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    return location

@router.delete("/locations/{location_id}")
def delete_location(location_id: int, db: Session = Depends(get_db)):
    location = db.query(Location).filter(Location.id == location_id).first()
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    db.delete(location)
    db.commit()
    return {"message": "Location deleted successfully"}

# ------------------------ Facility Routes ------------------------ #
@router.post("/facilities/", response_model=FacilityResponse)
def add_facility(facility: FacilityCreate, db: Session = Depends(get_db)):
    new_facility = Facility(**facility.dict())
    db.add(new_facility)
    db.commit()
    db.refresh(new_facility)
    return new_facility

@router.get("/facilities/", response_model=list[FacilityResponse])
def get_facilities(db: Session = Depends(get_db)):
    return db.query(Facility).all()

@router.get("/facilities/{facility_id}", response_model=FacilityResponse)
def get_facility(facility_id: int, db: Session = Depends(get_db)):
    facility = db.query(Facility).filter(Facility.id == facility_id).first()
    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")
    return facility

# ------------------------ Parking Spot Routes ------------------------ #
@router.post("/parking_spots/", response_model=ParkingSpotResponse)
def add_parking_spot(spot: ParkingSpotCreate, db: Session = Depends(get_db)):
    new_spot = ParkingSpot(**spot.dict())
    db.add(new_spot)
    db.commit()
    db.refresh(new_spot)
    return new_spot

@router.get("/parking_spots/", response_model=list[ParkingSpotResponse])
def get_parking_spots(db: Session = Depends(get_db)):
    return db.query(ParkingSpot).all()

@router.get("/parking_spots/{spot_id}", response_model=ParkingSpotResponse)
def get_parking_spot(spot_id: int, db: Session = Depends(get_db)):
    spot = db.query(ParkingSpot).filter(ParkingSpot.id == spot_id).first()
    if not spot:
        raise HTTPException(status_code=404, detail="Parking spot not found")
    return spot

# ------------------------ Path Routes ------------------------ #
@router.post("/paths/", response_model=PathResponse)
def add_path(path: PathCreate, db: Session = Depends(get_db)):
    new_path = Path(**path.dict())
    db.add(new_path)
    db.commit()
    db.refresh(new_path)
    return new_path

@router.get("/paths/", response_model=list[PathResponse])
def get_paths(db: Session = Depends(get_db)):
    return db.query(Path).all()

@router.get("/paths/{path_id}", response_model=PathResponse)
def get_path(path_id: int, db: Session = Depends(get_db)):
    path = db.query(Path).filter(Path.id == path_id).first()
    if not path:
        raise HTTPException(status_code=404, detail="Path not found")
    return path

@router.delete("/paths/{path_id}")
def delete_path(path_id: int, db: Session = Depends(get_db)):
    path = db.query(Path).filter(Path.id == path_id).first()
    if not path:
        raise HTTPException(status_code=404, detail="Path not found")
    db.delete(path)
    db.commit()
    return {"message": "Path deleted successfully"}

# ------------------------ Get Complete Map Data ------------------------ #
@router.get("/maps/")
def get_maps(db: Session = Depends(get_db)):
    return {
        "locations": db.query(Location).all(),
        "facilities": db.query(Facility).all(),
        "parking_spots": db.query(ParkingSpot).all(),
        "paths": db.query(Path).all(),
    }
