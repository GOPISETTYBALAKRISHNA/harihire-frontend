import { useEffect, useRef, useState } from "react";
import api from "../axiosConfig";

function VideoAdManager({
  isLoggedIn,
  isAdminLoggedIn
}) {

  // =====================================================
  // STATE
  // =====================================================

  const [ad, setAd] = useState(null);
  const [showAd, setShowAd] = useState(false);
  const [loadingAd, setLoadingAd] = useState(false);

  const [canSkip, setCanSkip] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);

  const [remainingSeconds, setRemainingSeconds] =
    useState(0);

  // =====================================================
  // NEW STATE
  // First Close / Continue click opens advertiser.
  // Second click closes the advertisement.
  // =====================================================

  const [advertiserOpened, setAdvertiserOpened] =
    useState(false);


  // =====================================================
  // REFS
  // =====================================================

  const timerRef = useRef(null);

  const countdownRef = useRef(null);

  const previousLoginState =
    useRef(false);

  const adShownRef =
    useRef(false);


  // =====================================================
  // CONSTANTS
  // =====================================================

  const FIVE_MINUTES =
    3 * 60 * 1000;


  // =====================================================
  // CLEAR TIMER
  // =====================================================

  const clearTimers = () => {

    if (timerRef.current) {

      clearTimeout(timerRef.current);

      timerRef.current = null;
    }


    if (countdownRef.current) {

      clearInterval(
        countdownRef.current
      );

      countdownRef.current = null;
    }
  };


  // =====================================================
  // RESET AD SYSTEM
  // =====================================================

  const resetAdSystem = () => {

    clearTimers();

    setAd(null);

    setShowAd(false);

    setCanSkip(false);

    setVideoEnded(false);

    setRemainingSeconds(0);

    setAdvertiserOpened(false);

    adShownRef.current = false;

    localStorage.removeItem(
      "videoAdNextTime"
    );
  };


  // =====================================================
  // START 5 MINUTE TIMER
  // =====================================================

  const startFiveMinuteTimer = () => {

    clearTimers();


    const nextTime =
      Date.now() + FIVE_MINUTES;


    localStorage.setItem(
      "videoAdNextTime",
      String(nextTime)
    );


    const updateCountdown = () => {

      const storedTime =
        localStorage.getItem(
          "videoAdNextTime"
        );


      if (!storedTime) {

        setRemainingSeconds(0);

        return;
      }


      const targetTime =
        Number(storedTime);


      const difference =
        targetTime - Date.now();


      if (difference <= 0) {

        setRemainingSeconds(0);

        if (countdownRef.current) {

          clearInterval(
            countdownRef.current
          );

          countdownRef.current = null;
        }

        return;
      }


      const seconds =
        Math.ceil(
          difference / 1000
        );


      setRemainingSeconds(seconds);
    };


    updateCountdown();


    countdownRef.current =
      setInterval(
        updateCountdown,
        1000
      );


    timerRef.current =
      setTimeout(
        () => {

          loadActiveAd();

        },
        FIVE_MINUTES
      );
  };


  // =====================================================
  // LOAD ACTIVE AD
  // =====================================================

  const loadActiveAd = async () => {

    if (!isLoggedIn) {
      return;
    }


    if (isAdminLoggedIn) {
      return;
    }


    if (adShownRef.current) {
      return;
    }


    if (loadingAd) {
      return;
    }


    try {

      setLoadingAd(true);


      console.log(
        "Loading active advertisement..."
      );


      const response =
        await api.get(
          "/ads/active"
        );


      const ads =
        response.data;


      if (
        !Array.isArray(ads) ||
        ads.length === 0
      ) {

        console.log(
          "No active advertisements found."
        );


        startFiveMinuteTimer();

        return;
      }


      // =================================================
      // SORT BY DISPLAY ORDER
      // =================================================

      const sortedAds =
        [...ads].sort(
          (a, b) =>
            Number(
              a.displayOrder || 999999
            ) -
            Number(
              b.displayOrder || 999999
            )
        );


      // =================================================
      // SELECT FIRST AD
      // =================================================

      const selectedAd =
        sortedAds[0];


      if (!selectedAd) {

        startFiveMinuteTimer();

        return;
      }


      console.log(
        "Selected Advertisement:",
        selectedAd
      );


      setAd(selectedAd);

      setShowAd(true);

      setVideoEnded(false);

      setCanSkip(false);

      // NEW
      setAdvertiserOpened(false);

      adShownRef.current = true;


      // =================================================
      // RECORD IMPRESSION
      // =================================================

      try {

        await api.put(
          "/ads/" +
          selectedAd.id +
          "/impression"
        );

      } catch (error) {

        console.error(
          "Impression tracking failed:",
          error
        );
      }


    } catch (error) {

      console.error(
        "Failed to load advertisements:",
        error
      );


      startFiveMinuteTimer();

    } finally {

      setLoadingAd(false);

    }
  };


  // =====================================================
  // USER LOGIN DETECTION
  // =====================================================

  useEffect(() => {

    // ===================================================
    // ADMIN
    // ===================================================

    if (isAdminLoggedIn) {

      resetAdSystem();

      previousLoginState.current =
        false;

      return;
    }


    // ===================================================
    // USER LOGGED OUT
    // ===================================================

    if (!isLoggedIn) {

      resetAdSystem();

      previousLoginState.current =
        false;

      return;
    }


    // ===================================================
    // USER JUST LOGGED IN
    // ===================================================

    if (
      isLoggedIn &&
      !previousLoginState.current
    ) {

      console.log(
        "User logged in. Starting 5 minute ad timer."
      );


      adShownRef.current =
        false;


      setAd(null);

      setShowAd(false);

      setAdvertiserOpened(false);


      // IMPORTANT:
      // Do NOT show ad immediately.

      startFiveMinuteTimer();
    }


    previousLoginState.current =
      isLoggedIn;


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isLoggedIn,
    isAdminLoggedIn
  ]);


  // =====================================================
  // RESTORE TIMER AFTER PAGE REFRESH
  // =====================================================

  useEffect(() => {

    if (!isLoggedIn) {
      return;
    }


    if (isAdminLoggedIn) {
      return;
    }


    const storedTime =
      localStorage.getItem(
        "videoAdNextTime"
      );


    if (!storedTime) {

      startFiveMinuteTimer();

      return;
    }


    const targetTime =
      Number(storedTime);


    const difference =
      targetTime - Date.now();


    if (difference <= 0) {

      if (!adShownRef.current) {

        loadActiveAd();

      }

      return;
    }


    clearTimers();


    const updateCountdown = () => {

      const currentStoredTime =
        localStorage.getItem(
          "videoAdNextTime"
        );


      if (!currentStoredTime) {
        return;
      }


      const currentTarget =
        Number(
          currentStoredTime
        );


      const remaining =
        currentTarget -
        Date.now();


      if (remaining <= 0) {

        setRemainingSeconds(0);


        if (
          countdownRef.current
        ) {

          clearInterval(
            countdownRef.current
          );

          countdownRef.current =
            null;
        }

        return;
      }


      setRemainingSeconds(
        Math.ceil(
          remaining / 1000
        )
      );
    };


    updateCountdown();


    countdownRef.current =
      setInterval(
        updateCountdown,
        1000
      );


    timerRef.current =
      setTimeout(
        () => {

          loadActiveAd();

        },
        difference
      );


    return () => {

      clearTimers();

    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isLoggedIn,
    isAdminLoggedIn
  ]);


  // =====================================================
  // VIDEO SKIP TIMER
  // =====================================================

  useEffect(() => {

    if (!showAd) {
      return;
    }


    if (!ad) {
      return;
    }


    if (
      ad.adType !== "VIDEO"
    ) {
      return;
    }


    if (!ad.skippable) {

      setCanSkip(false);

      return;
    }


    const skipAfter =
      Number(
        ad.skipAfterSeconds || 10
      );


    const timer =
      setTimeout(
        () => {

          setCanSkip(true);

        },
        skipAfter * 1000
      );


    return () => {

      clearTimeout(timer);

    };

  }, [
    showAd,
    ad
  ]);


  // =====================================================
  // NEW
  // OPEN ADVERTISER URL
  // =====================================================

  const openAdvertiser = async () => {

    if (!ad) {
      return;
    }


    // ===================================================
    // RECORD CLICK
    // ===================================================

    try {

      await api.put(
        "/ads/" +
        ad.id +
        "/click"
      );

      console.log(
        "Advertisement click recorded"
      );

    } catch (error) {

      console.error(
        "Click tracking failed:",
        error
      );

    }


    // ===================================================
    // OPEN TARGET URL
    // Same tab so browser BACK returns to advertisement.
    // ===================================================

    if (
      ad.targetUrl &&
      ad.targetUrl.trim()
    ) {

      window.location.href =
        ad.targetUrl.trim();

    } else {

      console.log(
        "Advertisement target URL not available"
      );

    }
  };


  // =====================================================
  // NEW
  // CLOSE AD
  // =====================================================

  const closeAd = async () => {

    if (!ad) {
      return;
    }


    // ===================================================
    // VIDEO VALIDATION
    // Existing functionality preserved.
    // ===================================================

    if (
      ad.adType === "VIDEO"
    ) {

      if (
        !videoEnded &&
        !canSkip
      ) {

        return;
      }
    }


    // ===================================================
    // FIRST CLOSE CLICK
    // Open advertiser + record click.
    // Do NOT close advertisement.
    // ===================================================

    if (!advertiserOpened) {

      console.log(
        "First Close click -> Opening advertiser"
      );


      setAdvertiserOpened(true);


      await openAdvertiser();


      return;
    }


    // ===================================================
    // SECOND CLOSE CLICK
    // Actually close advertisement.
    // ===================================================

    console.log(
      "Second Close click -> Closing advertisement"
    );


    setAdvertiserOpened(false);

    setShowAd(false);

    setAd(null);

    setCanSkip(false);

    setVideoEnded(false);

    adShownRef.current =
      false;


    // ===================================================
    // NEXT AD AFTER 5 MINUTES
    // ===================================================

    startFiveMinuteTimer();

  };


  // =====================================================
  // VIDEO COMPLETED
  // =====================================================

  const handleVideoEnded =
    async () => {

      if (!ad) {
        return;
      }


      setVideoEnded(true);

      setCanSkip(true);


      // =================================================
      // RECORD VIDEO VIEW
      // =================================================

      try {

        await api.put(
          "/ads/" +
          ad.id +
          "/video-view"
        );

      } catch (error) {

        console.error(
          "Video view tracking failed:",
          error
        );

      }

    };


  // =====================================================
  // VIDEO SKIP
  // Existing functionality preserved
  // =====================================================

  const handleVideoSkip =
    async () => {

      if (!ad) {
        return;
      }


      if (!canSkip) {
        return;
      }


      try {

        await api.put(
          "/ads/" +
          ad.id +
          "/video-skip"
        );

      } catch (error) {

        console.error(
          "Video skip tracking failed:",
          error
        );

      }


      closeAd();

    };


  // =====================================================
  // NEW
  // VIDEO CLICK
  // =====================================================

  const handleVideoClick = async () => {

    if (!ad) {
      return;
    }


    if (
      !ad.targetUrl ||
      !ad.targetUrl.trim()
    ) {

      return;
    }


    console.log(
      "Video clicked -> Opening advertiser"
    );


    await openAdvertiser();

  };


  // =====================================================
  // AD CLICK
  // Banner functionality preserved
  // =====================================================

  const handleAdClick =
    async () => {

      if (!ad) {
        return;
      }


      try {

        await api.put(
          "/ads/" +
          ad.id +
          "/click"
        );

      } catch (error) {

        console.error(
          "Click tracking failed:",
          error
        );

      }


      if (
        ad.targetUrl &&
        ad.targetUrl.trim()
      ) {

        window.open(
          ad.targetUrl,
          "_blank"
        );

      }

    };


  // =====================================================
  // CLEANUP
  // =====================================================

  useEffect(() => {

    return () => {

      clearTimers();

    };

  }, []);


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
  // AD TYPE
  // =====================================================

  const isVideo =
    ad.adType === "VIDEO";


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div style={overlayStyle}>

      <div style={adContainerStyle}>


        {/* =================================================
            CLOSE BUTTON
        ================================================= */}

        <button
          onClick={closeAd}
          disabled={
            isVideo &&
            !videoEnded &&
            !canSkip
          }
          style={{
            ...closeButtonStyle,

            opacity:
              isVideo &&
              !videoEnded &&
              !canSkip
                ? 0.5
                : 1,

            cursor:
              isVideo &&
              !videoEnded &&
              !canSkip
                ? "not-allowed"
                : "pointer"
          }}
        >
          ✕
        </button>


        {/* =================================================
            AD LABEL
        ================================================= */}

        <div style={adLabelStyle}>
          Advertisement
        </div>


        {/* =================================================
            VIDEO AD
        ================================================= */}

        {isVideo ? (

          <div>

            <video
              src={ad.videoUrl}
              autoPlay
              controls={false}
              playsInline
              onEnded={
                handleVideoEnded
              }
              onClick={
                handleVideoClick
              }
              style={{
                ...videoStyle,

                cursor:
                  ad.targetUrl
                    ? "pointer"
                    : "default"
              }}
            />


            {/* ===========================================
                VIDEO INFORMATION
            =========================================== */}

            <div style={videoBottomStyle}>

              <div>

                <strong>
                  {ad.title}
                </strong>

                {ad.description && (

                  <p style={descriptionStyle}>
                    {ad.description}
                  </p>

                )}

              </div>


              {/* =========================================
                  SKIP BUTTON
              ========================================= */}

              {ad.skippable && (

                <button
                  onClick={
                    handleVideoSkip
                  }
                  disabled={
                    !canSkip
                  }
                  style={{
                    ...skipButtonStyle,

                    opacity:
                      canSkip
                        ? 1
                        : 0.5
                  }}
                >

                  {canSkip
                    ? (
                        advertiserOpened
                          ? "Skip Video"
                          : "Skip Ad"
                      )
                    : "Skip unavailable"}

                </button>

              )}


              {/* =========================================
                  COMPLETED
              ========================================= */}

              {videoEnded && (

                <button
                  onClick={
                    closeAd
                  }
                  style={
                    completeButtonStyle
                  }
                >

                  {advertiserOpened
                    ? "Close Ad"
                    : "Continue"}

                </button>

              )}

            </div>


            {/* =========================================
                FIRST CLICK MESSAGE
            ========================================= */}

            {advertiserOpened && (

              <div
                style={{
                  textAlign: "center",
                  padding: "0 15px 15px",
                  color: "#777",
                  fontSize: "13px"
                }}
              >
                Advertiser opened.
                <br />
                Click again to close this advertisement.
              </div>

            )}

          </div>

        ) : (

          /* =================================================
             BANNER AD
          ================================================= */

          <div>

            {ad.imageUrl && (

              <img
                src={ad.imageUrl}
                alt={ad.title}
                onClick={
                  handleAdClick
                }
                style={bannerImageStyle}
              />

            )}


            <div style={bannerContentStyle}>

              <h2>
                {ad.title}
              </h2>


              {ad.description && (

                <p>
                  {ad.description}
                </p>

              )}


              <div>

                {ad.targetUrl && (

                  <button
                    onClick={
                      handleAdClick
                    }
                    style={
                      visitButtonStyle
                    }
                  >
                    Visit Website
                  </button>

                )}


                <button
                  onClick={closeAd}
                  style={
                    closeBannerButtonStyle
                  }
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>

  );
}


// =====================================================
// STYLES
// =====================================================

const overlayStyle = {

  position: "fixed",

  top: 0,

  left: 0,

  width: "100%",

  height: "100%",

  backgroundColor:
    "rgba(0,0,0,0.75)",

  display: "flex",

  justifyContent: "center",

  alignItems: "center",

  zIndex: 99999,

  padding: "20px",

  boxSizing: "border-box"

};


const adContainerStyle = {

  position: "relative",

  width: "100%",

  maxWidth: "850px",

  maxHeight: "90vh",

  overflow: "hidden",

  backgroundColor: "white",

  borderRadius: "12px",

  boxShadow:
    "0 10px 40px rgba(0,0,0,0.5)"

};


const closeButtonStyle = {

  position: "absolute",

  right: "10px",

  top: "10px",

  zIndex: 10,

  width: "38px",

  height: "38px",

  borderRadius: "50%",

  border: "none",

  backgroundColor:
    "rgba(0,0,0,0.7)",

  color: "white",

  fontSize: "20px",

  fontWeight: "bold"

};


const adLabelStyle = {

  position: "absolute",

  top: "15px",

  left: "15px",

  zIndex: 5,

  backgroundColor:
    "rgba(0,0,0,0.65)",

  color: "white",

  padding: "5px 10px",

  borderRadius: "5px",

  fontSize: "12px"

};


const videoStyle = {

  display: "block",

  width: "100%",

  maxHeight: "70vh",

  backgroundColor: "black",

  objectFit: "contain"

};


const videoBottomStyle = {

  padding: "15px",

  display: "flex",

  justifyContent: "space-between",

  alignItems: "center",

  gap: "10px",

  flexWrap: "wrap"

};


const descriptionStyle = {

  margin: "5px 0 0 0",

  color: "#666"

};


const skipButtonStyle = {

  padding: "10px 18px",

  border: "none",

  borderRadius: "6px",

  backgroundColor: "#1976d2",

  color: "white",

  cursor: "pointer"

};


const completeButtonStyle = {

  padding: "10px 20px",

  border: "none",

  borderRadius: "6px",

  backgroundColor: "#2e7d32",

  color: "white",

  cursor: "pointer"

};


const bannerImageStyle = {

  display: "block",

  width: "100%",

  maxHeight: "60vh",

  objectFit: "cover",

  cursor: "pointer"

};


const bannerContentStyle = {

  padding: "20px"

};


const visitButtonStyle = {

  padding: "10px 18px",

  marginRight: "10px",

  border: "none",

  borderRadius: "6px",

  backgroundColor: "#1976d2",

  color: "white",

  cursor: "pointer"

};


const closeBannerButtonStyle = {

  padding: "10px 18px",

  border: "none",

  borderRadius: "6px",

  backgroundColor: "#555",

  color: "white",

  cursor: "pointer"

};


export default VideoAdManager;