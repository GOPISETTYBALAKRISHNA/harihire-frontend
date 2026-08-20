import { useEffect, useState } from "react";
import api from "../axiosConfig";

function AdminReviews() {

  // =====================================================
  // STATES
  // =====================================================

  const [reviews, setReviews] = useState([]);

  const [averageRating, setAverageRating] = useState(0);

  const [totalReviews, setTotalReviews] = useState(0);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =====================================================
  // LOAD REVIEWS
  // =====================================================

  const loadReviews = async () => {

    try {

      setLoading(true);

      setError("");

      const response =
        await api.get("/reviews");

      const reviewList =
        Array.isArray(response.data)
          ? response.data
          : [];

      setReviews(reviewList);

    } catch (err) {

      console.error(
        "Admin Reviews Load Error:",
        err
      );

      setError(
        "Failed to load user reviews."
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // LOAD AVERAGE RATING
  // =====================================================

  const loadRating = async () => {

    try {

      const response =
        await api.get("/reviews/average");

      const data =
        response.data || {};

      setAverageRating(
        Number(data.averageRating) || 0
      );

      setTotalReviews(
        Number(data.totalReviews) || 0
      );

    } catch (err) {

      console.error(
        "Admin Rating Load Error:",
        err
      );

    }
  };


  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {

    const loadAllData = async () => {

      await Promise.all([
        loadReviews(),
        loadRating()
      ]);

    };

    loadAllData();

  }, []);


  // =====================================================
  // STAR DISPLAY
  // =====================================================

  const renderStars = (
    value,
    size = 20
  ) => {

    const safeValue =
      Number(value) || 0;

    return (

      <div
        style={{
          display: "flex",
          gap: "3px",
          alignItems: "center"
        }}
      >

        {[1, 2, 3, 4, 5].map(
          (star) => (

            <span
              key={star}
              style={{
                color:
                  star <= safeValue
                    ? "#ffc107"
                    : "#ccc",

                fontSize: `${size}px`,

                lineHeight: 1
              }}
            >
              ★
            </span>

          )
        )}

      </div>

    );
  };


  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDateTime = (date) => {

    if (!date) {
      return "";
    }

    try {

      return new Date(date)
        .toLocaleString();

    } catch {

      return "";

    }
  };


  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = async () => {

    await Promise.all([
      loadReviews(),
      loadRating()
    ]);

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div
      style={{
        width: "92%",
        maxWidth: "1100px",
        margin: "30px auto",
        paddingBottom: "50px"
      }}
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px",
          marginBottom: "25px"
        }}
      >

        <div>

          <h1
            style={{
              margin: 0
            }}
          >
            ⭐ User Reviews
          </h1>

          <p
            style={{
              color: "#666",
              marginTop: "8px"
            }}
          >
            View reviews submitted by HariHire users
          </p>

        </div>


        <button
          onClick={handleRefresh}
          style={{
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          🔄 Refresh
        </button>

      </div>


      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "30px"
        }}
      >

        {/* TOTAL REVIEWS */}

        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "25px",
            textAlign: "center",
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.08)"
          }}
        >

          <div
            style={{
              fontSize: "35px",
              fontWeight: "bold",
              color: "#1976d2"
            }}
          >
            {totalReviews}
          </div>

          <div
            style={{
              color: "#666",
              marginTop: "5px"
            }}
          >
            Total Reviews
          </div>

        </div>


        {/* AVERAGE RATING */}

        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "25px",
            textAlign: "center",
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.08)"
          }}
        >

          <div
            style={{
              fontSize: "35px",
              fontWeight: "bold"
            }}
          >

            {Number(
              averageRating
            ).toFixed(1)}

            <span
              style={{
                color: "#ffc107",
                marginLeft: "7px"
              }}
            >
              ★
            </span>

          </div>


          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "8px"
            }}
          >
            {renderStars(
              Math.round(averageRating),
              20
            )}
          </div>


          <div
            style={{
              color: "#666",
              marginTop: "7px"
            }}
          >
            Average Rating
          </div>

        </div>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div
          style={{
            backgroundColor: "#ffebee",
            color: "#c62828",
            border: "1px solid #ef9a9a",
            padding: "12px 15px",
            borderRadius: "8px",
            marginBottom: "20px"
          }}
        >
          ❌ {error}
        </div>

      )}


      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (

        <div
          style={{
            textAlign: "center",
            padding: "40px"
          }}
        >
          <h3>
            Loading reviews...
          </h3>
        </div>

      )}


      {/* =================================================
          NO REVIEWS
      ================================================= */}

      {!loading &&
        !error &&
        reviews.length === 0 && (

          <div
            style={{
              backgroundColor: "#fff",
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "50px",
              textAlign: "center",
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.06)"
            }}
          >

            <div
              style={{
                fontSize: "50px"
              }}
            >
              ⭐
            </div>

            <h2>
              No Reviews Yet
            </h2>

            <p
              style={{
                color: "#666"
              }}
            >
              No users have submitted reviews yet.
            </p>

          </div>

        )}


      {/* =================================================
          REVIEWS LIST
      ================================================= */}

      {!loading &&
        reviews.length > 0 && (

          <div>

            <h2
              style={{
                marginBottom: "18px"
              }}
            >
              💬 All User Reviews
            </h2>


            {reviews.map(
              (item) => (

                <div
                  key={item.id}
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid #ddd",
                    borderRadius: "12px",
                    padding: "22px",
                    marginBottom: "16px",
                    boxShadow:
                      "0 2px 7px rgba(0,0,0,0.07)"
                  }}
                >

                  {/* =====================================
                      USER INFORMATION
                  ===================================== */}

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "flex-start",
                      gap: "15px",
                      flexWrap: "wrap"
                    }}
                  >

                    <div>

                      <h3
                        style={{
                          margin:
                            "0 0 7px 0"
                        }}
                      >
                        👤{" "}
                        {item.userName ||
                          "User"}
                      </h3>


                      {/* USER ID */}

                      {item.userId && (

                        <div
                          style={{
                            color: "#777",
                            fontSize: "13px",
                            marginBottom: "8px"
                          }}
                        >
                          User ID: {item.userId}
                        </div>

                      )}


                      {renderStars(
                        item.rating,
                        22
                      )}

                    </div>


                    {/* DATE */}

                    <div
                      style={{
                        color: "#888",
                        fontSize: "13px"
                      }}
                    >

                      {formatDateTime(
                        item.createdAt
                      )}

                    </div>

                  </div>


                  {/* =====================================
                      RATING NUMBER
                  ===================================== */}

                  <div
                    style={{
                      marginTop: "15px",
                      fontWeight: "bold",
                      color: "#555"
                    }}
                  >
                    Rating: {item.rating}/5
                  </div>


                  {/* =====================================
                      REVIEW
                  ===================================== */}

                  <div
                    style={{
                      backgroundColor: "#f8f9fa",
                      borderRadius: "8px",
                      padding: "15px",
                      marginTop: "12px"
                    }}
                  >

                    <p
                      style={{
                        margin: 0,
                        lineHeight: "1.7",
                        color: "#333"
                      }}
                    >
                      {item.review}
                    </p>

                  </div>

                </div>

              )
            )}

          </div>

        )}

    </div>

  );
}

export default AdminReviews;