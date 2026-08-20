import { useEffect, useState } from "react";
import api from "../axiosConfig";
import AdBanner from "../components/AdBanner";

function Notifications() {

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  // =====================================================
  // LOAD NOTIFICATIONS
  // =====================================================

  const loadNotifications = async () => {

    if (!user) {

      setLoading(false);

      return;
    }


    try {

      setLoading(true);


      // =================================================
      // PERSONAL NOTIFICATIONS
      // =================================================

      const personalResponse =
        await api.get(
          `/notifications/jobseeker/${user.id}`
        );


      // =================================================
      // BROADCAST NOTIFICATIONS
      // JOB_SEEKER + ALL
      // =================================================

      const broadcastResponse =
        await api.get(
          `/notifications/role/JOB_SEEKER`
        );


      const personalNotifications =
        personalResponse.data || [];

      const broadcastNotifications =
        broadcastResponse.data || [];


      // =================================================
      // MERGE NOTIFICATIONS
      // =================================================

      const mergedNotifications = [
        ...personalNotifications,
        ...broadcastNotifications
      ];


      // =================================================
      // REMOVE DUPLICATES
      // =================================================

      const uniqueNotifications = Array.from(
        new Map(
          mergedNotifications.map(
            (notification) => [
              notification.id,
              notification
            ]
          )
        ).values()
      );


      // =================================================
      // SORT NEWEST FIRST
      // =================================================

      uniqueNotifications.sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      );


      setNotifications(
        uniqueNotifications
      );

    } catch (error) {

      console.log(
        "Notification Load Error:",
        error
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


      // Notify Navbar / notification badge

      window.dispatchEvent(
        new Event("notificationRead")
      );

    } catch (error) {

      console.log(
        "Mark Read Error:",
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
  // NO LOGIN
  // =====================================================

  if (!user) {

    return (

      <div
        style={{
          width: "80%",
          margin: "40px auto",
          textAlign: "center"
        }}
      >

        <h2>
          🔔 Notifications
        </h2>


        <p>
          Please Login to view notifications.
        </p>


        {/* Advertisement */}

        <AdBanner />

      </div>

    );

  }


  // =====================================================
  // MAIN UI
  // =====================================================

  return (

    <div
      style={{
        width: "80%",
        maxWidth: "900px",
        margin: "30px auto"
      }}
    >

      <h2
        style={{
          marginBottom: "25px"
        }}
      >
        🔔 Notifications
      </h2>


      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (

        <p>
          Loading notifications...
        </p>

      )}


      {/* =================================================
          NO NOTIFICATIONS
      ================================================= */}

      {!loading &&
        notifications.length === 0 && (

          <div
            style={{
              border: "1px solid #ddd",
              padding: "30px",
              borderRadius: "10px",
              textAlign: "center"
            }}
          >

            <h3>
              No Notifications
            </h3>


            <p>
              You don't have any
              notifications yet.
            </p>

          </div>

        )}


      {/* =================================================
          NOTIFICATIONS LIST
      ================================================= */}

      {!loading &&
        notifications.length > 0 && (

          <div>

            {notifications.map(
              (notification) => (

                <div
                  key={notification.id}
                  style={{
                    border:
                      notification.read
                        ? "1px solid #ddd"
                        : "2px solid #1976d2",

                    backgroundColor:
                      notification.read
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
                      justifyContent:
                        "space-between",
                      alignItems: "center",
                      gap: "10px"
                    }}
                  >

                    <h3
                      style={{
                        margin:
                          "0 0 10px 0"
                      }}
                    >
                      {notification.title ||
                        "Notification"}
                    </h3>


                    {!notification.read && (

                      <span
                        style={{
                          backgroundColor:
                            "#1976d2",
                          color: "white",
                          padding:
                            "4px 10px",
                          borderRadius:
                            "15px",
                          fontSize: "12px",
                          fontWeight: "bold"
                        }}
                      >
                        NEW
                      </span>

                    )}

                  </div>


                  {/* =================================================
                      BROADCAST BADGE
                  ================================================= */}

                  {notification.targetRole && (

                    <div
                      style={{
                        marginBottom: "10px"
                      }}
                    >

                      <span
                        style={{
                          display:
                            "inline-block",
                          backgroundColor:
                            "#e3f2fd",
                          color:
                            "#1565c0",
                          padding:
                            "4px 10px",
                          borderRadius:
                            "15px",
                          fontSize: "12px",
                          fontWeight: "bold"
                        }}
                      >
                        📢{" "}
                        {notification.targetRole ===
                        "ALL"
                          ? "Broadcast"
                          : "Notification"}
                      </span>

                    </div>

                  )}


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
                      SENDER
                  ================================================= */}

                  <p
                    style={{
                      margin: "8px 0",
                      color: "#666",
                      fontSize: "13px"
                    }}
                  >

                    <b>
                      From:
                    </b>{" "}

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
                        markAsRead(
                          notification.id
                        )
                      }
                      style={{
                        backgroundColor:
                          "#1976d2",
                        color: "white",
                        border: "none",
                        padding: "8px 15px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        marginTop: "8px"
                      }}
                    >
                      Mark as Read
                    </button>

                  )}


                  {/* =================================================
                      ALREADY READ
                  ================================================= */}

                  {notification.read && (

                    <span
                      style={{
                        color: "green",
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


      {/* =================================================
          ADVERTISEMENT
      ================================================= */}

      <AdBanner />

    </div>

  );

}

export default Notifications;