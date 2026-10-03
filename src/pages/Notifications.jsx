import { useEffect, useState } from "react";
import api from "../axiosConfig";
import AdBanner from "../components/AdBanner";
import "../styles/Notifications.css";
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

    <div className="notifications-page">
  
      <div className="notifications-header">
        <h1>🔔 Notifications</h1>
  
        <p>
          Stay updated with job alerts, application updates,
          recruiter messages and platform announcements.
        </p>
      </div>
  
      {loading && (
  
        <div className="loading-box">
          Loading Notifications...
        </div>
  
      )}
  
      {!loading &&
        notifications.length === 0 && (
  
          <div className="no-notification-box">
  
            <h3>No Notifications</h3>
  
            <p>
              You don't have any notifications yet.
            </p>
  
          </div>
  
        )}
  
      {!loading &&
        notifications.length > 0 && (
  
          <div className="notifications-list">
  
            {notifications.map((notification) => (
  
              <div
                key={notification.id}
                className={
                  notification.read
                    ? "notification-card"
                    : "notification-card unread"
                }
              >
  
                <div className="notification-top">
  
                  <h3>
                    {notification.title ||
                      "Notification"}
                  </h3>
  
                  {!notification.read && (
  
                    <span className="new-badge">
                      NEW
                    </span>
  
                  )}
  
                </div>
  
                {notification.targetRole && (
  
                  <span className="broadcast-badge">
  
                    📢{" "}
  
                    {notification.targetRole === "ALL"
                      ? "Broadcast"
                      : "Notification"}
  
                  </span>
  
                )}
  
                <p className="notification-message">
                  {notification.message}
                </p>
  
                <div className="notification-footer">
  
                  <div>
  
                    <p className="notification-sender">
  
                      <b>From:</b>{" "}
  
                      {notification.senderRole ||
                        "ADMIN"}
  
                    </p>
  
                    {notification.createdAt && (
  
                      <p className="notification-date">
  
                        {new Date(
                          notification.createdAt
                        ).toLocaleString()}
  
                      </p>
  
                    )}
  
                  </div>
  
                  {!notification.read ? (
  
                    <button
                      className="mark-read-btn"
                      onClick={() =>
                        markAsRead(
                          notification.id
                        )
                      }
                    >
                      Mark as Read
                    </button>
  
                  ) : (
  
                    <span className="read-badge">
                      ✔ Read
                    </span>
  
                  )}
  
                </div>
  
              </div>
  
            ))}
  
          </div>
  
        )}
  
      <div className="notification-ad">
        <AdBanner />
      </div>
  
    </div>
  
  
  );

}

export default Notifications;