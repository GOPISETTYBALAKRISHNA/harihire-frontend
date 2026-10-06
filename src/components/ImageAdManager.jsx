import { useEffect, useRef, useState } from "react";
import api from "../axiosConfig";

const FIRST_AD_DELAY = 1 * 60 * 1000;      // 1 minute
const NEXT_AD_DELAY = 12 * 60 * 1000;      // 12 minutes

const NEXT_AD_TIME_KEY = "harihire_image_ad_next_time";
const SESSION_TOKEN_KEY = "harihire_image_ad_session_token";

function ImageAdManager({
  isLoggedIn,
  isAdminLoggedIn,
  currentPath
}) {
  const [ad, setAd] = useState(null);
  const [showAd, setShowAd] = useState(false);
  const [loadingAd, setLoadingAd] = useState(false);
  const [nextAdTime, setNextAdTime] = useState(null);
  const [adReady, setAdReady] = useState(false);

  const attemptedThisCycleRef = useRef(false);

  // =====================================================
  // CHECK CURRENT PAGE PLACEMENT
  // =====================================================

  const getCurrentPlacements = (pathname) => {
    const placements = [];

    // HOME
    if (pathname === "/") {
      placements.push(
        "HOME_TOP",
        "HOME_MIDDLE"
      );
    }

    // JOBS LIST
    if (
      pathname === "/jobs" ||
      pathname.startsWith("/jobs/")
    ) {
      placements.push("JOBS_LIST");
    }

    // JOB DETAILS
    if (
      pathname.startsWith("/job/")
    ) {
      placements.push(
        "JOB_DETAILS",
        "JOB_DETAILS_SIDEBAR"
      );
    }

    // OTHER USER PAGES
    if (pathname === "/dashboard") {
      placements.push("DASHBOARD");
    }

    if (pathname === "/profile") {
      placements.push("PROFILE");
    }

    if (pathname === "/saved-jobs") {
      placements.push("SAVED_JOBS");
    }

    if (pathname === "/my-applications") {
      placements.push("MY_APPLICATIONS");
    }

    if (pathname === "/notifications") {
      placements.push("NOTIFICATIONS");
    }

    if (pathname === "/messages") {
      placements.push("MESSAGES");
    }

    if (pathname === "/chat") {
      placements.push("CHAT");
    }

    if (pathname === "/companies") {
      placements.push("COMPANIES");
    }

    if (pathname === "/resume-builder") {
      placements.push("RESUME_BUILDER");
    }

    if (pathname === "/professional-resume") {
      placements.push("PROFESSIONAL_RESUME");
    }

    if (pathname === "/simple-resume") {
      placements.push("SIMPLE_RESUME");
    }

    if (pathname === "/resume-preview") {
      placements.push("RESUME_PREVIEW");
    }

    return placements;
  };

  // =====================================================
  // CHECK IF AD IS ALLOWED ON CURRENT PAGE
  // =====================================================

  const isAdAllowedOnCurrentPage = (selectedAd) => {
    if (!selectedAd) {
      return false;
    }

    // ---------------------------------------------------
    // TARGET PAGES
    // ---------------------------------------------------

    const rawTargetPages = selectedAd.targetPages;

    let targetPages = [];

    if (Array.isArray(rawTargetPages)) {
      targetPages = rawTargetPages;
    } else if (
      typeof rawTargetPages === "string" &&
      rawTargetPages.trim() !== ""
    ) {
      targetPages = rawTargetPages
        .split(",")
        .map((page) => page.trim())
        .filter(Boolean);
    }

    // If target_pages contains actual routes,
    // use them as an additional page restriction.
    const routeTargetPages = targetPages.filter(
      (page) =>
        typeof page === "string" &&
        page.startsWith("/")
    );

    if (routeTargetPages.length > 0) {
      const routeMatched = routeTargetPages.some(
        (page) =>
          currentPath === page ||
          currentPath.startsWith(`${page}/`)
      );

      if (!routeMatched) {
        return false;
      }
    }

    // ---------------------------------------------------
    // PLACEMENTS
    // ---------------------------------------------------

    const rawPlacements = selectedAd.placements;

    let selectedPlacements = [];

    if (Array.isArray(rawPlacements)) {
      selectedPlacements = rawPlacements;
    } else if (
      typeof rawPlacements === "string" &&
      rawPlacements.trim() !== ""
    ) {
      selectedPlacements = rawPlacements
        .split(",")
        .map((item) => item.trim().toUpperCase())
        .filter(Boolean);
    }

    // No placement means don't show.
    if (selectedPlacements.length === 0) {
      return false;
    }

    const currentPlacements =
      getCurrentPlacements(currentPath);

    return selectedPlacements.some(
      (placement) =>
        currentPlacements.includes(placement)
    );
  };

  // =====================================================
  // INITIALIZE TIMER
  // =====================================================

  useEffect(() => {
    if (!isLoggedIn || isAdminLoggedIn) {
      return;
    }

    const currentToken =
      localStorage.getItem("token");

    if (!currentToken) {
      return;
    }

    const storedSessionToken =
      localStorage.getItem(SESSION_TOKEN_KEY);

    // ---------------------------------------------------
    // NEW LOGIN SESSION
    // ---------------------------------------------------

    if (
      !storedSessionToken ||
      storedSessionToken !== currentToken
    ) {
      const firstAdTime =
        Date.now() + FIRST_AD_DELAY;

      localStorage.setItem(
        SESSION_TOKEN_KEY,
        currentToken
      );

      localStorage.setItem(
        NEXT_AD_TIME_KEY,
        firstAdTime.toString()
      );

      setNextAdTime(firstAdTime);
      setAdReady(false);
      setShowAd(false);
      setAd(null);

      attemptedThisCycleRef.current = false;

      return;
    }

    // ---------------------------------------------------
    // RESTORE EXISTING TIMER
    // ---------------------------------------------------

    const storedNextTime =
      Number(
        localStorage.getItem(
          NEXT_AD_TIME_KEY
        )
      );

    if (
      storedNextTime &&
      !Number.isNaN(storedNextTime)
    ) {
      setNextAdTime(storedNextTime);

      if (Date.now() >= storedNextTime) {
        setAdReady(true);
      } else {
        setAdReady(false);
      }
    } else {
      const firstAdTime =
        Date.now() + FIRST_AD_DELAY;

      localStorage.setItem(
        NEXT_AD_TIME_KEY,
        firstAdTime.toString()
      );

      setNextAdTime(firstAdTime);
      setAdReady(false);

      attemptedThisCycleRef.current = false;
    }
  }, [
    isLoggedIn,
    isAdminLoggedIn
  ]);

  // =====================================================
  // GLOBAL TIMER
  // =====================================================

  useEffect(() => {
    if (
      !isLoggedIn ||
      isAdminLoggedIn ||
      !nextAdTime
    ) {
      return;
    }

    const checkTimer = () => {
      const remaining =
        nextAdTime - Date.now();

      if (remaining <= 0) {
        setAdReady(true);
        return;
      }

      setAdReady(false);
    };

    checkTimer();

    const interval = setInterval(
      checkTimer,
      1000
    );

    return () => {
      clearInterval(interval);
    };
  }, [
    nextAdTime,
    isLoggedIn,
    isAdminLoggedIn
  ]);

  // =====================================================
  // RESET ATTEMPT FOR NEW TIMER CYCLE
  // =====================================================

  useEffect(() => {
    attemptedThisCycleRef.current = false;
  }, [nextAdTime]);

  // =====================================================
  // LOAD IMAGE AD WHEN TIMER IS READY
  // =====================================================

  useEffect(() => {
    if (
      !isLoggedIn ||
      isAdminLoggedIn ||
      !adReady ||
      showAd ||
      loadingAd
    ) {
      return;
    }

    if (
      attemptedThisCycleRef.current
    ) {
      return;
    }

    // Current page must have a valid placement.
    // If not, timer stays ready and waits for
    // the user to navigate to an eligible page.
    const loadImageAd = async () => {
      try {
        setLoadingAd(true);
        attemptedThisCycleRef.current = true;

        const response =
          await api.get("/ads/active");

        const ads =
          Array.isArray(response.data)
            ? response.data
            : [];

        // ------------------------------------------------
        // IMAGE ADS ONLY
        // ------------------------------------------------

        const imageAds = ads.filter(
          (item) =>
            item &&
            item.adType &&
            item.adType.toUpperCase() === "IMAGE" &&
            item.imageUrl &&
            item.imageUrl.trim() !== ""
        );

        // ------------------------------------------------
        // PAGE PLACEMENT FILTER
        // ------------------------------------------------

        const eligibleAds =
          imageAds.filter(
            (item) =>
              isAdAllowedOnCurrentPage(item)
          );

        if (
          eligibleAds.length === 0
        ) {
          // Keep timer READY.
          // When user moves to another eligible page,
          // this cycle can try again.
          attemptedThisCycleRef.current = false;
          return;
        }

        // ------------------------------------------------
        // DISPLAY ORDER
        // ------------------------------------------------

        const sortedAds =
          [...eligibleAds].sort(
            (a, b) =>
              Number(
                a.displayOrder || 999999
              ) -
              Number(
                b.displayOrder || 999999
              )
          );

        const selectedAd =
          sortedAds[0];

        if (!selectedAd) {
          return;
        }

        // ------------------------------------------------
        // SHOW AD
        // ------------------------------------------------

        setAd(selectedAd);
        setShowAd(true);

        // ------------------------------------------------
        // IMPRESSION
        // ------------------------------------------------

        try {
          await api.put(
            `/ads/${selectedAd.id}/impression`
          );
        } catch (error) {
          console.error(
            "Image Ad Impression Error:",
            error
          );
        }

      } catch (error) {
        console.error(
          "Image Ad Load Error:",
          error
        );

        attemptedThisCycleRef.current = false;
      } finally {
        setLoadingAd(false);
      }
    };

    loadImageAd();

  }, [
    adReady,
    currentPath,
    isLoggedIn,
    isAdminLoggedIn,
    showAd,
    loadingAd
  ]);

  // =====================================================
  // CLOSE IMAGE AD
  // =====================================================

  const closeImageAd = async () => {
    if (!ad) {
      return;
    }

    // ---------------------------------------------------
    // CLICK TRACKING
    // ---------------------------------------------------

    try {
      await api.put(
        `/ads/${ad.id}/click`
      );
    } catch (error) {
      console.error(
        "Image Ad Click Error:",
        error
      );
    }

    // ---------------------------------------------------
    // OPEN TARGET WEBSITE
    // ---------------------------------------------------

    if (
      ad.targetUrl &&
      ad.targetUrl.trim() !== ""
    ) {
      window.open(
        ad.targetUrl.trim(),
        "_blank",
        "noopener,noreferrer"
      );
    }

    // ---------------------------------------------------
    // CLOSE POPUP
    // ---------------------------------------------------

    setShowAd(false);
    setAd(null);

    // ---------------------------------------------------
    // START 12-MINUTE TIMER
    // ---------------------------------------------------

    const nextTime =
      Date.now() + NEXT_AD_DELAY;

    localStorage.setItem(
      NEXT_AD_TIME_KEY,
      nextTime.toString()
    );

    setNextAdTime(nextTime);
    setAdReady(false);

    attemptedThisCycleRef.current = false;
  };

  // =====================================================
  // DO NOT RENDER
  // =====================================================

  if (!isLoggedIn) {
    return null;
  }

  if (isAdminLoggedIn) {
    return null;
  }

  if (!showAd || !ad) {
    return null;
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div style={overlayStyle}>

      <div style={adContainerStyle}>

        {/* CLOSE */}
        <button
          type="button"
          onClick={closeImageAd}
          style={closeButtonStyle}
          aria-label="Close advertisement"
        >
          ✕
        </button>

        {/* LABEL */}
        <div style={adLabelStyle}>
          Advertisement
        </div>

        {/* IMAGE */}
        <img
          src={ad.imageUrl}
          alt={
            ad.title ||
            "Advertisement"
          }
          onClick={closeImageAd}
          style={imageStyle}
        />

        {/* CONTENT */}
        <div style={contentStyle}>

          {ad.advertiserName && (
            <div style={advertiserStyle}>
              {ad.advertiserName}
            </div>
          )}

          {ad.title && (
            <h2 style={titleStyle}>
              {ad.title}
            </h2>
          )}

          {ad.description && (
            <p style={descriptionStyle}>
              {ad.description}
            </p>
          )}

          {ad.targetUrl &&
            ad.targetUrl.trim() !== "" && (
              <button
                type="button"
                onClick={closeImageAd}
                style={visitButtonStyle}
              >
                Visit Website
              </button>
            )}

          <small style={sponsoredStyle}>
            Sponsored
          </small>

        </div>
      </div>
    </div>
  );
}

// =====================================================
// STYLES
// =====================================================

const overlayStyle = {
  position: "fixed",
  inset: 0,
  width: "100%",
  height: "100%",
  background: "rgba(15,23,42,0.82)",
  backdropFilter: "blur(8px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
  boxSizing: "border-box",
  zIndex: 99998
};

const adContainerStyle = {
  position: "relative",
  width: "100%",
  maxWidth: "820px",
  overflow: "hidden",
  borderRadius: "24px",
  background:
    "linear-gradient(180deg,#ffffff 0%,#f8fafc 100%)",
  boxShadow:
    "0 25px 60px rgba(0,0,0,0.35)",
  border:
    "1px solid rgba(255,255,255,0.3)"
};

const closeButtonStyle = {
  position: "absolute",
  top: "14px",
  right: "14px",
  zIndex: 20,
  width: "42px",
  height: "42px",
  border: "none",
  borderRadius: "50%",
  background: "rgba(255,255,255,0.95)",
  color: "#111827",
  fontSize: "20px",
  fontWeight: "700",
  cursor: "pointer",
  boxShadow:
    "0 4px 15px rgba(0,0,0,0.15)"
};

const adLabelStyle = {
  position: "absolute",
  top: "16px",
  left: "16px",
  zIndex: 10,
  padding: "8px 14px",
  borderRadius: "999px",
  background:
    "linear-gradient(135deg,#2563eb,#7c3aed)",
  color: "#fff",
  fontSize: "12px",
  fontWeight: "700",
  letterSpacing: "0.5px",
  textTransform: "uppercase"
};

const imageStyle = {
  display: "block",
  width: "100%",
  maxHeight: "65vh",
  objectFit: "cover",
  cursor: "pointer"
};

const contentStyle = {
  padding: "28px",
  textAlign: "center"
};

const advertiserStyle = {
  marginBottom: "8px",
  color: "#64748b",
  fontSize: "14px",
  fontWeight: "600"
};

const titleStyle = {
  margin: "0 0 12px",
  color: "#0f172a",
  fontSize: "28px",
  fontWeight: "700",
  lineHeight: "1.3"
};

const descriptionStyle = {
  margin: "0 auto 20px",
  color: "#64748b",
  lineHeight: "1.7",
  fontSize: "15px",
  maxWidth: "650px"
};

const visitButtonStyle = {
  padding: "12px 28px",
  border: "none",
  borderRadius: "12px",
  background:
    "linear-gradient(135deg,#2563eb,#7c3aed)",
  color: "#ffffff",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "15px",
  boxShadow:
    "0 10px 25px rgba(37,99,235,0.35)"
};

const sponsoredStyle = {
  display: "block",
  marginTop: "16px",
  color: "#94a3b8",
  fontSize: "12px",
  fontWeight: "600",
  letterSpacing: "0.5px"
};

export default ImageAdManager;