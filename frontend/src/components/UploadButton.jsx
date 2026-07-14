import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaUpload } from "react-icons/fa";

export default function UploadButton() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleClick = () => {
    navigate("/upload");
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center bg-batik-gold text-white text-xs font-normal rounded-md px-4 py-2 hover:bg-batik-brown transition-colors"
    >
      <FaUpload className="mr-2" />
      {t("uploadButton.label")}
    </button>
  );
}
