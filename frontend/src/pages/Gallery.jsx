// src/pages/Gallery.jsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaSearch } from "react-icons/fa";
import { motifs } from "../data/motifs";
import { getLocalizedMotifMetadata } from "../data/localizedMotifs";

const FALLBACK_IMAGE = "/images/motifs/parang.jpg";

const normalizeKey = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const motifImageLookup = motifs.reduce((lookup, motif) => {
  lookup[normalizeKey(motif.name)] = motif.image;
  return lookup;
}, {});

const getMotifImage = (name) =>
  motifImageLookup[normalizeKey(name)] || FALLBACK_IMAGE;

const Gallery = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const motifList = useMemo(() => {
    const localizedMetadata = getLocalizedMotifMetadata(i18n.resolvedLanguage);

    return Object.entries(localizedMetadata).map(([originalName, info]) => ({
      originalName,
      name: info.name,
      origin: info.origin,
      description: info.philosophy,
      colors: info.colors,
      history: info.history,
      usage: info.usage,
    }));
  }, [i18n.resolvedLanguage]);

  const filtered = motifList.filter((m) =>
    `${m.name} ${m.origin} ${m.originalName}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  const handleCardClick = (motif) => {
    // Kirim data ke DetailBatik dengan format yang sama seperti hasil prediksi API
    navigate("/detail", {
      state: {
        result: {
          prediction: motif.name,
          motif_key: motif.originalName,
          original_prediction: motif.originalName,
          source: "gallery",
          image_url: getMotifImage(motif.originalName),
          info: {
            origin: motif.origin,
            philosophy: motif.description,
            colors: motif.colors,
            history: motif.history || t("gallery.fallbackHistory"),
            usage: motif.usage || t("gallery.fallbackUsage"),
          },
        },
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl md:text-4xl font-semibold text-batik-brown text-center mb-2">
        {t("gallery.title")}
      </h1>
      <p className="text-center text-gray-600 mb-8">
        {t("gallery.subtitle")}
      </p>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-10 relative">
        <input
          type="text"
          placeholder={t("gallery.searchPlaceholder")}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-batik-gold focus:border-transparent"
        />
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500">{t("gallery.notFound")}</p>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map((motif) => (
              <div
                key={motif.name}
                onClick={() => handleCardClick(motif)}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer"
              >
                <div className="relative h-48">
                  <img
                    src={getMotifImage(motif.originalName)}
                    alt={motif.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = FALLBACK_IMAGE;
                    }}
                  />
                  <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                    {motif.origin}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-batik-brown">
                    {motif.name}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {motif.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {motif.colors.map((c, i) => (
                      <span
                        key={i}
                        className="text-xs bg-gray-100 px-2 py-0.5 rounded-full"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10 space-x-3">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-md disabled:opacity-50"
              >
                {t("gallery.previous")}
              </button>
              <span className="px-4 py-2">
                {t("common.page")} {currentPage} {t("common.of")} {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded-md disabled:opacity-50"
              >
                {t("gallery.next")}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Gallery;
