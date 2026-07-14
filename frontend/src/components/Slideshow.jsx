import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const FALLBACK_IMAGE = "/images/motifs/parang.jpg";

export default function Slideshow() {
  const { t } = useTranslation();
  const motifList = [
    "Bokor Kencono",
    "Kawung",
    "Mega Mendung",
    "Parang",
    "Sidoluhur",
    "Sidomukti",
    "Sidomulyo",
    "Srikaton",
    "Tribusono",
    "Truntum",
    "Wahyu Tumurun",
    "Wirasat"
  ];

  const slides = motifList.map((name) => ({
    src: `/images/motifs/${name.toLowerCase().replace(/\s+/g, "-")}.jpg`,
    alt: t("media.motifAlt", { name })
  }));

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div
      className="rounded-lg overflow-hidden w-full h-30 sm:h-40 md:h-48 lg:h-56 relative"
      aria-label={t("media.slideshowAria")}
    >
      <img
        src={slides[currentIndex].src}
        alt={slides[currentIndex].alt}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = FALLBACK_IMAGE;
        }}
        className="w-full h-full object-cover transition-opacity duration-300"
        draggable="false"
      />
      <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs font-semibold rounded px-2 py-0.5 select-none">
        {slides[currentIndex].alt}
      </div>
      <div className="absolute inset-0 flex items-center justify-between px-2">
        <button
          aria-label={t("media.previousSlide")}
          onClick={() =>
            setCurrentIndex(
              currentIndex === 0 ? slides.length - 1 : currentIndex - 1
            )
          }
          className="bg-black bg-opacity-40 hover:bg-opacity-70 text-white rounded-full p-1"
          type="button"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <button
          aria-label={t("media.nextSlide")}
          onClick={() =>
            setCurrentIndex(
              currentIndex === slides.length - 1 ? 0 : currentIndex + 1
            )
          }
          className="bg-black bg-opacity-40 hover:bg-opacity-70 text-white rounded-full p-1"
          type="button"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </div>
  );
}
