from fastapi import APIRouter, Query, HTTPException
from app.services.supabase_client import supabase

router = APIRouter()

@router.get("/motifs")
async def get_motifs(limit: int = 20, offset: int = 0, search: str = ""):
    query = supabase.table("motifs").select("*").range(offset, offset + limit - 1)
    if search:
        query = query.ilike("name", f"%{search}%")
    result = query.execute()
    return result.data

@router.get("/motifs/{name}")
async def get_motif_by_name(name: str):
    result = supabase.table("motifs").select("*").eq("name", name).execute()
    if not result.data:
        raise HTTPException(404, "Motif tidak ditemukan")
    return result.data[0]