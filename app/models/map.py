from sqlalchemy import Column, Integer, ForeignKey, String
from sqlalchemy.orm import relationship
from app.core.database import Base

class Location(Base):
    __tablename__ = "locations"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    latitude = Column(String, nullable=False)
    longitude = Column(String, nullable=False)

class Facility(Base):
    __tablename__ = "facilities"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    facility_type = Column(String, nullable=False)  # foodcourt, emergency_exit, restroom
    latitude = Column(String, nullable=False)
    longitude = Column(String, nullable=False)

class ParkingSpot(Base):
    __tablename__ = "parking_spots"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    latitude = Column(String, nullable=False)
    longitude = Column(String, nullable=False)
    status = Column(String, nullable=False)  # Available / Occupied

class Path(Base):
    __tablename__ = "paths"
    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(Integer, nullable=False)  # Can be any location type
    dest_id = Column(Integer, nullable=False)  # Can be any location type
    distance = Column(Integer, nullable=False)
    source_type = Column(String, nullable=False)  # "location", "facility", "parking_spot"
    dest_type = Column(String, nullable=False)