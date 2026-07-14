import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query

from app.models.schemas import (
    MotifInfo,
    PredictionHistoryItem,
    PredictionHistoryResponse,
)
from app.services.supabase_client import supabase
from app.utils.auth import get_current_user
from app.utils.errors import api_error
from app.utils.motifs import canonical_motif_key

router = APIRouter()
logger = logging.getLogger(__name__)


def _normalize_colors(colors) -> list[str]:
    if isinstance(colors, list):
        return [str(color) for color in colors if color]
    if isinstance(colors, str):
        return [color.strip() for color in colors.split(",") if color.strip()]
    return []


def _motif_info_from_row(motif: Optional[dict]) -> MotifInfo:
    if not motif:
        return MotifInfo(
            name="Tidak diketahui",
            origin="Tidak diketahui",
            philosophy="Informasi motif belum tersedia di database",
            history="",
            usage="",
            colors=[],
            image_url="",
        )

    return MotifInfo(
        name=motif.get("name") or "Tidak diketahui",
        origin=motif.get("origin") or "",
        philosophy=motif.get("philosophy") or "",
        history=motif.get("history") or "",
        usage=motif.get("usage") or "",
        colors=_normalize_colors(motif.get("colors")),
        image_url=motif.get("image_url") or "",
    )


@router.get("/history", response_model=PredictionHistoryResponse)
async def get_prediction_history(
    current_user_id: str = Depends(get_current_user),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    try:
        history_result = (
            supabase.table("upload_history")
            .select("id,motif_id,confidence,image_url,created_at")
            .eq("user_id", current_user_id)
            .order("created_at", desc=True)
            .range(offset, offset + limit - 1)
            .execute()
        )

        histories = history_result.data or []
        logger.debug(
            "History requested by user_id=%s returned_rows=%s",
            current_user_id,
            len(histories),
        )

        motif_ids = list({
            item.get("motif_id")
            for item in histories
            if item.get("motif_id") is not None
        })

        motifs_by_id = {}
        if motif_ids:
            motif_result = (
                supabase.table("motifs")
                .select("id,name,origin,philosophy,history,colors,usage,image_url")
                .in_("id", motif_ids)
                .execute()
            )
            motifs_by_id = {
                motif.get("id"): motif
                for motif in (motif_result.data or [])
            }

        items = []
        for item in histories:
            motif = motifs_by_id.get(item.get("motif_id"))
            info = _motif_info_from_row(motif)
            items.append(
                PredictionHistoryItem(
                    id=item.get("id"),
                    prediction=info.name,
                    motif_key=canonical_motif_key(info.name),
                    confidence=float(item.get("confidence") or 0),
                    image_url=item.get("image_url") or "",
                    created_at=item.get("created_at"),
                    info=info,
                )
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Gagal mengambil riwayat")
        raise api_error(500, "HISTORY_LOAD_FAILED", "Gagal mengambil riwayat.")

    return PredictionHistoryResponse(items=items)
