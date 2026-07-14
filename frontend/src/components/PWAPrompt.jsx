import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaCheckCircle,
  FaDownload,
  FaShareSquare,
  FaSyncAlt,
  FaTimes,
} from "react-icons/fa";
import { useRegisterSW } from "virtual:pwa-register/react";

const IOS_INSTALL_DISMISSED_KEY = "batikeye_ios_install_dismissed";
const UPDATE_INTERVAL_MS = 60 * 60 * 1000;

const isStandaloneMode = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  window.navigator.standalone === true;

const isIosDevice = () =>
  /iphone|ipad|ipod/i.test(window.navigator.userAgent);

export default function PWAPrompt() {
  const { t } = useTranslation();
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showIosInstructions, setShowIosInstructions] = useState(false);
  const [installing, setInstalling] = useState(false);

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      if (!registration) return;

      window.setInterval(() => {
        registration.update();
      }, UPDATE_INTERVAL_MS);
    },
    onRegisterError(error) {
      console.error("PWA service worker registration failed:", error);
    },
  });

  useEffect(() => {
    if (
      isIosDevice() &&
      !isStandaloneMode() &&
      localStorage.getItem(IOS_INSTALL_DISMISSED_KEY) !== "true"
    ) {
      setShowIosInstructions(true);
    }

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    const handleInstalled = () => {
      setInstallPrompt(null);
      setShowIosInstructions(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const closeStatus = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  const closeIosInstructions = () => {
    localStorage.setItem(IOS_INSTALL_DISMISSED_KEY, "true");
    setShowIosInstructions(false);
  };

  const handleInstall = async () => {
    if (!installPrompt) return;

    setInstalling(true);
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
    setInstalling(false);
  };

  const showPrompt =
    installPrompt || showIosInstructions || offlineReady || needRefresh;

  if (!showPrompt) return null;

  return (
    <aside
      className="fixed bottom-4 left-4 right-4 z-[70] border border-gray-200 bg-white p-4 shadow-xl sm:left-auto sm:max-w-sm"
      aria-live="polite"
      aria-label={t("pwa.panelLabel")}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-xl text-batik-gold" aria-hidden="true">
          {needRefresh ? (
            <FaSyncAlt />
          ) : offlineReady ? (
            <FaCheckCircle />
          ) : showIosInstructions ? (
            <FaShareSquare />
          ) : (
            <FaDownload />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-semibold text-batik-brown">
            {needRefresh
              ? t("pwa.updateTitle")
              : offlineReady
                ? t("pwa.offlineTitle")
                : showIosInstructions
                  ? t("pwa.iosTitle")
                  : t("pwa.installTitle")}
          </p>
          <p className="mt-1 text-sm leading-5 text-gray-600">
            {needRefresh
              ? t("pwa.updateDescription")
              : offlineReady
                ? t("pwa.offlineDescription")
                : showIosInstructions
                  ? t("pwa.iosDescription")
                  : t("pwa.installDescription")}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {needRefresh && (
              <button
                type="button"
                onClick={() => updateServiceWorker(true)}
                className="inline-flex items-center gap-2 bg-batik-gold px-3 py-2 text-sm font-medium text-white hover:bg-batik-brown"
              >
                <FaSyncAlt aria-hidden="true" />
                {t("pwa.updateNow")}
              </button>
            )}

            {installPrompt && !needRefresh && (
              <button
                type="button"
                onClick={handleInstall}
                disabled={installing}
                className="inline-flex items-center gap-2 bg-batik-gold px-3 py-2 text-sm font-medium text-white hover:bg-batik-brown disabled:opacity-60"
              >
                <FaDownload aria-hidden="true" />
                {installing ? t("pwa.installing") : t("pwa.installNow")}
              </button>
            )}

            {(offlineReady || needRefresh) && (
              <button
                type="button"
                onClick={closeStatus}
                className="border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {t("common.close")}
              </button>
            )}
          </div>
        </div>

        {(installPrompt || showIosInstructions) && !needRefresh && (
          <button
            type="button"
            onClick={
              showIosInstructions
                ? closeIosInstructions
                : () => setInstallPrompt(null)
            }
            className="p-1 text-gray-400 hover:text-gray-700"
            aria-label={t("common.close")}
          >
            <FaTimes aria-hidden="true" />
          </button>
        )}
      </div>
    </aside>
  );
}
