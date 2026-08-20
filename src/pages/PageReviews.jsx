import { useEffect, useState } from "react";
import api from "../axiosConfig";

function PageReviews() {

  // =====================================================
  // CURRENT USER
  // =====================================================

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );


  // =====================================================
  // STATES
  // =====================================================

  const [reviews, setReviews] = useState([]);

  const [averageRating, setAverageRating] = useState(0);

  const [totalReviews, setTotalReviews] = useState(0);

  const [rating, setRating] = useState(0);

  const [review, setReview] = useState("");

  const [hoverRating, setHoverRating] = useState(0);

  const [userReview, setUserReview] = useState(null);

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");


  // =====================================================
  // FIND CURRENT USER REVIEW
  // =====================================================

  const findUserReview = (reviewList) => {

    if (!user || !user.id) {
      setUserReview(null);
      return;
    }

    const currentUserReview =
      reviewList.find(
        (item) =>
          Number(item.userId) === Number(user.id)
      );

    if (currentUserReview) {

      setUserReview(currentUserReview);

    } else {

      setUserReview(null);

    }
  };


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

      // Find current user's review
      findUserReview(reviewList);

    } catch (err) {

      console.error(
        "Reviews Load Error:",
        err
      );

      setError(
        "Failed to load reviews."
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
        "Rating Load Error:",
        err
      );

    }
  };


  // =====================================================
  // LOAD EVERYTHING
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
  // SUBMIT REVIEW
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");

    setError("");


    // -------------------------------------------------
    // LOGIN CHECK
    // -------------------------------------------------

    if (!user || !user.id) {

      setError(
        "Please login to submit a review."
      );

      return;
    }


    // -------------------------------------------------
    // RATING VALIDATION
    // -------------------------------------------------

    if (
      !rating ||
      rating < 1 ||
      rating > 5
    ) {

      setError(
        "Please select a rating from 1 to 5."
      );

      return;
    }


    // -------------------------------------------------
    // REVIEW VALIDATION
    // -------------------------------------------------

    if (!review.trim()) {

      setError(
        "Please write your review."
      );

      return;
    }


    // -------------------------------------------------
    // DUPLICATE REVIEW CHECK
    // -------------------------------------------------

    if (userReview) {

      setError(
        "You have already submitted a review."
      );

      return;
    }


    try {

      setSubmitting(true);

      const response =
        await api.post(
          "/reviews",
          {
            userId: user.id,
            rating: rating,
            review: review.trim()
          }
        );


      console.log(
        "Review Submitted:",
        response.data
      );


      // -------------------------------------------------
      // SUCCESS
      // -------------------------------------------------

      setMessage(
        "Review submitted successfully!"
      );


      // -------------------------------------------------
      // CLEAR FORM
      // -------------------------------------------------

      setRating(0);

      setReview("");

      setHoverRating(0);


      // -------------------------------------------------
      // RELOAD REVIEWS
      // -------------------------------------------------

      await loadReviews();

      await loadRating();


    } catch (err) {

      console.error(
        "Review Submit Error:",
        err
      );


      // Backend error message
      if (
        err.response &&
        err.response.data
      ) {

        const data =
          err.response.data;


        if (
          typeof data === "string"
        ) {

          setError(data);

        } else if (
          data.message
        ) {

          setError(data.message);

        } else if (
          data.error
        ) {

          setError(data.error);

        } else {

          setError(
            "Failed to submit review."
          );

        }

      } else {

        setError(
          "Failed to submit review."
        );

      }

    } finally {

      setSubmitting(false);

    }
  };


  // =====================================================
  // STAR DISPLAY
  // =====================================================

  const renderStars = (value, size = 20) => {

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
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {

    if (!date) {
      return "";
    }

    try {

      return new Date(date)
        .toLocaleDateString();

    } catch {

      return "";

    }
  };


  // =====================================================
  // FORMAT DATE + TIME
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
  // RENDER
  // =====================================================

  return (

    <div
      style={{
        width: "90%",
        maxWidth: "1000px",
        margin: "30px auto",
        paddingBottom: "50px"
      }}
    >


      {/* =================================================
          HEADER
      ================================================= */}

      <div
        style={{
          textAlign: "center",
          marginBottom: "30px"
        }}
      >

        <h1>
          ⭐ HariHire Reviews
        </h1>

        <p
          style={{
            color: "#666"
          }}
        >
          Share your experience with HariHire
        </p>

      </div>


      {/* =================================================
          RATING SUMMARY
      ================================================= */}

      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "25px",
          marginBottom: "30px",
          textAlign: "center",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.08)"
        }}
      >

        <h2
          style={{
            marginTop: 0
          }}
        >
          Overall Rating
        </h2>


        <div
          style={{
            fontSize: "38px",
            fontWeight: "bold",
            margin: "10px 0"
          }}
        >

          {Number(averageRating).toFixed(1)}

          <span
            style={{
              color: "#ffc107",
              marginLeft: "8px"
            }}
          >
            ★
          </span>

        </div>


        <div
          style={{
            display: "flex",
            justifyContent: "center"
          }}
        >

          {renderStars(
            Math.round(averageRating),
            25
          )}

        </div>


        <p
          style={{
            color: "#666",
            marginTop: "10px"
          }}
        >

          Based on {totalReviews} review
          {totalReviews !== 1 ? "s" : ""}

        </p>

      </div>


      {/* =================================================
          ERROR FROM LOAD
      ================================================= */}

      {error &&
        !userReview &&
        !submitting &&
        !loading && (

          <div
            style={{
              backgroundColor: "#ffebee",
              color: "#c62828",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "20px"
            }}
          >
            ❌ {error}
          </div>

        )}


      {/* =================================================
          WRITE REVIEW
      ================================================= */}

      {user && !userReview && (

        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "25px",
            marginBottom: "30px",
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.08)"
          }}
        >

          <h2>
            ✍️ Write a Review
          </h2>


          <form
            onSubmit={handleSubmit}
          >


            {/* =========================================
                RATING
            ========================================= */}

            <div
              style={{
                marginBottom: "20px"
              }}
            >

              <label
                style={{
                  display: "block",
                  fontWeight: "bold",
                  marginBottom: "8px"
                }}
              >
                Your Rating
              </label>


              <div
                style={{
                  display: "flex",
                  gap: "5px"
                }}
              >

                {[1, 2, 3, 4, 5].map(
                  (star) => (

                    <span
                      key={star}

                      onClick={() =>
                        setRating(star)
                      }

                      onMouseEnter={() =>
                        setHoverRating(star)
                      }

                      onMouseLeave={() =>
                        setHoverRating(0)
                      }

                      style={{
                        fontSize: "35px",
                        cursor: "pointer",
                        color:
                          star <=
                          (
                            hoverRating ||
                            rating
                          )
                            ? "#ffc107"
                            : "#ccc",

                        userSelect: "none"
                      }}
                    >
                      ★
                    </span>

                  )
                )}

              </div>


              {rating > 0 && (

                <p
                  style={{
                    margin: "5px 0",
                    color: "#555"
                  }}
                >
                  You selected {rating}/5
                </p>

              )}

            </div>


            {/* =========================================
                REVIEW TEXT
            ========================================= */}

            <div
              style={{
                marginBottom: "20px"
              }}
            >

              <label
                style={{
                  display: "block",
                  fontWeight: "bold",
                  marginBottom: "8px"
                }}
              >
                Your Review
              </label>


              <textarea
                value={review}

                onChange={(e) =>
                  setReview(e.target.value)
                }

                placeholder="Write your experience..."

                rows="5"

                maxLength={1000}

                style={{
                  width: "100%",
                  padding: "12px",
                  border:
                    "1px solid #ccc",
                  borderRadius: "8px",
                  fontSize: "15px",
                  resize: "vertical",
                  boxSizing: "border-box"
                }}
              />


              <small
                style={{
                  color: "#777"
                }}
              >
                {review.length}/1000
              </small>

            </div>


            {/* =========================================
                SUCCESS MESSAGE
            ========================================= */}

            {message && (

              <div
                style={{
                  backgroundColor: "#e8f5e9",
                  color: "#2e7d32",
                  padding: "10px",
                  borderRadius: "6px",
                  marginBottom: "15px"
                }}
              >
                ✅ {message}
              </div>

            )}


            {/* =========================================
                FORM ERROR
            ========================================= */}

            {error && (

              <div
                style={{
                  backgroundColor: "#ffebee",
                  color: "#c62828",
                  padding: "10px",
                  borderRadius: "6px",
                  marginBottom: "15px"
                }}
              >
                ❌ {error}
              </div>

            )}


            {/* =========================================
                SUBMIT
            ========================================= */}

            <button
              type="submit"

              disabled={submitting}

              style={{
                backgroundColor: "#1976d2",
                color: "white",
                border: "none",
                padding: "11px 22px",
                borderRadius: "6px",

                cursor:
                  submitting
                    ? "not-allowed"
                    : "pointer",

                opacity:
                  submitting
                    ? 0.7
                    : 1,

                fontSize: "15px"
              }}
            >

              {submitting
                ? "Submitting..."
                : "Submit Review"}

            </button>

          </form>

        </div>

      )}


      {/* =================================================
          NOT LOGGED IN
      ================================================= */}

      {!user && (

        <div
          style={{
            backgroundColor: "#fff8e1",
            border: "1px solid #ffe082",
            padding: "20px",
            borderRadius: "10px",
            textAlign: "center",
            marginBottom: "30px"
          }}
        >

          <p>
            🔐 Please login to write a review.
          </p>

        </div>

      )}


      {/* =================================================
          ALREADY REVIEWED
      ================================================= */}

      {user && userReview && (

        <div
          style={{
            backgroundColor: "#e8f5e9",
            border: "1px solid #a5d6a7",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "30px"
          }}
        >

          <h3
            style={{
              marginTop: 0
            }}
          >
            ✅ Your Review
          </h3>


          {renderStars(
            userReview.rating,
            22
          )}


          <p
            style={{
              lineHeight: "1.6",
              color: "#333"
            }}
          >
            {userReview.review}
          </p>


          <small
            style={{
              color: "#666"
            }}
          >

            {formatDateTime(
              userReview.createdAt
            )}

          </small>

        </div>

      )}


      {/* =================================================
          ALL REVIEWS
      ================================================= */}

      <div>

        <h2>
          💬 User Reviews
        </h2>


        {/* =============================================
            LOADING
        ============================================= */}

        {loading && (

          <p>
            Loading reviews...
          </p>

        )}


        {/* =============================================
            NO REVIEWS
        ============================================= */}

        {!loading &&
          reviews.length === 0 && (

            <div
              style={{
                border: "1px solid #ddd",
                padding: "30px",
                borderRadius: "10px",
                textAlign: "center"
              }}
            >

              <h3>
                No Reviews Yet
              </h3>

              <p>
                Be the first person to review HariHire!
              </p>

            </div>

          )}


        {/* =============================================
            REVIEWS LIST
        ============================================= */}

        {!loading &&
          reviews.length > 0 && (

            <div>

              {reviews.map(
                (item) => (

                  <div
                    key={item.id}

                    style={{
                      backgroundColor: "#fff",
                      border:
                        "1px solid #ddd",
                      borderRadius: "10px",
                      padding: "20px",
                      marginBottom: "15px",
                      boxShadow:
                        "0 2px 6px rgba(0,0,0,0.06)"
                    }}
                  >


                    {/* =================================
                        USER + DATE
                    ================================= */}

                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems: "center",
                        gap: "10px",
                        flexWrap: "wrap"
                      }}
                    >

                      <div>

                        <h3
                          style={{
                            margin:
                              "0 0 5px 0"
                          }}
                        >
                          👤{" "}
                          {item.userName ||
                            "User"}
                        </h3>


                        {renderStars(
                          item.rating,
                          20
                        )}

                      </div>


                      {item.createdAt && (

                        <small
                          style={{
                            color: "#888"
                          }}
                        >

                          {formatDate(
                            item.createdAt
                          )}

                        </small>

                      )}

                    </div>


                    {/* =================================
                        REVIEW TEXT
                    ================================= */}

                    <p
                      style={{
                        marginTop: "15px",
                        lineHeight: "1.6",
                        color: "#444"
                      }}
                    >
                      {item.review}
                    </p>

                  </div>

                )
              )}

            </div>

          )}

      </div>

    </div>

  );
}

export default PageReviews;