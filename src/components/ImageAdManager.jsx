import { useEffect, useRef, useState } from "react";
import api from "../axiosConfig";

function ImageAdManager({
  isLoggedIn,
  isAdminLoggedIn,
  trigger
}) {
  const [ad, setAd] = useState(null);
  const [showAd, setShowAd] = useState(false);
  const [loadingAd, setLoadingAd] = useState(false);

  const adShownRef = useRef(false);
  const previousTriggerRef = useRef(false);
  
  
  useEffect(() => {
    const style = document.createElement("style");
  
    style.innerHTML = `
      @keyframes fadeInScale {
        from {
          opacity: 0;
          transform: scale(0.92);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
    `;
  
    document.head.appendChild(style);
  
    return () => {
      document.head.removeChild(style);
    };
  }, []);


  // =====================================================
  // LOAD IMAGE AD
  // =====================================================

  const loadImageAd = async () => {
    const IMAGE_AD_INTERVAL = 7 * 60 * 1000; // 7 minutes

const lastShownTime =
  localStorage.getItem("image_ad_last_shown");

if (lastShownTime) {
  const diff =
    Date.now() - Number(lastShownTime);

  if (diff < IMAGE_AD_INTERVAL) {
    return;
  }
}

    if (!isLoggedIn) {
      return;
    }

    if (isAdminLoggedIn) {
      return;
    }

    if (loadingAd) {
      return;
    }

    if (adShownRef.current) {
      return;
    }

    try {

      setLoadingAd(true);

      const response = await api.get("/ads/active");

      const ads = Array.isArray(response.data)
        ? response.data
        : [];


      // =================================================
      // ONLY IMAGE ADS
      // =================================================

      const imageAds = ads.filter(
        (item) =>
          item.adType &&
          item.adType.toUpperCase() === "IMAGE" &&
          item.imageUrl &&
          item.imageUrl.trim() !== ""
      );


      if (imageAds.length === 0) {
        return;
      }


      // =================================================
      // DISPLAY ORDER
      // =================================================

      const sortedAds = [...imageAds].sort(
        (a, b) =>
          Number(a.displayOrder || 999999) -
          Number(b.displayOrder || 999999)
      );


      const selectedAd = sortedAds[0];


      if (!selectedAd) {
        return;
      }


      // =================================================
      // SET AD
      // =================================================

      setAd(selectedAd);
      setShowAd(true);
      
      localStorage.setItem(
        "image_ad_last_shown",
        Date.now().toString()
      );
      
      adShownRef.current = true;


      // =================================================
      // RECORD IMPRESSION
      // =================================================

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

    } finally {

      setLoadingAd(false);

    }

  };


  // =====================================================
  // TRIGGER IMAGE AD
  // =====================================================

  useEffect(() => {

    if (!trigger) {

      previousTriggerRef.current = false;

      return;
    }


    /*
      Trigger became active.

      We reset the ad only when the trigger
      changes from false -> true.
    */

    if (!previousTriggerRef.current) {

      adShownRef.current = false;

      setAd(null);
      setShowAd(false);

      loadImageAd();

    }


    previousTriggerRef.current = true;


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);


  // =====================================================
  // CLOSE IMAGE AD
  // =====================================================

  const closeImageAd = async () => {

    if (!ad) {
      return;
    }


    // ===================================================
    // RECORD CLICK
    // ===================================================

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


    // ===================================================
    // OPEN TARGET URL
    // ===================================================

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


    // ===================================================
    // CLOSE POPUP
    // ===================================================

    setShowAd(false);
    setAd(null);

    adShownRef.current = false;

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


        {/* =================================================
            CLOSE BUTTON
        ================================================= */}

        <button
          onClick={closeImageAd}
          style={closeButtonStyle}
          aria-label="Close advertisement"
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
            IMAGE
        ================================================= */}

        <img
          src={ad.imageUrl}
          alt={ad.title || "Advertisement"}
          onClick={closeImageAd}
          style={imageStyle}
        />


        {/* =================================================
            CONTENT
        ================================================= */}

        <div style={contentStyle}>

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


          {/* TARGET URL BUTTON */}

          {ad.targetUrl &&
            ad.targetUrl.trim() !== "" && (

              <button
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
  border: "1px solid rgba(255,255,255,0.3)",
  animation: "fadeInScale 0.35s ease"
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
  boxShadow: "0 4px 15px rgba(0,0,0,0.15)"
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
  cursor: "pointer",
  transition: "all 0.3s ease"
};


const contentStyle = {
  padding: "28px",
  textAlign: "center"
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