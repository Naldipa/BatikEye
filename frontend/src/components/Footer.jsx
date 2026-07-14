import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaInstagram,
  FaFacebook,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-batik-dark text-gray-300 pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Kolom 1: Brand & Deskripsi */}
          <div>
            <h3 className="font-serif text-xl font-semibold text-batik-gold mb-3">
              BatikEye
            </h3>
            <p className="text-sm leading-relaxed">
              {t("footer.description")}
            </p>
          </div>

          {/* Kolom 2: Tautan Cepat */}
          <div>
            <h4 className="font-semibold text-white mb-3">
              {t("footer.links")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-batik-gold transition">
                  {t("navbar.home")}
                </Link>
              </li>
              <li>
                <Link
                  to="/gallery"
                  className="hover:text-batik-gold transition"
                >
                  {t("navbar.gallery")}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-batik-gold transition">
                  {t("navbar.about")}
                </Link>
              </li>
              <li>
                <Link to="/upload" className="hover:text-batik-gold transition">
                  {t("navbar.upload")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Yayasan Maleo */}
          <div>
            <h4 className="font-semibold text-white mb-3">Yayasan Maleo</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <FaMapMarkerAlt className="mt-0.5 text-batik-gold" />
                <span>Jalan Kebudayaan No. 45, Yogyakarta</span>
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-batik-gold" />
                <a
                  href="mailto:info@yayasanmaleo.org"
                  className="hover:text-batik-gold"
                >
                  info@yayasanmaleo.org
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Sosial Media */}
          <div>
            <h4 className="font-semibold text-white mb-3">
              {t("footer.followUs")}
            </h4>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com/yayasanmaleo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-batik-gold transition text-2xl"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="https://facebook.com/yayasanmaleo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-batik-gold transition text-2xl"
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>
            </div>
            <p className="text-xs mt-4">
              {t("footer.support")}
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} BatikEye - {t("footer.copyright")}
        </div>
      </div>
    </footer>
  );
}
