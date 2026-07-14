import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaUser,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaCheck,
  FaSpinner,
} from "react-icons/fa";
import { api, getApiErrorMessage } from "../lib/api";

const emptyRegisterForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const emptyTouched = {
  name: false,
  email: false,
  password: false,
  confirmPassword: false,
};

export default function Register() {
  const [formData, setFormData] = useState(emptyRegisterForm);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState(emptyTouched);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    setFormData(emptyRegisterForm);
    setTouched(emptyTouched);
    setError("");
    setIsSuccess(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError(t("auth.validation.nameRequired"));
      return false;
    }
    if (!formData.email) {
      setError(t("auth.validation.emailRequired"));
      return false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError(t("auth.validation.emailInvalid"));
      return false;
    }
    if (!formData.password) {
      setError(t("auth.validation.passwordRequired"));
      return false;
    } else if (formData.password.length < 6) {
      setError(t("auth.validation.passwordMin"));
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(t("auth.validation.passwordMismatch"));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;

    try {
      setIsLoading(true);

      await api.post(
        "/api/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        },
        { skipAuth: true },
      );

      setIsSuccess(true);
      setFormData(emptyRegisterForm);
      setTouched(emptyTouched);
    } catch (err) {
      setError(getApiErrorMessage(err, t("auth.messages.backendUnavailable"), t));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {t("auth.registerTitle")}
      </h2>

      {isSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md flex items-center">
          <FaCheck className="mr-2" />
          {t("auth.messages.registerSuccess")}
        </div>
      )}

      {error && !isSuccess && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
          {error}
        </div>
      )}

      {!isSuccess ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama Lengkap */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("auth.fullName")}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={() => handleBlur("name")}
                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  touched.name && !formData.name
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
            </div>
            {touched.name && !formData.name && (
              <p className="mt-1 text-xs text-red-600">
                {t("auth.validation.nameRequired")}
              </p>
            )}
          </div>

          {/* Email */}
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
                autoComplete="off"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur("email")}
                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  touched.email && !formData.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
            </div>
            {touched.email && !formData.email && (
              <p className="mt-1 text-xs text-red-600">
                {t("auth.validation.emailRequired")}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("common.password")}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                onBlur={() => handleBlur("password")}
                className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  touched.password && !formData.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
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
            {formData.password && formData.password.length < 6 && (
              <p className="mt-1 text-xs text-red-600">
                {t("auth.validation.passwordMin")}
              </p>
            )}
          </div>
          {/* Konfirmasi Password */}
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
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={() => handleBlur("confirmPassword")}
                className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  touched.confirmPassword && !formData.confirmPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
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
            {touched.confirmPassword && !formData.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">
                {t("auth.validation.confirmPasswordRequired")}
              </p>
            )}
            {formData.confirmPassword &&
              formData.password !== formData.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">
                  {t("auth.validation.passwordMismatch")}
                </p>
              )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors flex justify-center items-center gap-2"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin" /> {t("common.loading")}
              </>
            ) : (
              t("auth.register")
            )}
          </button>
        </form>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-600">
            {t("auth.messages.registerSuccessInfo")}
          </p>
        </div>
      )}

      <div className="mt-4 text-center text-sm">
        <p className="text-gray-600">
          {t("auth.alreadyHaveAccount")}{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline font-medium"
          >
            {t("auth.loginHere")}
          </button>
        </p>
      </div>
    </div>
  );
}
