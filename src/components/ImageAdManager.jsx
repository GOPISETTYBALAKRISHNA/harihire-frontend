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


  // =====================================================
  // LOAD IMAGE AD
  // =====================================================

  const loadImageAd = async () => {

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
  backgroundColor: "rgba(0,0,0,0.75)",
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
  maxWidth: "750px",
  maxHeight: "90vh",
  overflow: "hidden",
  backgroundColor: "#ffffff",
  borderRadius: "14px",
  boxShadow: "0 10px 40px rgba(0,0,0,0.5)"
};


const closeButtonStyle = {
  position: "absolute",
  top: "12px",
  right: "12px",
  zIndex: 10,
  width: "40px",
  height: "40px",
  border: "none",
  borderRadius: "50%",
  backgroundColor: "rgba(0,0,0,0.7)",
  color: "#ffffff",
  fontSize: "22px",
  fontWeight: "bold",
  cursor: "pointer"
};


const adLabelStyle = {
  position: "absolute",
  top: "15px",
  left: "15px",
  zIndex: 5,
  padding: "5px 10px",
  borderRadius: "5px",
  backgroundColor: "rgba(0,0,0,0.65)",
  color: "#ffffff",
  fontSize: "12px"
};


const imageStyle = {
  display: "block",
  width: "100%",
  maxHeight: "70vh",
  objectFit: "contain",
  backgroundColor: "#000000",
  cursor: "pointer"
};


const contentStyle = {
  padding: "18px",
  textAlign: "center"
};


const titleStyle = {
  margin: "0 0 8px",
  color: "#111827"
};


const descriptionStyle = {
  margin: "5px 0 10px",
  color: "#6b7280",
  lineHeight: "1.5"
};


const visitButtonStyle = {
  marginTop: "8px",
  padding: "9px 18px",
  border: "none",
  borderRadius: "6px",
  backgroundColor: "#1976d2",
  color: "#ffffff",
  cursor: "pointer",
  fontWeight: "600"
};


const sponsoredStyle = {
  display: "block",
  marginTop: "10px",
  color: "#999999",
  fontSize: "12px"
};


export default ImageAdManager;