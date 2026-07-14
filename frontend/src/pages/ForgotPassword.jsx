import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaEnvelope, FaSpinner } from "react-icons/fa";
import { api, getApiErrorMessage } from "../lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      setIsLoading(true);
      await api.post(
        "/api/forgot-password",
        {
          email,
          redirect_url: `${window.location.origin}/reset-password`,
        },
        { skipAuth: true },
      );

      setMessage(t("auth.messages.forgotSuccess"));
    } catch (err) {
      setError(
        getApiErrorMessage(err, t("auth.messages.forgotFailure"), t),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-3 text-center">
        {t("auth.messages.forgotTitle")}
      </h2>
      <p className="text-sm text-gray-600 text-center mb-6">
        {t("auth.messages.forgotDescription")}
      </p>

      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            {t("common.email")}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="text-gray-400" />
            </div>
            <input
              type="email"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-batik-gold text-white py-2 rounded-md hover:bg-batik-brown transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin" /> {t("common.sending")}
            </>
          ) : (
            t("auth.messages.sendResetLink")
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
