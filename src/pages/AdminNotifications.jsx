import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig";

function AdminNotifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    message: "",
    targetRole: "ALL",
  });

  // =====================================================
  // ADMIN CHECK + INITIAL LOAD
  // =====================================================

  useEffect(() => {
    const adminLoggedIn =
      localStorage.getItem("adminLoggedIn");

    if (adminLoggedIn !== "true") {
      navigate("/login");
      return;
    }

    loadNotifications();
  }, [navigate]);

  // =====================================================
  // LOAD NOTIFICATIONS
  // =====================================================

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/admin/notifications"
      );

      console.log(
        "NOTIFICATIONS RESPONSE:",
        response.data
      );

      if (Array.isArray(response.data)) {
        setNotifications(response.data);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error(
        "LOAD NOTIFICATIONS ERROR:",
        err
      );

      setNotifications([]);

      if (err.response) {
        if (
          typeof err.response.data === "string"
        ) {
          setError(err.response.data);
        } else if (
          `err.response.data?.message`
        ) {
          setError(
            err.response.data.message
          );
        } else if (
          `err.response.data?.error`
        ) {
          setError(
            err.response.data.error
          );
        } else {
          setError(
            "Failed to load notifications. Status: " +
              err.response.status
          );
        }
      } else if (err.message) {
        setError(err.message);
      } else {
        setError(
          "Failed to load notifications."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // SEND BROADCAST
  // =====================================================

  const sendBroadcast = async (event) => {
    event.preventDefault();

    setError("");

    const title = form.title.trim();
    const message = form.message.trim();

    if (!title) {
      alert("Please enter notification title.");
      return;
    }

    if (!message) {
      alert(
        "Please enter notification message."
      );
      return;
    }

    let targetText =
      "all users and recruiters";

    if (form.targetRole === "JOB_SEEKER") {
      targetText = "all job seekers";
    }

    if (form.targetRole === "RECRUITER") {
      targetText = "all recruiters";
    }

    const confirmed = window.confirm(
      "Are you sure you want to send this notification to " +
        targetText +
        "?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setSending(true);

      const notificationData = {
        title,
        message,
        targetRole: form.targetRole,
        senderRole: "ADMIN",
      };

      console.log(
        "SENDING NOTIFICATION:",
        notificationData
      );

      const response = await api.post(
        "/admin/notifications",
        notificationData
      );

      console.log(
        "SEND NOTIFICATION RESPONSE:",
        response.data
      );

      alert(
        "Broadcast notification sent successfully!"
      );

      setForm({
        title: "",
        message: "",
        targetRole: "ALL",
      });

      await loadNotifications();
    } catch (err) {
      console.error(
        "SEND NOTIFICATION ERROR:",
        err
      );

      let messageText =
        "Failed to send notification.";

      if (err.response) {
        if (
          typeof err.response.data === "string"
        ) {
          messageText =
            err.response.data;
        } else if (
          `err.response.data?.message`
        ) {
          messageText =
            err.response.data.message;
        } else if (
          `err.response.data?.error`
        ) {
          messageText =
            err.response.data.error;
        } else {
          messageText =
            "Failed to send notification. Status: " +
            err.response.status;
        }
      } else if (err.message) {
        messageText = err.message;
      }

      setError(messageText);
      alert(messageText);
    } finally {
      setSending(false);
    }
  };

  // =====================================================
  // DELETE NOTIFICATION
  // =====================================================

  const deleteNotification = async (id) => {
    if (!id) {
      alert(
        "Notification ID not found."
      );
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this notification?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(
        "/admin/notifications/" + id
      );

      alert(
        "Notification deleted successfully."
      );

      await loadNotifications();
    } catch (err) {
      console.error(
        "DELETE NOTIFICATION ERROR:",
        err
      );

      let message =
        "Failed to delete notification.";

      if (err.response) {
        if (
          typeof err.response.data === "string"
        ) {
          message =
            err.response.data;
        } else if (
          `err.response.data?.message`
        ) {
          message =
            err.response.data.message;
        } else if (
          `err.response.data?.error`
        ) {
          message =
            err.response.data.error;
        } else {
          message =
            "Failed to delete notification. Status: " +
            err.response.status;
        }
      } else if (err.message) {
        message = err.message;
      }

      setError(message);
      alert(message);
    }
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return String(date);
    }

    return parsedDate.toLocaleString();
  };

  // =====================================================
  // TARGET LABEL
  // =====================================================

  const getTargetLabel = (targetRole) => {
    const role = targetRole
      ? String(targetRole).toUpperCase()
      : "";

    if (role === "ALL") {
      return "Everyone";
    }

    if (role === "JOB_SEEKER") {
      return "Job Seekers";
    }

    if (role === "RECRUITER") {
      return "Recruiters";
    }

    return targetRole || "N/A";
  };

  // =====================================================
  // TARGET STYLE
  // =====================================================

  const getTargetStyle = (targetRole) => {
    const role = targetRole
      ? String(targetRole).toUpperCase()
      : "";

    if (role === "ALL") {
      return {
        backgroundColor: "#e3f2fd",
        color: "#1565c0",
      };
    }

    if (role === "JOB_SEEKER") {
      return {
        backgroundColor: "#e8f5e9",
        color: "#2e7d32",
      };
    }

    if (role === "RECRUITER") {
      return {
        backgroundColor: "#fff3e0",
        color: "#ef6c00",
      };
    }

    return {
      backgroundColor: "#f5f5f5",
      color: "#555",
    };
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div style={loadingStyle}>
        <div>
          <h3>
            Loading Notifications...
          </h3>
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div style={pageStyle}>
      {/* HEADER */}

      <div style={headerStyle}>
        <div>
          <h1 style={headerTitleStyle}>
            📢 Admin Notifications
          </h1>

          <p style={headerSubtitleStyle}>
            Send broadcast notifications to
            users and recruiters.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/admin/dashboard")
          }
          style={buttonStyle}
        >
          ← Dashboard
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <div style={errorStyle}>
          {error}
        </div>
      )}

      {/* CREATE NOTIFICATION */}

      <div style={cardStyle}>
        <h2 style={cardTitleStyle}>
          Create Broadcast
        </h2>

        <form onSubmit={sendBroadcast}>
          {/* TITLE */}

          <label style={labelStyle}>
            Notification Title
          </label>

          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter notification title"
            maxLength={100}
            style={inputStyle}
            disabled={sending}
          />

          {/* MESSAGE */}

          <label style={labelStyle}>
            Notification Message
          </label>

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Enter notification message"
            maxLength={500}
            rows={5}
            style={textareaStyle}
            disabled={sending}
          />

          {/* TARGET */}

          <label style={labelStyle}>
            Send To
          </label>

          <select
            name="targetRole"
            value={form.targetRole}
            onChange={handleChange}
            style={inputStyle}
            disabled={sending}
          >
            <option value="ALL">
              Everyone - Job Seekers & Recruiters
            </option>

            <option value="JOB_SEEKER">
              Job Seekers Only
            </option>

            <option value="RECRUITER">
              Recruiters Only
            </option>
          </select>

          {/* SEND */}

          <div
            style={sendButtonContainer}
          >
            <button
              type="submit"
              disabled={sending}
              style={{
                ...sendButtonStyle,
                opacity: sending ? 0.7 : 1,
                cursor: sending
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              {sending
                ? "Sending..."
                : "📢 Send Notification"}
            </button>
          </div>
        </form>
      </div>

      {/* HISTORY */}

      <div style={cardStyle}>
        <div style={historyHeaderStyle}>
          <h2 style={{ margin: 0 }}>
            Notification History
          </h2>

          <button
            type="button"
            onClick={loadNotifications}
            disabled={loading}
            style={refreshButtonStyle}
          >
            ↻ Refresh
          </button>
        </div>

        {notifications.length === 0 ? (
          <div style={emptyStyle}>
            <h3>
              No Notifications Found
            </h3>

            <p>
              Broadcast notifications will
              appear here.
            </p>
          </div>
        ) : (
          <div style={listStyle}>
            {notifications.map(
              (notification, index) => (
                <div
                  key={
                    `notification.id ??`
                    `notification-${index}`
                  }
                  style={notificationStyle}
                >
                  {/* TOP */}

                  <div
                    style={
                      notificationTopStyle
                    }
                  >
                    <div
                      style={{
                        flex: 1,
                        minWidth: "200px",
                      }}
                    >
                      <h3
                        style={{
                          marginTop: 0,
                          marginBottom: "10px",
                        }}
                      >
                        {notification.title ||
                          "Untitled Notification"}
                      </h3>

                      <p
                        style={{
                          color: "#555",
                          lineHeight: "1.5",
                          marginBottom: 0,
                        }}
                      >
                        {notification.message ||
                          "No message"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        deleteNotification(
                          notification.id
                        )
                      }
                      style={deleteButtonStyle}
                    >
                      Delete
                    </button>
                  </div>

                  {/* DETAILS */}

                  <div
                    style={detailsStyle}
                  >
                    <span
                      style={{
                        ...getTargetStyle(
                          notification.targetRole
                        ),
                        padding:
                          "5px 10px",
                        borderRadius: "15px",
                        fontSize: "13px",
                        fontWeight: "bold",
                      }}
                    >
                      🎯{" "}
                      {getTargetLabel(
                        notification.targetRole
                      )}
                    </span>

                    <span
                      style={detailTextStyle}
                    >
                      👤{" "}
                      {notification.senderRole ||
                        "ADMIN"}
                    </span>

                    <span
                      style={detailTextStyle}
                    >
                      🕒{" "}
                      {formatDate(
                        notification.createdAt
                      )}
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// =====================================================
// STYLES
// =====================================================

const pageStyle = {
  minHeight: "100vh",
  backgroundColor: "#f5f7fa",
  padding: "30px",
  boxSizing: "border-box",
};

const loadingStyle = {
  minHeight: "100vh",
  backgroundColor: "#f5f7fa",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "25px",
  flexWrap: "wrap",
  gap: "15px",
};

const headerTitleStyle = {
  margin: 0,
};

const headerSubtitleStyle = {
  color: "#666",
  marginBottom: 0,
};

const cardStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  padding: "25px",
  marginBottom: "30px",
  boxShadow:
    "0 2px 10px rgba(0,0,0,0.08)",
};

const cardTitleStyle = {
  marginTop: 0,
  marginBottom: "25px",
};

const errorStyle = {
  backgroundColor: "#ffebee",
  color: "#c62828",
  padding: "15px",
  borderRadius: "8px",
  marginBottom: "20px",
};

const labelStyle = {
  display: "block",
  fontWeight: "bold",
  marginBottom: "7px",
  color: "#444",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "18px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  boxSizing: "border-box",
  fontSize: "15px",
  fontFamily: "inherit",
};

const textareaStyle = {
  ...inputStyle,
  resize: "vertical",
};

const buttonStyle = {
  padding: "10px 18px",
  backgroundColor: "#1976d2",
  color: "#ffffff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
};

const sendButtonContainer = {
  display: "flex",
  justifyContent: "flex-end",
};

const sendButtonStyle = {
  padding: "10px 18px",
  backgroundColor: "#1976d2",
  color: "#ffffff",
  border: "none",
  borderRadius: "6px",
  fontSize: "14px",
};

const historyHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
  flexWrap: "wrap",
  gap: "10px",
};

const refreshButtonStyle = {
  padding: "8px 14px",
  backgroundColor: "#1976d2",
  color: "#ffffff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const emptyStyle = {
  padding: "40px",
  textAlign: "center",
  color: "#777",
};

const listStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const notificationStyle = {
  border: "1px solid #e0e0e0",
  borderRadius: "10px",
  padding: "18px",
  backgroundColor: "#fafafa",
};

const notificationTopStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "15px",
  flexWrap: "wrap",
};

const deleteButtonStyle = {
  padding: "7px 12px",
  backgroundColor: "#d32f2f",
  color: "#ffffff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const detailsStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
  marginTop: "15px",
};

const detailTextStyle = {
  color: "#777",
  fontSize: "13px",
};

export default AdminNotifications;