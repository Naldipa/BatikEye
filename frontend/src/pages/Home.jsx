import { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../context/AuthContextValue";
import { faBolt, faBook, faCompass } from "@fortawesome/free-solid-svg-icons";
import UploadButton from "../components/UploadButton";
import Slideshow from "../components/Slideshow";
import Feature from "../components/Feature";
import PopularMotif from "../components/PopularMotif";
import { Link } from "react-router-dom";
import BatikMap from "../components/BatikMap";
import { getLocalizedMotifs } from "../data/localizedMotifs";

export default function Home() {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const localizedMotifs = useMemo(
    () => getLocalizedMotifs(i18n.resolvedLanguage),
    [i18n.resolvedLanguage],
  );
  return (
    <main id="main-content" className="bg-gradient-to-b from-batik-cream/30 to-white">
      {/* Skip to content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-white focus:px-4 focus:py-2 focus:z-50"
      >
        {t("home.skipToContent")}
      </a>

      {/* Hero Section */}
      <section className="text-center mb-10 py-8">
        <h1 className="font-serif text-4xl text-batik-brown mb-4 animate-fade-in">
          {t("home.heroTitle")}
        </h1>
        {loading ? (
          <div className="h-10 w-48 mx-auto rounded-full bg-gray-100" />
        ) : isAuthenticated ? (
          <UploadButton />
        ) : (
          <p className="text-sm text-gray-500">
            {t("home.loginPromptPrefix")}{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              {t("navbar.login")}
            </Link>{" "}
            {t("home.loginPromptOr")}{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              {t("navbar.register")}
            </Link>{" "}
            {t("home.loginPromptSuffix")}
          </p>
        )}
      </section>

      {/* Slideshow */}
      <section className="mb-14">
        <Slideshow />
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
        <Feature
          icon={faBolt}
          title={t("home.features.fastTitle")}
          description={t("home.features.fastDescription")}
          ariaLabel={t("home.features.fastAria")}
        />
        <Feature
          icon={faBook}
          title={t("home.features.educativeTitle")}
          description={t("home.features.educativeDescription")}
          ariaLabel={t("home.features.educativeAria")}
        />
        <Feature
          icon={faCompass}
          title={t("home.features.interactiveTitle")}
          description={t("home.features.interactiveDescription")}
          ariaLabel={t("home.features.interactiveAria")}
        />
      </section>

      {/* Popular Motifs */}
      <section className="mb-14">
        <h2 className="text-xl font-bold mb-6 text-gray-900">
          {t("home.popularTitle")}
        </h2>
        <div className="grid grid-cols-1 gap-2 sm:flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 overflow-x-visible pb-2">
          {["Parang", "Kawung", "Mega Mendung", "Srikaton", "Truntum"].map(
            (motif) => (
              <PopularMotif
                key={motif}
                label={motif}
                ariaLabel={t("media.batikMotifAlt", { name: motif })}
              />
            )
          )}
        </div>
      </section>

      {/* Batik Map Section */}
      <section className="mb-14">
        <h2 className="text-xl font-bold mb-6 text-gray-900">
          {t("home.mapTitle")}
        </h2>
        <BatikMap motifs={localizedMotifs} />
      </section>
    </main>
  );
}
