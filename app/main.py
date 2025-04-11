from fastapi import FastAPI
from app.routes import user, map as map_router, navigation
from app.core.database import engine, Base

app = FastAPI()

# Create database tables on startup.
Base.metadata.create_all(bind=engine)

# Include routers with path prefixes and tags.
app.include_router(user.router, prefix="/users", tags=["users"])
app.include_router(map_router.router, prefix="/maps", tags=["maps"])
app.include_router(navigation.router, prefix="/navigation", tags=["navigation"])

@app.get("/")
def read_root():
    return {"msg": "Campus Navigation API is running."}
