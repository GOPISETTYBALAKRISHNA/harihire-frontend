import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:8085";

const PENDING_AD_KEY = "harihire_pending_video_ad";

function VideoAd({ ad, onClose }) {
  const [time, setTime] = useState(0);
  const [completed, setCompleted] = useState(false);

  // First click -> advertiser
  // Second click -> actual close
  const [clickOpened, setClickOpened] = useState(false);

  // =====================================================
  // SAFE VALUES
  // =====================================================

  const adId = ad ? ad.id : null;

  const rawVideoUrl =
    ad && ad.videoUrl
      ? String(ad.videoUrl).trim()
      : "";

  // =====================================================
  // VIDEO URL
  // =====================================================

  let videoUrl = "";

  if (rawVideoUrl) {
    if (
      rawVideoUrl.startsWith("http://") ||
      rawVideoUrl.startsWith("https://")
    ) {
      videoUrl = rawVideoUrl;
    } else if (rawVideoUrl.startsWith("/")) {
      videoUrl = `${BASE_URL}${rawVideoUrl}`;
    } else {
      videoUrl = `${BASE_URL}/ad/${rawVideoUrl}`;
    }
  }

  // =====================================================
  // SKIP TIME
  // =====================================================

  const skipTime =
    ad && Number(ad.skipAfterSeconds) > 0
      ? Number(ad.skipAfterSeconds)
      : 10;

  // =====================================================
  // SKIPPABLE
  // =====================================================

  const isSkippable =
    ad && ad.skippable === true;

  // =====================================================
  // CAN SKIP
  // =====================================================

  const canSkip =
    isSkippable &&
    time >= skipTime &&
    !completed;

  // =====================================================
  // RECORD IMPRESSION
  // =====================================================

  useEffect(() => {
    if (!adId) {
      return;
    }

    axios
      .put(`${BASE_URL}/ads/${adId}/impression`)
      .then(() => {
        console.log(
          "Advertisement impression recorded"
        );
      })
      .catch((error) => {
        console.error(
          "Impression Error:",
          error
        );
      });
  }, [adId]);

  // =====================================================
  // RESET / RESTORE WHEN AD CHANGES
  // =====================================================

  useEffect(() => {
    setTime(0);
    setCompleted(false);
    setClickOpened(false);

    // ---------------------------------------------------
    // Check whether this ad was already opened
    // ---------------------------------------------------

    try {
      const pending =
        sessionStorage.getItem(
          PENDING_AD_KEY
        );

      if (!pending) {
        return;
      }

      const pendingData =
        JSON.parse(pending);

      if (
        pendingData &&
        pendingData.ad &&
        Number(pendingData.ad.id) === Number(adId)
      ) {
        console.log(
          "Restoring pending advertisement:",
          pendingData
        );

        setClickOpened(
          pendingData.clickOpened === true
        );

        setCompleted(
          pendingData.completed === true
        );

        setTime(
          pendingData.time || 0
        );
      }
    } catch (error) {
      console.error(
        "Restore Pending Ad Error:",
        error
      );
    }
  }, [adId]);

  // =====================================================
  // SAFETY CHECK
  // =====================================================

  if (!ad) {
    return null;
  }

  if (!videoUrl) {
    return null;
  }

  // =====================================================
  // VIDEO TIME UPDATE
  // =====================================================

  const handleTimeUpdate = (event) => {
    const currentTime =
      event.currentTarget.currentTime;

    setTime(currentTime);
  };

  // =====================================================
  // VIDEO COMPLETED
  // =====================================================

  const handleVideoEnded = () => {
    if (completed) {
      return;
    }

    setCompleted(true);

    // ---------------------------------------------------
    // Record completed video view
    // ---------------------------------------------------

    axios
      .put(`${BASE_URL}/ads/${adId}/video-view`)
      .then(() => {
        console.log(
          "Video completed view recorded"
        );
      })
      .catch((error) => {
        console.error(
          "Video View Error:",
          error
        );
      });
  };

  // =====================================================
  // SAVE PENDING AD
  // =====================================================

  const savePendingAd = () => {
    try {
      sessionStorage.setItem(
        PENDING_AD_KEY,
        JSON.stringify({
          ad: ad,
          completed: completed,
          clickOpened: true,
          time: time,
          savedAt: Date.now()
        })
      );

      console.log(
        "Pending advertisement saved"
      );
    } catch (error) {
      console.error(
        "Save Pending Ad Error:",
        error
      );
    }
  };

  // =====================================================
  // OPEN ADVERTISER
  // =====================================================

  const openAdvertisement = () => {
    // ---------------------------------------------------
    // Record click
    // ---------------------------------------------------

    axios
      .put(`${BASE_URL}/ads/${adId}/click`)
      .then(() => {
        console.log(
          "Advertisement click recorded"
        );
      })
      .catch((error) => {
        console.error(
          "Ad Click Tracking Error:",
          error
        );
      });

    // ---------------------------------------------------
    // Target URL
    // ---------------------------------------------------

    if (
      ad.targetUrl &&
      ad.targetUrl.trim() !== ""
    ) {
      // Save state before leaving
      savePendingAd();

      // -------------------------------------------------
      // Same tab
      // -------------------------------------------------

      window.location.href =
        ad.targetUrl.trim();

      return;
    }

    console.log(
      "Advertiser target URL not available"
    );
  };

  // =====================================================
  // SKIP VIDEO
  // =====================================================

  const handleSkip = () => {
    if (!canSkip) {
      return;
    }

    // ===================================================
    // FIRST CLICK
    // ===================================================

    if (!clickOpened) {
      console.log(
        "First Skip click -> Opening advertiser"
      );

      setClickOpened(true);

      openAdvertisement();

      return;
    }

    // ===================================================
    // SECOND CLICK
    // ===================================================

    console.log(
      "Second Skip click -> Closing advertisement"
    );

    sessionStorage.removeItem(
      PENDING_AD_KEY
    );

    if (onClose) {
      onClose();
    }
  };

  // =====================================================
  // CLOSE AFTER VIDEO COMPLETION
  // =====================================================

  const handleClose = () => {
    // Video must be completed
    if (!completed) {
      return;
    }

    // ===================================================
    // FIRST CLOSE CLICK
    // ===================================================

    if (!clickOpened) {
      console.log(
        "First Close click -> Opening advertiser"
      );

      setClickOpened(true);

      openAdvertisement();

      return;
    }

    // ===================================================
    // SECOND CLOSE CLICK
    // ===================================================

    console.log(
      "Second Close click -> Closing advertisement"
    );

    sessionStorage.removeItem(
      PENDING_AD_KEY
    );

    if (onClose) {
      onClose();
    }
  };

  // =====================================================
  // REMAINING SKIP SECONDS
  // =====================================================

  let remainingSeconds =
    Math.ceil(skipTime - time);

  if (remainingSeconds < 0) {
    remainingSeconds = 0;
  }

  // =====================================================
  // BUTTON TEXT
  // =====================================================

  let skipButtonText = "";

  if (!canSkip) {
    skipButtonText =
      `Skip in ${remainingSeconds}s`;
  } else if (!clickOpened) {
    skipButtonText = "Skip Ad";
  } else {
    skipButtonText = "Skip Video";
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor:
          "rgba(0,0,0,0.85)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 99999,
        padding: "20px",
        boxSizing: "border-box"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "850px",
          backgroundColor: "white",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow:
            "0 5px 30px rgba(0,0,0,0.4)"
        }}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div
          style={{
            backgroundColor: "#f5f5f5",
            padding: "10px",
            textAlign: "center",
            fontSize: "13px",
            color: "#777"
          }}
        >
          Advertisement
        </div>

        {/* =================================================
            VIDEO
        ================================================= */}

        <video
          src={videoUrl}
          autoPlay
          muted
          playsInline
          controls={false}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
          style={{
            width: "100%",
            maxHeight: "500px",
            display: "block",
            backgroundColor: "#000"
          }}
        />

        {/* =================================================
            INFORMATION
        ================================================= */}

        <div
          style={{
            padding: "15px",
            textAlign: "center"
          }}
        >
          {/* TITLE */}

          {ad.title && (
            <h3>
              {ad.title}
            </h3>
          )}

          {/* DESCRIPTION */}

          {ad.description && (
            <p
              style={{
                color: "#555"
              }}
            >
              {ad.description}
            </p>
          )}

          {/* =================================================
              SKIPPABLE VIDEO
          ================================================= */}

          {isSkippable && !completed && (
            <button
              onClick={handleSkip}
              disabled={!canSkip}
              style={{
                marginTop: "10px",
                padding: "10px 22px",
                border: "none",
                borderRadius: "6px",
                color: "white",
                backgroundColor:
                  canSkip
                    ? "#1976d2"
                    : "#999",
                cursor:
                  canSkip
                    ? "pointer"
                    : "not-allowed"
              }}
            >
              {skipButtonText}
            </button>
          )}

          {/* =================================================
              NON-SKIPPABLE VIDEO
          ================================================= */}

          {!isSkippable &&
            !completed && (
              <p
                style={{
                  color: "#777",
                  fontSize: "13px"
                }}
              >
                Please watch the complete
                advertisement.
              </p>
            )}

          {/* =================================================
              VIDEO COMPLETED
          ================================================= */}

          {completed && (
            <>
              <p
                style={{
                  color: "green",
                  fontWeight: "bold"
                }}
              >
                ✓ Advertisement Completed
              </p>

              <button
                onClick={handleClose}
                style={{
                  padding: "10px 22px",
                  border: "none",
                  borderRadius: "6px",
                  backgroundColor: "#555",
                  color: "white",
                  cursor: "pointer"
                }}
              >
                Close Ad
              </button>

              {clickOpened && (
                <p
                  style={{
                    marginTop: "10px",
                    color: "#777",
                    fontSize: "13px"
                  }}
                >
                  Advertiser opened.
                  <br />
                  Click "Close Ad" again
                  to close this advertisement.
                </p>
              )}
            </>
          )}

          {/* =================================================
              AFTER FIRST SKIP
          ================================================= */}

          {isSkippable &&
            clickOpened &&
            !completed && (
              <p
                style={{
                  marginTop: "10px",
                  color: "#777",
                  fontSize: "13px"
                }}
              >
                Advertiser opened.
                <br />
                Click "Skip Video" again
                to close this advertisement.
              </p>
            )}

          {/* =================================================
              SPONSORED
          ================================================= */}

          <div
            style={{
              marginTop: "10px",
              fontSize: "12px",
              color: "#888"
            }}
          >
            Sponsored
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoAd;