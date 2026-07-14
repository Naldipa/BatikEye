// src/pages/About.jsx
import {
  FaArrowRight,
  FaQuoteLeft,
  FaGraduationCap,
  FaHandHoldingHeart,
  FaSchool,
  FaLeaf,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const HISTORY_IMAGE_SRC = "/images/sejarah-batik.jpg?v=portrait-20260624";

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-batik-brown/5 to-batik-gold/10 py-14 md:py-16">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <svg
            className="absolute left-0 top-0 h-44 w-56 text-batik-brown/15 md:h-56 md:w-72"
            viewBox="0 0 260 210"
            fill="none"
          >
            <path
              d="M16 148C56 120 48 70 93 55C138 40 166 70 153 101C141 130 100 118 106 88C113 53 166 36 216 62"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M28 176C75 142 122 151 140 184M44 114C67 106 86 92 97 72M120 32C132 55 151 70 178 75"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <path
              d="M72 151C86 131 113 129 129 146C105 151 91 162 86 184C77 174 73 163 72 151Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M187 99C202 81 230 84 241 105C218 103 204 111 195 130C188 121 185 110 187 99Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
          <svg
            className="absolute bottom-0 right-0 h-48 w-60 text-batik-gold/25 md:h-60 md:w-80"
            viewBox="0 0 290 220"
            fill="none"
          >
            <path
              d="M273 58C224 71 211 114 172 124C125 136 94 101 110 67C126 34 174 48 168 83C162 118 106 132 56 102"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M252 93C229 105 212 124 204 149M150 168C139 141 119 124 91 116M239 34C209 37 188 50 175 73"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <path
              d="M55 70C77 63 99 75 105 98C84 88 68 90 51 104C48 92 49 80 55 70Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M187 151C205 134 234 141 244 165C221 160 205 167 193 186C187 174 185 162 187 151Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
          <div className="absolute left-1/2 top-8 h-px w-56 -translate-x-1/2 bg-gradient-to-r from-transparent via-batik-gold/45 to-transparent" />
          <div className="absolute left-1/2 bottom-8 h-px w-72 -translate-x-1/2 bg-gradient-to-r from-transparent via-batik-brown/15 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-batik-brown mb-4">
            {t("about.title")}
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            {t("about.hero")}
          </p>
        </div>
      </section>

      {/* Latar Belakang */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="min-w-0">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-batik-brown mb-4">
              {t("about.backgroundTitle")}
            </h2>
            <div className="space-y-3 text-left leading-relaxed text-gray-700 lg:text-justify">
              <p>{t("about.background1")}</p>
              <p>{t("about.background2")}</p>
              <p>{t("about.background3")}</p>
              <p>{t("about.background4")}</p>
            </div>
          </div>

          <aside className="rounded-lg border border-batik-gold/20 bg-batik-cream p-6 text-center shadow-sm lg:mt-32">
            <FaQuoteLeft className="text-batik-gold text-4xl mx-auto mb-4" />
            <p className="mx-auto max-w-xs break-words font-serif text-2xl leading-snug text-batik-brown">
              &quot;{t("about.quote")}&quot;
            </p>
            <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-batik-gold/70" />
          </aside>
        </div>
      </section>

      {/* Sejarah Singkat Batik */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[470px_minmax(0,1fr)] lg:items-start">
            <figure className="order-2 mx-auto w-full max-w-[470px] overflow-hidden rounded-lg border border-gray-200 bg-white p-3 shadow-sm lg:order-1">
              <img
                src={HISTORY_IMAGE_SRC}
                alt={t("about.historyImageAlt")}
                className="block h-auto max-h-[680px] w-full rounded-md object-contain"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/images/motifs/parang.jpg";
                }}
              />
              <figcaption className="px-1 pt-3 text-center text-xs text-gray-500">
                {t("about.historyImageAlt")}
              </figcaption>
            </figure>
            <div className="order-1 min-w-0 lg:order-2">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold text-batik-brown mb-4">
                {t("about.historyTitle")}
              </h2>
              <div className="space-y-3 text-left leading-relaxed text-gray-700 lg:text-justify">
                <p>{t("about.history1")}</p>
                <p>{t("about.history2")}</p>
                <p>{t("about.history3")}</p>
                <p>{t("about.history4")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filosofi Motif */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="font-serif text-2xl md:text-3xl font-semibold text-batik-brown text-center mb-8">
          {t("about.philosophyTitle")}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-batik-gold/20 rounded-full flex items-center justify-center mb-4">
              <FaLeaf className="text-batik-gold text-xl" />
            </div>
            <h3 className="font-bold text-batik-brown text-lg mb-2">Parang</h3>
            <p className="text-gray-600 text-sm">
              {t("about.parangMeaning")}
            </p>
          </div>
          <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-batik-gold/20 rounded-full flex items-center justify-center mb-4">
              <FaLeaf className="text-batik-gold text-xl" />
            </div>
            <h3 className="font-bold text-batik-brown text-lg mb-2">Kawung</h3>
            <p className="text-gray-600 text-sm">
              {t("about.kawungMeaning")}
            </p>
          </div>
          <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-batik-gold/20 rounded-full flex items-center justify-center mb-4">
              <FaLeaf className="text-batik-gold text-xl" />
            </div>
            <h3 className="font-bold text-batik-brown text-lg mb-2">
              Mega Mendung
            </h3>
            <p className="text-gray-600 text-sm">
              {t("about.megaMendungMeaning")}
            </p>
          </div>
        </div>
        <p className="text-center text-gray-600 mt-8">
          {t("about.philosophyClosing")}
        </p>
      </section>

      {/* Yayasan Maleo */}
      <section className="bg-gradient-to-b from-white to-batik-cream/30 py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block bg-batik-gold/10 rounded-full px-4 py-1 mb-4">
            <p className="text-batik-gold text-sm font-semibold">
              {t("about.partnerBadge")}
            </p>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-batik-brown mb-4">
            {t("about.partnerTitle")}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6 leading-relaxed">
            {t("about.partner1")}
          </p>
          <p className="text-gray-600 max-w-2xl mx-auto mb-10 text-sm">
            {t("about.partner2")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-10">
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-batik-gold/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaGraduationCap className="text-2xl text-batik-gold" />
              </div>
              <h3 className="font-semibold text-batik-brown mb-1">
                {t("about.freeEducation")}
              </h3>
              <p className="text-xs text-gray-500">
                {t("about.freeEducationDesc")}
              </p>
            </div>
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-batik-gold/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaHandHoldingHeart className="text-2xl text-batik-gold" />
              </div>
              <h3 className="font-semibold text-batik-brown mb-1">
                {t("about.youth")}
              </h3>
              <p className="text-xs text-gray-500">{t("about.youthDesc")}</p>
            </div>
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-batik-gold/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaSchool className="text-2xl text-batik-gold" />
              </div>
              <h3 className="font-semibold text-batik-brown mb-1">
                {t("about.sustainableProgram")}
              </h3>
              <p className="text-xs text-gray-500">
                {t("about.sustainableProgramDesc")}
              </p>
            </div>
          </div>
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 bg-batik-gold text-white px-6 py-3 rounded-full font-semibold hover:bg-batik-brown transition shadow-md"
          >
            {t("about.exploreCollection")} <FaArrowRight className="text-sm" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
