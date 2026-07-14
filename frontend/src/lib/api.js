import axios from "axios";

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:8000";
const useCredentials = import.meta.env.VITE_API_WITH_CREDENTIALS === "true";

export const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: useCredentials,
});

api.interceptors.request.use((config) => {
  if (config.skipAuth) {
    return config;
  }

  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getAuthPayload = (data) => {
  const user = data?.user || data?.profile || data?.data?.user || data?.data;
  const token =
    data?.token ||
    data?.access_token ||
    data?.accessToken ||
    data?.session?.access_token ||
    data?.data?.access_token ||
    data?.data?.accessToken ||
    data?.data?.token;

  return { user, token };
};

const getTranslatedValue = (translate, key, fallback, options = {}) => {
  if (typeof translate !== "function") return fallback;

  return translate(key, { defaultValue: fallback, ...options });
};

const formatRetryAfter = (value, translate) => {
  const seconds = Number(value);

  if (!value || Number.isNaN(seconds)) {
    return getTranslatedValue(translate, "common.fewMoments", "beberapa saat");
  }
  if (seconds < 60) {
    return getTranslatedValue(translate, "common.seconds", `${seconds} detik`, {
      count: seconds,
    });
  }

  const minutes = Math.ceil(seconds / 60);
  return getTranslatedValue(translate, "common.minutes", `${minutes} menit`, {
    count: minutes,
  });
};

const normalizeErrorCode = (code) =>
  String(code || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const getErrorCode = (data) =>
  data?.code ||
  data?.error_code ||
  data?.errorCode ||
  data?.error?.code ||
  data?.detail?.code;

const getDetailMessage = (detail) => {
  if (!detail) return "";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((item) => item?.msg || item?.message || item)
      .filter(Boolean)
      .join(", ");
  }

  return detail.message || detail.msg || "";
};

export const getApiErrorMessage = (error, fallback, translate) => {
  const data = error.response?.data;
  const errorCode = normalizeErrorCode(getErrorCode(data));
  const translatedMessage = errorCode
    ? getTranslatedValue(translate, `backendErrors.${errorCode}`, "", {
        code: errorCode,
      })
    : "";
  const detail = getDetailMessage(data?.detail);
  const message = data?.message;
  const retryAfter = error.response?.headers?.["retry-after"];
  const baseMessage =
    translatedMessage || detail || message || error.message || fallback;

  if (error.response?.status === 429 && retryAfter) {
    const retryMessage = getTranslatedValue(
      translate,
      "backendErrors.retryAfter",
      `Coba lagi dalam ${formatRetryAfter(retryAfter, translate)}.`,
      { time: formatRetryAfter(retryAfter, translate) },
    );

    return `${baseMessage} ${retryMessage}`;
  }

  return baseMessage;
};
