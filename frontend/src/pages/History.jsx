import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaCalendarAlt,
  FaChevronRight,
  FaHistory,
  FaImage,
  FaSpinner,
  FaUser,
} from "react-icons/fa";
import { AuthContext } from "../context/AuthContextValue";
import { api, getApiErrorMessage } from "../lib/api";
import {
  getLocalizedMotifMetadata,
  getLocalizedMotifs,
} from "../data/localizedMotifs";

const historyEndpoint =
  import.meta.env.VITE_HISTORY_API_URL || "/api/history";

const getHistoryItems = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.history)) return payload.history;
  if (Array.isArray(payload?.upload_history)) return payload.upload_history;
  if (Array.isArray(payload?.uploadHistory)) return payload.uploadHistory;
  if (Array.isArray(payload?.histories)) return payload.histories;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.records)) return payload.records;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.history)) return payload.data.history;
  if (Array.isArray(payload?.data?.upload_history)) {
    return payload.data.upload_history;
  }
  if (Array.isArray(payload?.data?.results)) return payload.data.results;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  if (Array.isArray(payload?.data?.records)) return payload.data.records;

  return [];
};

const getTimestamp = (item) =>
  firstValue(item.created_at, item.createdAt, item.timestamp, item.date);

const sortHistoryItems = (items) =>
  [...items].sort((a, b) => {
    const timeA = new Date(getTimestamp(a) || 0).getTime();
    const timeB = new Date(getTimestamp(b) || 0).getTime();

    return timeB - timeA;
  });

const formatConfidence = (value) => {
  if (value === null || value === undefined || value === "") return null;

  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) return null;

  const percentage = numberValue <= 1 ? numberValue * 100 : numberValue;
  return `${percentage.toFixed(2)}%`;
};

const formatDate = (value, language) => {
  if (!value) return null;

  return new Intl.DateTimeFormat(language === "en" ? "en-US" : "id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

const getUploaderName = (item) =>
  firstValue(
    item.user_name,
    item.userName,
    item.full_name,
    item.fullName,
    item.name,
    item.profile?.full_name,
    item.profile?.name,
    item.profiles?.full_name,
    item.profiles?.name,
    item.user?.full_name,
    item.user?.name,
    item.user?.email,
    item.email,
    item.user_email,
    item.userEmail,
  );

const normalizeKey = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const firstValue = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "");

const motifIdMap = {
  0: "Bokor Kencono",
  1: "Jumputan",
  2: "Kawung",
  3: "Mega Mendung",
  4: "Parang",
  5: "SekarJagad",
  6: "SidoLuhur",
  7: "Sidomukti",
  8: "Sidomulyo",
  9: "Srikaton",
  10: "Tribusono",
  11: "Truntum",
  12: "Wahyu Tumurun",
  13: "Wirasat",
};

export default function History() {
  const { isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const motifLookup = useMemo(() => {
    const lookup = {};
    const localizedMotifs = getLocalizedMotifs(i18n.resolvedLanguage);
    const localizedMetadata = getLocalizedMotifMetadata(i18n.resolvedLanguage);

    localizedMotifs.forEach((motif) => {
      lookup[normalizeKey(motif.originalName)] = motif;
      lookup[normalizeKey(motif.name)] = motif;
    });

    Object.entries(localizedMetadata).forEach(([name, info]) => {
      const motif = {
        ...lookup[normalizeKey(name)],
        originalName: name,
        name,
        ...info,
      };

      lookup[normalizeKey(name)] = motif;
      lookup[normalizeKey(info.name)] = motif;
    });

    return lookup;
  }, [i18n.resolvedLanguage]);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await api.get(historyEndpoint);
        setHistory(sortHistoryItems(getHistoryItems(data)));
      } catch (err) {
        setError(
          getApiErrorMessage(err, t("history.loadFailed"), t),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [authLoading, isAuthenticated, t]);

  const getMotif = (item) => {
    const relatedMotif =
      typeof item.motif === "object"
        ? item.motif
        : typeof item.motifs === "object"
          ? item.motifs
          : null;
    const motifKey = firstValue(
      item.motif_key,
      item.motifKey,
      item.info?.motif_key,
      item.info?.motifKey,
      relatedMotif?.motif_key,
      relatedMotif?.motifKey,
    );
    const motifName = firstValue(
      motifKey,
      item.motif_name,
      item.motifName,
      item.nama_motif,
      item.namaMotif,
      item.nama,
      item.label,
      item.class_name,
      item.className,
      item.prediction,
      item.prediksi,
      item.hasil_prediksi,
      item.hasilPrediksi,
      item.predicted_motif,
      item.predictedMotif,
      relatedMotif?.name,
      relatedMotif?.nama,
      relatedMotif?.motif_key,
      relatedMotif?.motifKey,
      relatedMotif?.motif_name,
      relatedMotif?.nama_motif,
      typeof item.motif === "string" ? item.motif : null,
      typeof item.motifs === "string" ? item.motifs : null,
    );
    const motifFromName = motifName
      ? motifLookup[normalizeKey(motifName)]
      : null;
    const motifNameFromId = motifIdMap[String(item.motif_id)];
    const motifFromId = motifNameFromId
      ? motifLookup[normalizeKey(motifNameFromId)]
      : null;
    const motifFromTextId =
      item.motif_id && Number.isNaN(Number(item.motif_id))
        ? motifLookup[normalizeKey(item.motif_id)]
        : null;
    const motif = motifFromName || motifFromId || motifFromTextId;
    const colors = firstValue(
      motif?.colors,
      item.colors,
      item.warna,
      item.info?.colors,
      item.info?.warna,
      relatedMotif?.colors,
      relatedMotif?.warna,
    );

    return {
      originalName: motif?.originalName || motifKey || motifNameFromId || motifName,
      name: motif?.name || motifName || motifNameFromId || t("history.unknownMotif"),
      origin: firstValue(
        motif?.origin,
        item.origin,
        item.asal,
        item.daerah,
        relatedMotif?.origin,
        relatedMotif?.asal,
        relatedMotif?.daerah,
      ),
      image: firstValue(item.image_url, item.image, motif?.image),
      info: {
        origin: firstValue(
          motif?.origin,
          item.origin,
          item.asal,
          item.daerah,
          relatedMotif?.origin,
          relatedMotif?.asal,
          relatedMotif?.daerah,
        ),
        philosophy: firstValue(
          motif?.philosophy,
          item.philosophy,
          item.filosofi,
          item.deskripsi,
          item.description,
          item.info?.philosophy,
          item.info?.filosofi,
          relatedMotif?.philosophy,
          relatedMotif?.filosofi,
          relatedMotif?.deskripsi,
        ),
        history: firstValue(
          motif?.history,
          item.history,
          item.sejarah,
          item.info?.history,
          item.info?.sejarah,
          relatedMotif?.history,
          relatedMotif?.sejarah,
        ),
        colors: Array.isArray(colors)
          ? colors
          : typeof colors === "string"
            ? colors.split(",").map((color) => color.trim()).filter(Boolean)
            : undefined,
        usage: firstValue(
          motif?.usage,
          item.usage,
          item.penggunaan,
          item.info?.usage,
          item.info?.penggunaan,
          relatedMotif?.usage,
          relatedMotif?.penggunaan,
        ),
      },
    };
  };

  const openDetail = (item) => {
    const motif = getMotif(item);

    navigate("/detail", {
      state: {
        result: {
          prediction: motif.name,
          motif_key: motif.originalName,
          original_prediction: motif.originalName,
          confidence: item.confidence,
          source: "history",
          image_url: item.image_url,
          info: motif.info,
        },
      },
    });
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <FaSpinner className="animate-spin text-batik-gold text-3xl mx-auto mb-3" />
        <p className="text-gray-600">{t("history.loading")}</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-serif text-batik-brown mb-4">
          {t("history.title")}
        </h1>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 text-left">
          <p className="text-yellow-700">
            {t("history.mustLogin")}
          </p>
        </div>
        <button
          onClick={() => navigate("/login")}
          className="bg-batik-gold text-white px-6 py-2 rounded-lg hover:bg-batik-brown transition"
        >
          {t("auth.loginNow")}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 text-batik-brown mb-2">
          <FaHistory className="text-2xl" />
          <h1 className="font-serif text-3xl md:text-4xl font-semibold">
            {t("history.title")}
          </h1>
        </div>
        <p className="text-gray-600">
          {t("history.description")}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
          {error}
        </div>
      )}

      {!error && history.length === 0 ? (
        <div className="border border-dashed border-gray-300 rounded-lg p-10 text-center bg-white">
          <FaImage className="text-4xl text-gray-300 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {t("history.emptyTitle")}
          </h2>
          <p className="text-gray-600 mb-6">
            {t("history.emptyDescription")}
          </p>
          <button
            onClick={() => navigate("/upload")}
            className="bg-batik-gold text-white px-6 py-2 rounded-lg hover:bg-batik-brown transition"
          >
            {t("history.identify")}
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item) => {
            const motif = getMotif(item);
            const confidence = formatConfidence(item.confidence);
            const uploaderName = getUploaderName(item);

            return (
              <button
                type="button"
                key={item.id || `${item.created_at}-${motif.name}`}
                onClick={() => openDetail(item)}
                className="text-left bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:border-batik-gold transition"
              >
                <div className="aspect-video bg-gray-100 overflow-hidden">
                  {motif.image ? (
                    <img
                      src={motif.image}
                      alt={motif.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaImage className="text-4xl text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h2 className="font-semibold text-lg text-batik-brown">
                        {motif.name}
                      </h2>
                      {motif.origin && (
                        <p className="text-sm text-gray-500">{motif.origin}</p>
                      )}
                    </div>
                    <FaChevronRight className="text-gray-300 mt-1 shrink-0" />
                  </div>

                  {confidence && (
                    <span className="inline-block bg-batik-gold/15 text-batik-brown text-xs font-medium px-2 py-1 rounded-md mb-3">
                      {t("common.accuracy")} {confidence}
                    </span>
                  )}

                  <div className="space-y-2 text-sm text-gray-500">
                    {uploaderName && (
                      <div className="flex items-center">
                        <FaUser className="mr-2" />
                        {uploaderName}
                      </div>
                    )}
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-2" />
                      {formatDate(getTimestamp(item), i18n.resolvedLanguage) ||
                        t("history.unknownDate")}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
