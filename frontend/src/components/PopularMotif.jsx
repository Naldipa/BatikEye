import React from "react";
import { useTranslation } from "react-i18next";

const FALLBACK_IMAGE = "/images/motifs/parang.jpg";

export default function PopularMotif({ label, ariaLabel }) {
  const { t } = useTranslation();
  const getMotifImage = (label) =>
    `/images/motifs/${label.toLowerCase().replace(/\s+/g, "-")}.jpg`;

  return (
    <div
      className="w-full h-28 sm:h-32 rounded-md overflow-hidden relative shadow-sm hover:shadow-md transition"
      aria-label={ariaLabel}
    >
      <img
        src={getMotifImage(label)}
        alt={t("media.batikMotifAlt", { name: label })}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = FALLBACK_IMAGE;
        }}
        className="w-full h-full object-cover"
        loading="lazy"
      />

      {/* Label Nama & Asal */}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-40 text-white px-3 py-1 text-sm">
        <div className="font-semibold">{label}</div>
      </div>
    </div>
  );
}
