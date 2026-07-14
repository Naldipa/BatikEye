from pydantic import BaseModel
from typing import Any, List, Optional

class AuthRequest(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None
    name: Optional[str] = None

class AuthUser(BaseModel):
    id: Optional[str] = None
    email: Optional[str] = None

class AuthResponse(BaseModel):
    message: str
    user: Optional[AuthUser] = None
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    token_type: str = "bearer"

class ForgotPasswordRequest(BaseModel):
    email: str
    redirect_url: Optional[str] = None

class ResetPasswordRequest(BaseModel):
    token: Optional[str] = None
    password: str
    email: Optional[str] = None
    access_token: Optional[str] = None
    token_hash: Optional[str] = None
    code: Optional[str] = None
    refresh_token: Optional[str] = None
    code_verifier: Optional[str] = None

class MessageResponse(BaseModel):
    message: str

class MotifInfo(BaseModel):
    name: str
    origin: Optional[str] = ""
    philosophy: Optional[str] = ""
    history: Optional[str] = ""
    usage: Optional[str] = ""
    colors: List[str] = []
    image_url: Optional[str] = ""

class PredictionResponse(BaseModel):
    is_batik: bool = True
    prediction: str
    motif_key: Optional[str] = None
    confidence: float
    image_url: Optional[str] = None
    info: Optional[MotifInfo] = None
    message: Optional[str] = None
    code: Optional[str] = None
    history_saved: bool = False
    history_error: Optional[str] = None
    uploaded_image_url: Optional[str] = None
    history_user_id: Optional[str] = None

class PredictionHistoryItem(BaseModel):
    id: Optional[Any] = None
    prediction: str
    motif_key: Optional[str] = None
    confidence: float
    image_url: Optional[str] = None
    created_at: Optional[str] = None
    info: Optional[MotifInfo] = None

class PredictionHistoryResponse(BaseModel):
    items: List[PredictionHistoryItem]
