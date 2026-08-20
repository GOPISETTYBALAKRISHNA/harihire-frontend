import React, { useEffect, useState } from "react";
import axios from "axios";

function AdBanner() {

  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "https://harihire-production.up.railway.app";

  // =====================================================
  // LOAD ACTIVE ADS
  // =====================================================

  useEffect(() => {

    loadAds();

  }, []);


  const loadAds = async () => {

    try {

      const response = await axios.get(
        `${BASE_URL}/ads/active`
      );

      const activeAds =
        Array.isArray(response.data)
          ? response.data
          : [];

      // ONLY BANNER ADS
      const bannerAds =
        activeAds.filter(
          (ad) =>
            !ad.adType ||
            ad.adType.toUpperCase() === "BANNER"
        );

      setAds(bannerAds);

    } catch (error) {

      console.log(
        "Banner Ad Load Error:",
        error
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return null;
  }


  // =====================================================
  // NO BANNER ADS
  // =====================================================

  if (ads.length === 0) {
    return null;
  }


  // =====================================================
  // BANNER ADS
  // =====================================================

  return (

    <div
      style={{
        width: "100%",
        marginTop: "25px",
        marginBottom: "25px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px"
      }}
    >

      {ads.map((ad) => (

        <div
          key={ad.id}
          style={{
            width: "100%",
            maxWidth: "900px",
            borderRadius: "10px",
            overflow: "hidden",
            backgroundColor: "#fff",
            boxShadow:
              "0 2px 10px rgba(0,0,0,0.12)"
          }}
        >

          {/* =================================================
              BANNER IMAGE
          ================================================= */}

          {ad.imageUrl && (

            <img
              src={ad.imageUrl}
              alt={
                ad.title ||
                "Advertisement"
              }
              onClick={async () => {

                // Record click

                try {

                  await axios.put(
                    `${BASE_URL}/ads/${ad.id}/click`
                  );

                } catch (error) {

                  console.log(
                    "Banner click error:",
                    error
                  );

                }


                // Open advertiser

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

              }}
              style={{
                width: "100%",
                display: "block",
                cursor:
                  ad.targetUrl
                    ? "pointer"
                    : "default"
              }}
            />

          )}


          {/* =================================================
              BANNER CONTENT
          ================================================= */}

          <div
            style={{
              padding: "12px",
              textAlign: "center"
            }}
          >

            {/* TITLE */}

            {ad.title && (

              <h3
                style={{
                  margin: "5px 0"
                }}
              >
                {ad.title}
              </h3>

            )}


            {/* DESCRIPTION */}

            {ad.description && (

              <p
                style={{
                  margin: "5px 0",
                  color: "#666"
                }}
              >
                {ad.description}
              </p>

            )}


            {/* VISIT WEBSITE */}

            {ad.targetUrl && (

              <button
                onClick={async () => {

                  try {

                    await axios.put(
                      `${BASE_URL}/ads/${ad.id}/click`
                    );

                  } catch (error) {

                    console.log(
                      "Banner click error:",
                      error
                    );

                  }


                  window.open(
                    ad.targetUrl.trim(),
                    "_blank",
                    "noopener,noreferrer"
                  );

                }}
                style={{
                  marginTop: "8px",
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "5px",
                  backgroundColor:
                    "#1976d2",
                  color: "white",
                  cursor: "pointer"
                }}
              >
                Visit Website
              </button>

            )}


            {/* SPONSORED */}

            <div
              style={{
                marginTop: "8px",
                fontSize: "12px",
                color: "#999"
              }}
            >
              Sponsored
            </div>

          </div>

        </div>

      ))}

    </div>

  );
}

export default AdBanner;