import { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../context/AuthContextValue";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user, logout, loading } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleLanguageChange = (e) => {
    const nextLanguage = e.target.value;
    i18n.changeLanguage(nextLanguage);
    localStorage.setItem("batikeye_language", nextLanguage);
  };

  const navLinks = [
    { name: t("navbar.home"), path: "/" },
    { name: t("navbar.gallery"), path: "/gallery" },
    { name: t("navbar.about"), path: "/about" },
    { name: t("navbar.upload"), path: "/upload" },
    ...(isAuthenticated ? [{ name: t("navbar.history"), path: "/history" }] : []),
  ];

  const isActive = (path) => location.pathname === path;
  const activeLanguage = i18n.resolvedLanguage || i18n.language || "id";
  const currentLanguage = activeLanguage.startsWith("en") ? "en" : "id";
  const userName = user?.full_name || user?.email?.split("@")[0];

  const languageSelect = (
    <label className="inline-flex items-center gap-2 text-xs text-gray-600">
      <span className="sr-only">{t("common.language")}</span>
      <select
        value={currentLanguage}
        onChange={handleLanguageChange}
        className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-batik-gold"
        aria-label={t("common.language")}
      >
        <option value="id">ID</option>
        <option value="en">EN</option>
      </select>
    </label>
  );

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-md"
          : "bg-white shadow-sm"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="font-serif text-2xl font-bold text-batik-brown hover:text-batik-gold transition-colors"
          >
            BatikEye
          </Link>

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-batik-gold ${
                  isActive(link.path)
                    ? "text-batik-gold border-b-2 border-batik-gold"
                    : "text-gray-700"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons Desktop */}
          <div className="hidden sm:flex items-center space-x-4">
            {languageSelect}
            {loading ? (
              <div className="h-8 w-36 rounded-md bg-gray-100" />
            ) : isAuthenticated ? (
              <>
                <span className="text-sm text-gray-700">
                  <span className="font-semibold text-batik-brown">
                    {t("navbar.greeting", { name: userName })}
                  </span>
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-1.5 rounded-md border border-batik-brown text-batik-brown hover:bg-batik-brown hover:text-white transition"
                >
                  {t("navbar.logout")}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-1.5 rounded-md bg-batik-gold text-white hover:bg-batik-brown transition shadow-sm"
                >
                  {t("navbar.login")}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 rounded-md border border-batik-brown text-batik-brown hover:bg-batik-brown hover:text-white transition"
                >
                  {t("navbar.register")}
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
            aria-label="Menu"
          >
            <i
              className={`fas ${isMenuOpen ? "fa-times" : "fa-bars"} text-xl`}
            />
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="sm:hidden mt-4 pt-2 border-t border-gray-100 space-y-2">
            <div className="px-3 py-2">{languageSelect}</div>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? "bg-batik-gold/10 text-batik-gold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {link.name}
              </Link>
            ))}
            {loading ? (
              <div className="px-3 py-2 text-sm text-gray-400">
                {t("navbar.loadingSession")}
              </div>
            ) : isAuthenticated ? (
              <>
                <div className="px-3 py-2 text-sm text-gray-700">
                  <span className="font-semibold">
                    {t("navbar.greeting", { name: userName })}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  {t("navbar.logout")}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  {t("navbar.login")}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-md bg-batik-gold text-white text-center hover:bg-batik-brown"
                >
                  {t("navbar.register")}
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
