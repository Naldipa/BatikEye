import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Webcam from "react-webcam";
import { AuthContext } from "../context/AuthContextValue";
import { api, getApiErrorMessage } from "../lib/api";
import {
  FaCloudUploadAlt,
  FaCheckCircle,
  FaFileImage,
  FaCamera,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";
import ContohBatik from "../components/ContohBatik";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

const Upload = () => {
  const { isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  const cameraConstraints = {
    facingMode: { ideal: "environment" },
  };

  const dataUrlToFile = (dataUrl, filename) => {
    const [metadata, base64Data] = dataUrl.split(",");
    const mime = metadata.match(/:(.*?);/)?.[1] || "image/jpeg";
    const binary = atob(base64Data);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }

    return new File([bytes], filename, { type: mime });
  };

  const validateImageFile = (file) => {
    if (!file) return t("upload.errors.chooseFirst");

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return t("upload.errors.invalidFormat");
    }

    if (file.size > MAX_FILE_SIZE) {
      return t("upload.errors.tooLarge");
    }

    return "";
  };

  const setImageFile = (file, previewUrl) => {
    const validationError = validateImageFile(file);

    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setSelectedFile(file);
    setPreview(previewUrl || URL.createObjectURL(file));
    setIsCameraOpen(false);
    setCameraError("");
    setError("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setIsCameraOpen(false);
    setCameraError("");
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleOpenCamera = () => {
    setCameraError("");
    setError("");
    setIsCameraOpen(true);
  };

  const handleCloseCamera = () => {
    setIsCameraOpen(false);
    setCameraError("");
  };

  const handleCapturePhoto = () => {
    const screenshot = webcamRef.current?.getScreenshot();

    if (!screenshot) {
      setCameraError(t("upload.cameraNotReady"));
      return;
    }

    const file = dataUrlToFile(screenshot, `batik-camera-${Date.now()}.jpg`);
    setImageFile(file, screenshot);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError("");

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const validationError = validateImageFile(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setLoading(true);
      const response = await api.post("/api/predict", formData);

      const data = response.data;
      if (!data.is_batik) {
        setError(
          getApiErrorMessage(
            { response: { data, status: 400, headers: {} } },
            t("upload.errors.notBatik"),
            t,
          ),
        );
        return;
      }
      navigate("/detail", { state: { result: response.data } });
    } catch (error) {
      setError(getApiErrorMessage(error, t("upload.errors.generic"), t));
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <FaSpinner className="animate-spin text-batik-gold text-3xl mx-auto mb-3" />
        <p className="text-gray-600">{t("upload.loadingSession")}</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-serif text-batik-brown mb-4">
          {t("upload.title")}
        </h1>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-yellow-700">{t("upload.mustLogin")}</p>
        </div>
        <button
          onClick={() => navigate("/login")}
          className="bg-batik-gold text-white px-6 py-2 rounded-full hover:bg-batik-brown transition"
        >
          {t("auth.loginNow")}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-serif font-semibold text-batik-brown text-center mb-2">
        {t("upload.title")}
      </h1>
      <p className="text-center text-gray-600 mb-8">{t("upload.subtitle")}</p>

      <form onSubmit={handleUpload}>
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:border-batik-gold hover:text-batik-brown transition"
          >
            <FaFileImage />
            {t("upload.selectImage")}
          </button>
          <button
            type="button"
            onClick={isCameraOpen ? handleCloseCamera : handleOpenCamera}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-batik-brown text-white rounded-lg hover:bg-batik-gold transition"
          >
            {isCameraOpen ? <FaTimes /> : <FaCamera />}
            {isCameraOpen ? t("upload.closeCamera") : t("upload.openCamera")}
          </button>
        </div>

        {isCameraOpen && (
          <div className="mb-6 overflow-hidden rounded-lg border border-gray-200 bg-gray-950">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={cameraConstraints}
              className="w-full aspect-video object-cover"
              onUserMedia={() => setCameraError("")}
              onUserMediaError={() =>
                setCameraError(t("upload.cameraUnavailable"))
              }
            />
            <div className="flex flex-col sm:flex-row gap-3 justify-center p-4 bg-white">
              <button
                type="button"
                onClick={handleCapturePhoto}
                className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-batik-gold text-white rounded-lg hover:bg-batik-brown transition"
              >
                <FaCamera />
                {t("upload.capturePhoto")}
              </button>
              <button
                type="button"
                onClick={handleCloseCamera}
                className="inline-flex items-center justify-center gap-2 px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                <FaTimes />
                {t("common.cancel")}
              </button>
            </div>
          </div>
        )}

        {cameraError && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
            {cameraError}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
            {error}
          </div>
        )}

        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${selectedFile ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-batik-gold"}`}
          onClick={() => fileInputRef.current.click()}
        >
          {preview ? (
            <div className="flex flex-col items-center">
              <img
                src={preview}
                alt={t("media.previewAlt")}
                className="max-h-48 rounded-lg shadow mb-3"
              />
              <FaCheckCircle className="text-green-500 text-3xl mb-2" />
              <p className="text-gray-700 flex items-center gap-2">
                <FaFileImage className="text-batik-brown" />
                {selectedFile.name}
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleReset();
                }}
                className="mt-2 text-sm text-red-500"
              >
                {t("upload.delete")}
              </button>
            </div>
          ) : (
            <>
              <FaCloudUploadAlt className="mx-auto text-5xl text-gray-400 mb-3" />
              <p className="text-gray-600">{t("upload.dropHint")}</p>
              <p className="text-xs text-gray-400 mt-1">
                {t("upload.fileHint")}
              </p>
            </>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png"
            className="hidden"
          />
        </div>

        <div className="flex justify-center space-x-4 mt-8">
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition"
          >
            {t("common.reset")}
          </button>
          <button
            type="submit"
            disabled={!selectedFile || loading}
            className="px-6 py-2 bg-batik-gold text-white rounded-full shadow hover:bg-batik-brown transition disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" /> {t("upload.identifying")}
              </>
            ) : (
              t("upload.identifyNow")
            )}
          </button>
        </div>
      </form>

      <div className="mt-16">
        <h3 className="font-semibold text-gray-800 mb-3">
          {t("upload.sampleTitle")}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {["Parang", "Kawung", "MegaMendung", "Sidoluhur", "Truntum"].map(
            (m) => (
              <ContohBatik key={m} label={m} />
            ),
          )}
        </div>
      </div>
    </div>
  );
};

export default Upload;
