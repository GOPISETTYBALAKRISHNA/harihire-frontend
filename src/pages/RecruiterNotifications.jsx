import { useEffect, useState } from "react";
import api from "../axiosConfig";

function RecruiterNotifications() {

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // GET LOGGED-IN RECRUITER
  // =====================================================

  const recruiter = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  // =====================================================
  // LOAD RECRUITER NOTIFICATIONS
  // =====================================================

  const loadNotifications = async () => {

    if (!recruiter || !recruiter.id) {
      setError("Recruiter login information not found.");
      setLoading(false);
      return;
    }

    try {

      setLoading(true);
      setError("");

      const response = await api.get(
        `/notifications/recruiter/${recruiter.id}`
      );

      console.log(
        "RECRUITER NOTIFICATIONS:",
        response.data
      );

      setNotifications(response.data);

    } catch (error) {

      console.error(
        "Recruiter Notification Load Error:",
        error
      );

      setError(
        "Failed to load recruiter notifications."
      );

    } finally {

      setLoading(false);

    }
  };

  // =====================================================
  // MARK SINGLE NOTIFICATION AS READ
  // =====================================================

  const markAsRead = async (id) => {

    try {

      await api.put(
        `/notifications/${id}/read`
      );

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                read: true
              }
            : notification
        )
      );

      // Navbar notification count refresh
      window.dispatchEvent(
        new Event("notificationRead")
      );

    } catch (error) {

      console.error(
        "Mark Recruiter Notification Read Error:",
        error
      );

    }
  };

  // =====================================================
  // LOAD ON PAGE OPEN
  // =====================================================

  useEffect(() => {

    loadNotifications();

  }, []);

  // =====================================================
  // NO RECRUITER LOGIN
  // =====================================================

  if (!recruiter) {

    return (
      <div
        style={{
          width: "80%",
          margin: "40px auto",
          textAlign: "center"
        }}
      >

        <h2>🔔 Recruiter Notifications</h2>

        <p>
          Please login as a recruiter to view notifications.
        </p>

      </div>
    );
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div
        style={{
          width: "80%",
          margin: "40px auto",
          textAlign: "center"
        }}
      >

        <h2>🔔 Recruiter Notifications</h2>

        <p>
          Loading notifications...
        </p>

      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div
      style={{
        width: "80%",
        maxWidth: "900px",
        margin: "30px auto"
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
          marginBottom: "25px",
          flexWrap: "wrap",
          gap: "10px"
        }}
      >

        <h2 style={{ margin: 0 }}>
          🔔 Recruiter Notifications
        </h2>

        <button
          onClick={loadNotifications}
          style={{
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            padding: "9px 16px",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          🔄 Refresh
        </button>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div
          style={{
            backgroundColor: "#ffebee",
            color: "#c62828",
            padding: "12px",
            borderRadius: "7px",
            marginBottom: "20px"
          }}
        >
          ❌ {error}
        </div>

      )}

      {/* =================================================
          NO NOTIFICATIONS
      ================================================= */}

      {!error &&
        notifications.length === 0 && (

          <div
            style={{
              border: "1px solid #ddd",
              padding: "35px",
              borderRadius: "10px",
              textAlign: "center",
              backgroundColor: "#fff"
            }}
          >

            <h3>
              🔔 No Notifications
            </h3>

            <p style={{ color: "#666" }}>
              You don't have any notifications yet.
            </p>

          </div>

        )}

      {/* =================================================
          NOTIFICATIONS LIST
      ================================================= */}

      {notifications.length > 0 && (

        <div>

          {notifications.map(
            (notification) => (

              <div
                key={notification.id}
                style={{
                  border: notification.read
                    ? "1px solid #ddd"
                    : "2px solid #1976d2",

                  backgroundColor: notification.read
                    ? "#ffffff"
                    : "#eaf3ff",

                  padding: "18px",
                  marginBottom: "15px",
                  borderRadius: "10px",

                  boxShadow:
                    "0 2px 6px rgba(0,0,0,0.08)"
                }}
              >

                {/* =================================================
                    TITLE + NEW
                ================================================= */}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "10px"
                  }}
                >

                  <h3
                    style={{
                      margin: "0 0 10px 0"
                    }}
                  >
                    {notification.title ||
                      "Notification"}
                  </h3>

                  {!notification.read && (

                    <span
                      style={{
                        backgroundColor: "#1976d2",
                        color: "white",
                        padding: "4px 10px",
                        borderRadius: "15px",
                        fontSize: "12px",
                        fontWeight: "bold"
                      }}
                    >
                      NEW
                    </span>

                  )}

                </div>

                {/* =================================================
                    MESSAGE
                ================================================= */}

                <p
                  style={{
                    margin: "8px 0",
                    color: "#333",
                    fontSize: "15px",
                    lineHeight: "1.5"
                  }}
                >
                  {notification.message}
                </p>

                {/* =================================================
                    FROM
                ================================================= */}

                <p
                  style={{
                    margin: "8px 0",
                    color: "#666",
                    fontSize: "13px"
                  }}
                >
                  <b>From:</b>{" "}
                  {notification.senderRole ||
                    "ADMIN"}
                </p>

                {/* =================================================
                    DATE
                ================================================= */}

                {notification.createdAt && (

                  <p
                    style={{
                      margin: "8px 0",
                      color: "#888",
                      fontSize: "12px"
                    }}
                  >
                    {new Date(
                      notification.createdAt
                    ).toLocaleString()}
                  </p>

                )}

                {/* =================================================
                    MARK AS READ
                ================================================= */}

                {!notification.read && (

                  <button
                    onClick={() =>
                      markAsRead(notification.id)
                    }
                    style={{
                      backgroundColor: "#1976d2",
                      color: "white",
                      border: "none",
                      padding: "8px 15px",
                      borderRadius: "5px",
                      cursor: "pointer",
                      marginTop: "8px"
                    }}
                  >
                    ✔ Mark as Read
                  </button>

                )}

                {/* =================================================
                    READ
                ================================================= */}

                {notification.read && (

                  <span
                    style={{
                      color: "#2e7d32",
                      fontSize: "13px"
                    }}
                  >
                    ✔️ Read
                  </span>

                )}

              </div>

            )
          )}

        </div>

      )}

    </div>

  );
}

export default RecruiterNotifications;