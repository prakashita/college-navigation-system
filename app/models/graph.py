from sqlalchemy import Column, Integer, Float, String
from app.core.database import Base

class Edge(Base):
    __tablename__ = "edges"
    
    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(Integer, nullable=False)  # Can be a location, facility, or parking spot
    source_type = Column(String, nullable=False)  # "location", "facility", "parking_spot"
    dest_id = Column(Integer, nullable=False)  # Can be a location, facility, or parking spot
    dest_type = Column(String, nullable=False)  # "location", "facility", "parking_spot"
    distance = Column(Float, nullable=False)  # Distance in meters
