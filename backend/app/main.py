from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.config import settings
from app.routes import auth, history, predict, motifs
from app.utils.errors import (
    api_exception_handler,
    unhandled_exception_handler,
    validation_exception_handler,
)

app = FastAPI(title="BatikEye API", version="1.0.0")

app.add_exception_handler(StarletteHTTPException, api_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, unhandled_exception_handler)

# CORS untuk frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=settings.CORS_ALLOW_METHODS,
    allow_headers=settings.CORS_ALLOW_HEADERS,
)

# Router
app.include_router(auth.router, prefix="/api", tags=["Auth"])
app.include_router(history.router, prefix="/api", tags=["History"])
app.include_router(predict.router, prefix="/api", tags=["Prediction"])
app.include_router(motifs.router, prefix="/api", tags=["Motifs"])

@app.get("/")
def root():
    return {"message": "BatikEye API is running"}
