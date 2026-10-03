import React, { useEffect, useState } from "react";
import api from "../axiosConfig";
import "./AdBanner.css";

function AdBanner() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [closed, setClosed] = useState(false);

  // =====================================================
  // LOAD ACTIVE BANNER ADS
  // =====================================================

  useEffect(() => {
    loadAds();
  }, []);

  const loadAds = async () => {
    try {
      const response = await api.get("/ads/active/banner");

      const bannerAds = Array.isArray(response.data)
        ? response.data
        : [];

      setAds(bannerAds);
      setCurrentIndex(0);
    } catch (error) {
      console.error("Banner Ad Load Error:", error);
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // AUTO SLIDE
  // =====================================================

  useEffect(() => {
    if (ads.length <= 1 || closed) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((previousIndex) => {
        return (previousIndex + 1) % ads.length;
      });
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [ads, closed]);

  // =====================================================
  // IMPRESSION TRACKING
  // =====================================================

  useEffect(() => {
    if (ads.length === 0 || closed) {
      return;
    }

    const ad = ads[currentIndex];

    if (!ad || !ad.id) {
      return;
    }

    api
      .put(`/ads/${ad.id}/impression`)
      .catch((error) => {
        console.error(
          "Impression tracking error:",
          error
        );
      });
  }, [ads, currentIndex, closed]);

  // =====================================================
  // CLICK HANDLER
  // =====================================================

  const handleClick = async (ad) => {
    if (!ad) {
      return;
    }

    try {
      await api.put(`/ads/${ad.id}/click`);
    } catch (error) {
      console.error(
        "Click tracking error:",
        error
      );
    }

    // Open advertiser website only when target URL exists
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
  };

  // =====================================================
  // CLOSE BANNER
  // =====================================================

  const handleClose = (event) => {
    /*
     * IMPORTANT:
     * Prevent default browser/form behaviour.
     * Do NOT use window.history.back().
     * Do NOT navigate anywhere.
     */
    event.preventDefault();
    event.stopPropagation();

    setClosed(true);
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return null;
  }

  // =====================================================
  // NO ADS / CLOSED
  // =====================================================

  if (ads.length === 0 || closed) {
    return null;
  }

  // =====================================================
  // CURRENT AD
  // =====================================================

  const ad = ads[currentIndex];

  if (!ad) {
    return null;
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div
      className="ad-wrapper"
      onClick={(event) => {
        /*
         * Keep clicks inside banner from affecting
         * parent navigation components.
         */
        event.stopPropagation();
      }}
    >
      <div className="ad-card">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="ad-header">

          <span className="sponsored-badge">
            Sponsored
          </span>

          <button
            type="button"
            className="close-btn"
            onClick={handleClose}
            aria-label="Close advertisement"
          >
            ×
          </button>

        </div>

        {/* =================================================
            IMAGE
        ================================================= */}

        {ad.imageUrl && (
          <img
            src={ad.imageUrl}
            alt={
              ad.title ||
              "Advertisement"
            }
            className="ad-image"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();

              handleClick(ad);
            }}
          />
        )}

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="ad-content">

          {/* ADVERTISER */}

          <div className="advertiser-name">
            {ad.advertiserName ||
              "HariHire Partner"}
          </div>

          {/* TITLE */}

          <h3 className="ad-title">
            {ad.title}
          </h3>

          {/* DESCRIPTION */}

          {ad.description && (
            <p className="ad-description">
              {ad.description}
            </p>
          )}

          {/* TARGET URL */}

          {ad.targetUrl && (
            <button
              type="button"
              className="apply-btn"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();

                handleClick(ad);
              }}
            >
              Apply Now
            </button>
          )}

          {/* =================================================
              SLIDER DOTS
          ================================================= */}

          {ads.length > 1 && (
            <div className="slider-dots">

              {ads.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={
                    index === currentIndex
                      ? "dot active-dot"
                      : "dot"
                  }
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    setCurrentIndex(index);
                  }}
                  aria-label={`Show advertisement ${
                    index + 1
                  }`}
                />
              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default AdBanner;