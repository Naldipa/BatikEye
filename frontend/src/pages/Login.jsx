import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { AuthContext } from "../context/AuthContextValue";
import { api, getApiErrorMessage, getAuthPayload } from "../lib/api";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { t } = useTranslation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data } = await api.post(
        "/api/login",
        {
          email: formData.email,
          password: formData.password,
        },
        { skipAuth: true },
      );
      const { user, token } = getAuthPayload(data);

      if (!user) {
        throw new Error(t("auth.messages.loginResponseInvalid"));
      }

      login(user, token);
      navigate("/");
    } catch (err) {
      setError(
        getApiErrorMessage(err, t("auth.messages.backendUnavailable"), t),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {t("auth.loginTitle")}
      </h2>

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
              name="email"
              autoComplete="email"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur("email")}
              required
            />
          </div>
          {touched.email && !formData.email && (
            <p className="mt-1 text-xs text-red-600">
              {t("auth.validation.emailRequired")}
            </p>
          )}
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium">
              {t("common.password")}
            </label>
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              {t("auth.forgotPassword")}
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.password}
              onChange={handleChange}
              onBlur={() => handleBlur("password")}
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
          {touched.password && !formData.password && (
            <p className="mt-1 text-xs text-red-600">
              {t("auth.validation.passwordRequired")}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-batik-gold text-white py-2 rounded-md hover:bg-batik-brown transition-colors disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? t("common.loading") : t("auth.login")}
        </button>
      </form>

      <div className="mt-4 text-center text-sm">
        <p className="text-gray-600">
          {t("auth.dontHaveAccount")}{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-blue-600 hover:underline font-medium"
          >
            {t("auth.registerHere")}
          </button>
        </p>
      </div>
    </div>
  );
}
