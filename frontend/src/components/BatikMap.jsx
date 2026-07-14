import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const FALLBACK_IMAGE = "/images/motifs/parang.jpg";

const BatikMap = ({ motifs }) => {
  const { t } = useTranslation();
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current) {
      // Inisialisasi peta Indonesia
      mapRef.current = L.map("batik-map", {
        scrollWheelZoom: false,
        attributionControl: true,
      }).setView([-2.5489, 118.0149], 5); // koordinat tengah Indonesia

      // Tambahkan tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapRef.current);
    }

    // Bersihkan marker lama
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    if (motifs && motifs.length > 0) {
      markersRef.current = motifs
        .map((motif) => {
          if (!motif.position || !Array.isArray(motif.position)) return null;

          const icon = L.icon({
            iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
            iconSize: [28, 28],
            iconAnchor: [14, 28],
            popupAnchor: [0, -28],
          });

          const marker = L.marker(motif.position, { icon }).addTo(
            mapRef.current,
          );

          const popup = document.createElement("div");
          popup.style.width = "180px";
          popup.innerHTML = `
            <img src="${motif.image || FALLBACK_IMAGE}" alt="${motif.name}" style="width:100%; height:96px; object-fit:cover; border-radius:6px; margin-bottom:8px;" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'" />
            <h3 style="font-weight:700; font-size:14px; margin:0 0 4px; color:#4b2e1f;">${motif.name}</h3>
            <p style="font-size:12px; margin:0; color:#4b5563;"><strong>${t("common.region")}:</strong> ${motif.origin}</p>
          `;

          marker.bindPopup(popup, { maxWidth: 220 });
          return marker;
        })
        .filter(Boolean);

      if (markersRef.current.length > 0) {
        const group = L.featureGroup(markersRef.current);
        mapRef.current.fitBounds(group.getBounds(), { padding: [20, 20] });
      }
    }

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
    };
  }, [motifs, t]);

  return (
    <div
      id="batik-map"
      className="w-full h-64 md:h-80 rounded-md border border-gray-200"
      aria-label={t("media.mapAria")}
      role="application"
    ></div>
  );
};

export default BatikMap;
