from typing import Optional

from app.services.supabase_client import supabase


def ensure_profile_exists(
    user_id: str,
    email: Optional[str] = None,
    full_name: Optional[str] = None,
) -> None:
    """Pastikan user auth punya baris di tabel profiles untuk foreign key riwayat."""
    try:
        result = (
            supabase.table("profiles")
            .select("id,full_name,email")
            .eq("id", user_id)
            .limit(1)
            .execute()
        )
    except Exception:
        result = supabase.table("profiles").select("id").eq("id", user_id).limit(1).execute()

    if result.data:
        profile = result.data[0]
        updates = {}
        if full_name and not profile.get("full_name"):
            updates["full_name"] = full_name
        if email and not profile.get("email"):
            updates["email"] = email
        if updates:
            try:
                supabase.table("profiles").update(updates).eq("id", user_id).execute()
            except Exception:
                pass
        return

    payload = {"id": user_id}
    if email:
        payload["email"] = email
    if full_name:
        payload["full_name"] = full_name

    try:
        supabase.table("profiles").insert(payload).execute()
    except Exception:
        if payload == {"id": user_id}:
            raise
        supabase.table("profiles").insert({"id": user_id}).execute()
