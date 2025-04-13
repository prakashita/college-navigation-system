from fastapi import FastAPI
from app.routes import user, map as map_router, navigation
from app.core.database import engine, Base

app = FastAPI()

# Create database tables on startup.
Base.metadata.create_all(bind=engine)
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow requests from your frontend (localhost:3000)
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # or use ["*"] to allow all (not recommended in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers with path prefixes and tags.
app.include_router(user.router, prefix="/users", tags=["users"])
app.include_router(map_router.router, prefix="/maps", tags=["maps"])
app.include_router(navigation.router, prefix="/navigation", tags=["navigation"])

@app.get("/")
def read_root():
    return {"msg": "Campus Navigation API is running."}
