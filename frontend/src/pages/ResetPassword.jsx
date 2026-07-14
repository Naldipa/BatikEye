import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaEye, FaEyeSlash, FaLock, FaSpinner } from "react-icons/fa";
import { api, getApiErrorMessage } from "../lib/api";

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const resetParams = useMemo(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const normalizedHash = (window.location.hash || "")
      .replace(/^#\/?reset-password\??/, "")
      .replace(/^#/, "");
    const hashParams = new URLSearchParams(normalizedHash);
    const getParam = (key) => searchParams.get(key) || hashParams.get(key);

    const urlError = getParam("error");
    const errorCode = getParam("error_code");
    const errorDescription = getParam("error_description");
    const accessToken = getParam("access_token");
    const refreshToken = getParam("refresh_token");
    const tokenHash = getParam("token_hash");
    const code = getParam("code");
    const token = getParam("token");
    const email = getParam("email");

    return {
      error: urlError,
      errorCode,
      errorDescription,
      accessToken,
      token,
      tokenHash,
      code,
      refreshToken,
      email,
      needsEmail: Boolean(token) && !accessToken && !tokenHash && !code,
      hasResetCredential: Boolean(accessToken || tokenHash || code || token),
    };
  }, []);

  const urlErrorMessage = resetParams.error
    ? resetParams.errorCode === "otp_expired"
      ? t("auth.messages.resetTokenExpired")
      : resetParams.errorDescription ||
        t("auth.messages.resetTokenInvalid")
    : "";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (resetParams.error) {
      setError(urlErrorMessage);
      return;
    }

    if (!resetParams.hasResetCredential) {
      setError(
        t("auth.messages.resetTokenMissing"),
      );
      return;
    }

    if (resetParams.needsEmail && !(formData.email || resetParams.email)) {
      setError(t("auth.messages.resetEmailRequired"));
      return;
    }

    if (formData.password.length < 6) {
      setError(t("auth.messages.resetPasswordMin"));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t("auth.messages.resetPasswordMismatch"));
      return;
    }

    try {
      setIsLoading(true);
      const payload = { password: formData.password };

      if (resetParams.accessToken) {
        payload.token = resetParams.accessToken;

        if (resetParams.refreshToken) {
          payload.refresh_token = resetParams.refreshToken;
        }
      } else if (resetParams.tokenHash) {
        payload.token = `token_hash=${resetParams.tokenHash}`;
      } else if (resetParams.code) {
        payload.token = `code=${resetParams.code}`;
      } else if (resetParams.token) {
        payload.token = resetParams.token;
        payload.email = resetParams.email || formData.email;
      }

      await api.post(
        "/api/reset-password",
        payload,
        { skipAuth: true },
      );

      setMessage(t("auth.messages.resetSuccess"));
      setFormData({ email: "", password: "", confirmPassword: "" });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(
        getApiErrorMessage(err, t("auth.messages.resetFailure"), t),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-3 text-center">
        {t("auth.messages.resetTitle")}
      </h2>
      <p className="text-sm text-gray-600 text-center mb-6">
        {t("auth.messages.resetDescription")}
      </p>

      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">
          {message}
        </div>
      )}

      {(error || urlErrorMessage) && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
          {error || urlErrorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {resetParams.needsEmail && !resetParams.email && (
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("common.email")}
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">
            {t("auth.newPassword")}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label={
                showPassword
                  ? t("auth.hidePassword")
                  : t("auth.showPassword")
              }
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t("auth.confirmPassword")}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="text-gray-400" />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label={
                showConfirmPassword
                  ? t("auth.hideConfirmPassword")
                  : t("auth.showConfirmPassword")
              }
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-batik-gold text-white py-2 rounded-md hover:bg-batik-brown transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin" /> {t("common.saving")}
            </>
          ) : (
            t("auth.messages.saveNewPassword")
          )}
        </button>
      </form>

      <div className="mt-4 text-center text-sm">
        <button
          onClick={() => navigate("/login")}
          className="text-blue-600 hover:underline font-medium"
        >
          {t("auth.backToLogin")}
        </button>
      </div>
    </div>
  );
}
