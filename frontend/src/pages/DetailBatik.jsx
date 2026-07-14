// src/pages/DetailBatik.jsx
import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaArrowLeft,
  FaTint,
  FaMapMarkerAlt,
  FaBook,
  FaHistory,
} from "react-icons/fa";
import { getLocalizedMotifByName } from "../data/localizedMotifs";

const DETAIL_STORAGE_KEY = "batikeye_detail_result";
const FALLBACK_IMAGE = "/images/motifs/parang.jpg";

const getStoredResult = () => {
  const storedResult = sessionStorage.getItem(DETAIL_STORAGE_KEY);

  if (!storedResult) return null;

  try {
    return JSON.parse(storedResult);
  } catch {
    sessionStorage.removeItem(DETAIL_STORAGE_KEY);
    return null;
  }
};

const DetailBatik = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const resultFromState = location.state?.result;
  const result = useMemo(
    () => resultFromState || getStoredResult(),
    [resultFromState],
  );

  useEffect(() => {
    if (resultFromState) {
      sessionStorage.setItem(DETAIL_STORAGE_KEY, JSON.stringify(resultFromState));
    }
  }, [resultFromState]);

  const { prediction, confidence, info, source } = result || {};
  const motifLookupKey =
    result?.motif_key ||
    result?.motifKey ||
    result?.original_prediction ||
    result?.motif_name ||
    result?.motifName ||
    prediction;
  const localizedMotif = useMemo(
    () =>
      result
        ? getLocalizedMotifByName(motifLookupKey, i18n.resolvedLanguage)
        : null,
    [
      i18n.resolvedLanguage,
      motifLookupKey,
      result,
    ],
  );

  if (!result) {
    return (
      <div className="max-w-4xl mx-auto p-10 text-center">
        <h2 className="text-2xl font-serif text-batik-brown mb-4">
          {t("detail.notFoundTitle")}
        </h2>
        <p className="mb-6">{t("detail.notFoundMessage")}</p>
        <button
          onClick={() => navigate("/upload")}
          className="bg-batik-gold text-white px-6 py-2 rounded-full hover:bg-batik-brown"
        >
          {t("detail.backToUpload")}
        </button>
      </div>
    );
  }

  const displayPrediction = localizedMotif?.name || prediction;
  const displayInfo = localizedMotif
    ? {
        origin: localizedMotif.origin || info?.origin,
        philosophy: localizedMotif.philosophy || info?.philosophy,
        history: localizedMotif.history || info?.history,
        colors: localizedMotif.colors || info?.colors,
        usage: localizedMotif.usage || info?.usage,
      }
    : info || {};
  const hasConfidence =
    confidence !== null && confidence !== undefined && confidence !== "";
  const confidencePercent = hasConfidence
    ? (Number(confidence) <= 1
        ? Number(confidence) * 100
        : Number(confidence)
      ).toFixed(2)
    : null;
  const isFromGallery = source === "gallery";

  const normalizeFilename = (name) =>
    name?.toLowerCase().replace(/\s+/g, "-").replace(/_/g, "-") + ".jpg" ||
    "parang.jpg";
  const imageUrl =
    result.image_url ||
    localizedMotif?.image ||
    `/images/motifs/${normalizeFilename(motifLookupKey || prediction)}`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center hover:text-batik-gold"
        >
          <FaArrowLeft className="mr-2" /> {t("common.back")}
        </button>
        <span className="mx-2">/</span>
        <span className="text-batik-brown font-medium">
          {t("detail.detailMotif")}
        </span>
      </div>

      {/* Header */}
      <h1 className="font-serif text-3xl md:text-4xl font-bold text-batik-brown mb-2">
        {displayPrediction}
      </h1>
      <div className="flex items-center gap-4 mb-8">
        {/* Tampilkan confidence hanya jika bukan dari gallery dan confidence ada */}
        {!isFromGallery && hasConfidence && (
          <span className="bg-batik-gold/20 text-batik-brown text-sm px-3 py-1 rounded-full">
            {t("common.accuracy")}: {confidencePercent}%
          </span>
        )}
        {displayInfo?.origin && (
          <span className="flex items-center text-gray-600 text-sm">
            <FaMapMarkerAlt className="mr-1" /> {displayInfo.origin}
          </span>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Left: Image */}
        <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
          <img
            src={imageUrl}
            alt={displayPrediction}
            className="w-full aspect-[4/3] rounded-lg border border-gray-100 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = FALLBACK_IMAGE;
            }}
          />
        </div>

        {/* Right: Details */}
        <div className="space-y-6">
          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <h2 className="flex items-center text-xl font-semibold text-batik-brown mb-3">
              <FaBook className="mr-2" /> {t("detail.philosophy")}
            </h2>
            <p className="text-gray-700">
              {displayInfo?.philosophy || t("common.notAvailable")}
            </p>
          </div>
          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <h2 className="flex items-center text-xl font-semibold text-batik-brown mb-3">
              <FaHistory className="mr-2" /> {t("detail.history")}
            </h2>
            <p className="text-gray-700">
              {displayInfo?.history || t("common.notAvailable")}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {displayInfo?.colors && displayInfo.colors.length > 0 && (
              <div className="bg-white border rounded-xl p-4 shadow-sm">
                <h3 className="flex items-center font-semibold text-batik-brown mb-2">
                  <FaTint className="mr-2" /> {t("detail.colors")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {displayInfo.colors.map((c, i) => (
                    <span
                      key={i}
                      className="text-xs bg-gray-100 px-2 py-1 rounded-full"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {displayInfo?.usage && (
              <div className="bg-white border rounded-xl p-4 shadow-sm">
                <h3 className="font-semibold text-batik-brown mb-2">
                  {t("detail.usage")}
                </h3>
                <p className="text-sm text-gray-600">{displayInfo.usage}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailBatik;
