import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig";

function AdminDashboard() {
  const navigate = useNavigate();

  // =====================================================
  // STATES
  // =====================================================

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRecruiters: 0,
    totalJobs: 0,
    totalApplications: 0,
    selectedApplications: 0,
    rejectedApplications: 0,
    pendingApplications: 0,
  });

  const [loading, setLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");

  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [revenueSummary, setRevenueSummary] = useState({
    totalRevenue: 0,
    totalClicks: 0,
    totalImpressions: 0,
    ctr: 0,
  });

  const [revenueLoading, setRevenueLoading] = useState(false);
  const [revenueError, setRevenueError] = useState("");

  // Change password
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // =====================================================
  // CHECK LOGIN
  // =====================================================

  useEffect(() => {
    const adminLoggedIn =
      localStorage.getItem("adminLoggedIn");

    if (adminLoggedIn !== "true") {
      navigate("/login");
      return;
    }

    loadDashboard();
    loadRevenue();
  }, [navigate]);

  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setDashboardError("");

      const response = await api.get("/admin/dashboard");

      console.log("ADMIN DASHBOARD RESPONSE:", response.data);

      const data = response.data || {};

      setStats({
        totalUsers: Number(data.totalUsers) || 0,
        totalRecruiters: Number(data.totalRecruiters) || 0,
        totalJobs: Number(data.totalJobs) || 0,
        totalApplications: Number(data.totalApplications) || 0,
        selectedApplications:
          Number(data.selectedApplications) || 0,
        rejectedApplications:
          Number(data.rejectedApplications) || 0,
        pendingApplications:
          Number(data.pendingApplications) || 0,
      });
    } catch (error) {
      console.error("DASHBOARD ERROR:", error);

      setDashboardError(
        "Failed to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD REVENUE
  // =====================================================

  const loadRevenue = async () => {
    try {
      setRevenueLoading(true);
      setRevenueError("");

      // -------------------------------------------------
      // MONTHLY REVENUE
      // -------------------------------------------------

      const monthlyResponse = await api.get(
        "/admin/ad-revenue/monthly"
      );

      console.log(
        "MONTHLY REVENUE:",
        monthlyResponse.data
      );

      const responseData =
        monthlyResponse.data;

      let formattedData = [];

      // Backend returns object
      // {
      //   JANUARY: 1000,
      //   FEBRUARY: 2000
      // }

      if (
        responseData &&
        typeof responseData === "object" &&
        !Array.isArray(responseData)
      ) {
        formattedData = Object.entries(
          responseData
        ).map(([month, revenue]) => ({
          month,
          revenue: Number(revenue) || 0,
        }));
      }

      // Backend returns array
      if (Array.isArray(responseData)) {
        formattedData = responseData.map(
          (item) => ({
            month:
              item.month ||
              item.revenueDate ||
              "Unknown",

            revenue:
              Number(item.revenue) || 0,
          })
        );
      }

      setMonthlyRevenue(formattedData);

      // -------------------------------------------------
      // REVENUE SUMMARY
      // -------------------------------------------------

      try {
        const summaryResponse =
          await api.get(
            "/admin/ad-revenue"
          );

        console.log(
          "REVENUE SUMMARY:",
          summaryResponse.data
        );

        const summary =
          summaryResponse.data || {};

        setRevenueSummary({
          totalRevenue:
            Number(summary.totalRevenue) || 0,

          totalClicks:
            Number(summary.totalClicks) || 0,

          totalImpressions:
            Number(summary.totalImpressions) || 0,

          ctr:
            Number(summary.ctr) || 0,
        });
      } catch (summaryError) {
        console.error(
          "SUMMARY ERROR:",
          summaryError
        );

        // Don't break monthly revenue
        setRevenueSummary({
          totalRevenue: 0,
          totalClicks: 0,
          totalImpressions: 0,
          ctr: 0,
        });
      }
    } catch (error) {
      console.error(
        "REVENUE ERROR:",
        error
      );

      setRevenueError(
        "Failed to load revenue data."
      );

      setMonthlyRevenue([]);
    } finally {
      setRevenueLoading(false);
    }
  };

  // =====================================================
  // ADMIN EMAIL
  // =====================================================

  const getAdminEmail = () => {
    const adminEmail =
      localStorage.getItem("adminEmail");

    if (adminEmail) {
      return adminEmail;
    }

    try {
      const adminUser =
        JSON.parse(
          localStorage.getItem("adminUser")
        );

      if (`adminUser?.email`) {
        return adminUser.email;
      }
    } catch (error) {
      console.log(
        "No adminUser found"
      );
    }

    try {
      const user =
        JSON.parse(
          localStorage.getItem("user")
        );

      if (`user?.email`) {
        return user.email;
      }
    } catch (error) {
      console.log(
        "No user found"
      );
    }

    return null;
  };

  // =====================================================
  // CHANGE PASSWORD
  // =====================================================

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setPasswordError(
        "Please fill all fields."
      );
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(
        "New password must contain at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        "New password and confirm password do not match."
      );
      return;
    }

    const email = getAdminEmail();

    if (!email) {
      setPasswordError(
        "Admin email not found. Please login again."
      );
      return;
    }

    try {
      setPasswordLoading(true);

      const response = await api.put(
        "/admin/change-password",
        {
          email: email,
          oldPassword: currentPassword,
          newPassword: newPassword,
        }
      );

      console.log(
        "CHANGE PASSWORD:",
        response.data
      );

      setPasswordMessage(
        "Password changed successfully."
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(
        "CHANGE PASSWORD ERROR:",
        error
      );

      if (
        `error.response?.data`
      ) {
        if (
          typeof error.response.data ===
          "string"
        ) {
          setPasswordError(
            error.response.data
          );
        } else if (
          error.response.data.message
        ) {
          setPasswordError(
            error.response.data.message
          );
        } else {
          setPasswordError(
            "Failed to change password."
          );
        }
      } else {
        setPasswordError(
          "Failed to change password."
        );
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem(
      "adminLoggedIn"
    );

    localStorage.removeItem(
      "adminEmail"
    );

    localStorage.removeItem(
      "adminUser"
    );

    navigate("/login");
  };

  // =====================================================
  // CURRENT MONTH REVENUE
  // =====================================================

  const getCurrentMonthRevenue = () => {
    const currentMonth =
      new Date()
        .toLocaleString("en-US", {
          month: "long",
        })
        .toUpperCase();

    const found =
      monthlyRevenue.find(
        (item) =>
          String(item.month)
            .toUpperCase() ===
          currentMonth
      );

    return found
      ? Number(found.revenue) || 0
      : 0;
  };

  // =====================================================
  // TOTAL REVENUE
  // =====================================================

  const getTotalRevenue = () => {
    return monthlyRevenue.reduce(
      (sum, item) =>
        sum +
        (Number(item.revenue) || 0),
      0
    );
  };

  // =====================================================
  // FORMAT MONTH
  // =====================================================

  const formatMonth = (month) => {
    if (!month) {
      return "Unknown";
    }

    const text =
      String(month).toLowerCase();

    return (
      text.charAt(0).toUpperCase() +
      text.slice(1)
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div style={centerStyle}>
        <h2>
          Loading Admin Dashboard...
        </h2>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (dashboardError) {
    return (
      <div style={centerStyle}>
        <h3>
          {dashboardError}
        </h3>

        <button
          onClick={loadDashboard}
          style={retryButton}
        >
          Retry
        </button>
      </div>
    );
  }

  // =====================================================
  // VALUES
  // =====================================================

  const currentMonthRevenue =
    getCurrentMonthRevenue();

  const totalRevenue =
    getTotalRevenue();

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div style={pageStyle}>

      {/* =================================================
          HEADER
      ================================================= */}

      <div style={headerStyle}>

        <div>
          <h1 style={{ margin: 0 }}>
            Admin Dashboard
          </h1>

          <p style={subText}>
            Welcome to HariHire Admin Panel
          </p>
        </div>

        <button
          onClick={handleLogout}
          style={logoutButton}
        >
          Logout
        </button>

      </div>

      {/* =================================================
          STATISTICS
      ================================================= */}

      <div style={gridStyle}>

        <StatCard
          title="Total Job Seekers"
          value={stats.totalUsers}
          icon="👥"
        />

        <StatCard
          title="Total Recruiters"
          value={stats.totalRecruiters}
          icon="🧑‍💼"
        />

        <StatCard
          title="Total Jobs"
          value={stats.totalJobs}
          icon="💼"
        />

        <StatCard
          title="Total Applications"
          value={stats.totalApplications}
          icon="📋"
        />

        <StatCard
          title="Selected Applications"
          value={stats.selectedApplications}
          icon="✅"
        />

        <StatCard
          title="Rejected Applications"
          value={stats.rejectedApplications}
          icon="❌"
        />

        <StatCard
          title="Pending Applications"
          value={stats.pendingApplications}
          icon="⏳"
        />

      </div>

      {/* =================================================
          REVENUE
      ================================================= */}

      <div style={sectionStyle}>

        <div style={sectionHeader}>

          <div>
            <h2 style={{ margin: 0 }}>
              💰 Advertisement Revenue
            </h2>

            <p style={subText}>
              Monitor advertisement
              revenue, clicks and impressions.
            </p>
          </div>

          <button
            onClick={loadRevenue}
            disabled={revenueLoading}
            style={{
              ...refreshButton,
              opacity:
                revenueLoading
                  ? 0.6
                  : 1,
            }}
          >
            🔄{" "}
            {revenueLoading
              ? "Loading..."
              : "Refresh"}
          </button>

        </div>

        {/* REVENUE CARDS */}

        <div style={revenueGrid}>

          <RevenueCard
            title="Current Month Revenue"
            value={
              `₹${currentMonthRevenue.toFixed(2)}`
            }
          />

          <RevenueCard
            title="Total Recorded Revenue"
            value={
              `₹${totalRevenue.toFixed(2)}`
            }
          />

          <RevenueCard
            title="Live Ad Revenue"
            value={
              `₹${Number(
                revenueSummary.totalRevenue
              ).toFixed(2)}`
            }
          />

          <RevenueCard
            title="Total Ad Clicks"
            value={
              revenueSummary.totalClicks
            }
          />

          <RevenueCard
            title="Total Impressions"
            value={
              revenueSummary.totalImpressions
            }
          />

          <RevenueCard
            title="Advertisement CTR"
            value={
              `${Number(
                revenueSummary.ctr
              ).toFixed(2)}%`
            }
          />

        </div>

        {/* REVENUE ERROR */}

        {revenueError && (
          <div style={errorBox}>
            ❌ {revenueError}
          </div>
        )}

        {/* NO DATA */}

        {!revenueLoading &&
          !revenueError &&
          monthlyRevenue.length === 0 && (
            <div style={emptyBox}>
              <h3>
                No Revenue Records
              </h3>

              <p>
                Advertisement revenue
                records will appear here.
              </p>
            </div>
          )}

        {/* MONTHLY TABLE */}

        {!revenueLoading &&
          monthlyRevenue.length > 0 && (
            <div
              style={{
                overflowX: "auto",
                marginTop: "25px",
              }}
            >

              <h3>
                📊 Monthly Revenue
              </h3>

              <table style={tableStyle}>

                <thead>
                  <tr>
                    <th style={thStyle}>
                      #
                    </th>

                    <th
                      style={{
                        ...thStyle,
                        textAlign: "left",
                      }}
                    >
                      Month
                    </th>

                    <th
                      style={{
                        ...thStyle,
                        textAlign: "right",
                      }}
                    >
                      Revenue
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {monthlyRevenue.map(
                    (item, index) => (
                      <tr
                        key={
                          `${item.month}-${index}`
                        }
                      >

                        <td style={tdStyle}>
                          {index + 1}
                        </td>

                        <td
                          style={{
                            ...tdStyle,
                            textAlign: "left",
                            fontWeight: "600",
                          }}
                        >
                          📅{" "}
                          {formatMonth(
                            item.month
                          )}
                        </td>

                        <td
                          style={{
                            ...tdStyle,
                            textAlign: "right",
                            fontWeight: "bold",
                          }}
                        >
                          ₹
                          {Number(
                            item.revenue
                          ).toFixed(2)}
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

      </div>

      {/* =================================================
          ADMIN MANAGEMENT
      ================================================= */}

      <div style={{ marginTop: "40px" }}>

        <h2>
          Admin Management
        </h2>

        <div style={managementGrid}>

          <ManageButton
            text="💼 Manage Jobs"
            color="#1976d2"
            onClick={() =>
              navigate("/admin/jobs")
            }
          />

          <ManageButton
            text="👥 Manage Users"
            color="#455a64"
            onClick={() =>
              navigate("/admin/users")
            }
          />

          <ManageButton
            text="📋 Manage Applications"
            color="#6a1b9a"
            onClick={() =>
              navigate(
                "/admin/applications"
              )
            }
          />

          <ManageButton
            text="🧑‍💼 Recruiters"
            color="#00897b"
            onClick={() =>
              navigate(
                "/admin/recruiters"
              )
            }
          />

          <ManageButton
            text="📢 Manage Ads"
            color="#e65100"
            onClick={() =>
              navigate("/admin/ads")
            }
          />

          <ManageButton
            text="💰 Ads Revenue"
            color="#ef6c00"
            onClick={() =>
              navigate("/admin/revenue")
            }
          />

          <ManageButton
            text="🔔 Notifications"
            color="#c2185b"
            onClick={() =>
              navigate(
                "/admin/notifications"
              )
            }
          />

          <ManageButton
            text="🔐 Change Password"
            color="#5e35b1"
            onClick={() => {
              setShowPassword(
                !showPassword
              );

              setPasswordMessage("");
              setPasswordError("");
            }}
          />

        </div>

      </div>

      {/* =================================================
          CHANGE PASSWORD
      ================================================= */}

      {showPassword && (
        <div
          style={{
            ...sectionStyle,
            maxWidth: "550px",
            marginTop: "30px",
          }}
        >

          <h2>
            🔐 Change Admin Password
          </h2>

          <form
            onSubmit={
              handleChangePassword
            }
          >

            <Input
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={
                setCurrentPassword
              }
              placeholder="Enter current password"
            />

            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={
                setNewPassword
              }
              placeholder="Enter new password"
            />

            <Input
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={
                setConfirmPassword
              }
              placeholder="Confirm new password"
            />

            {passwordMessage && (
              <div
                style={{
                  ...successBox,
                  marginBottom: "15px",
                }}
              >
                ✅ {passwordMessage}
              </div>
            )}

            {passwordError && (
              <div
                style={{
                  ...errorBox,
                  marginBottom: "15px",
                }}
              >
                ❌ {passwordError}
              </div>
            )}

            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
            >

              <button
                type="submit"
                disabled={
                  passwordLoading
                }
                style={passwordButton}
              >
                {passwordLoading
                  ? "Updating..."
                  : "Update Password"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowPassword(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setPasswordError("");
                  setPasswordMessage("");
                }}
                style={cancelButton}
              >
                Cancel
              </button>

            </div>

          </form>

        </div>
      )}

      {/* =================================================
          ADS INFORMATION
      ================================================= */}

      <div
        style={{
          ...sectionStyle,
          marginTop: "35px",
        }}
      >

        <h2>
          📢 Advertisement Management
        </h2>

        <p style={subText}>
          Create, edit, activate,
          deactivate and delete
          advertisements.
        </p>

        <button
          onClick={() =>
            navigate("/admin/ads")
          }
          style={adButton}
        >
          Open Manage Ads
        </button>

      </div>

    </div>
  );
}

// =====================================================
// STAT CARD
// =====================================================

function StatCard({
  title,
  value,
  icon,
}) {
  return (
    <div style={cardStyle}>
      <h3>
        {icon} {title}
      </h3>

      <h1
        style={{
          marginBottom: 0,
        }}
      >
        {Number(value) || 0}
      </h1>
    </div>
  );
}

// =====================================================
// REVENUE CARD
// =====================================================

function RevenueCard({
  title,
  value,
}) {
  return (
    <div
      style={{
        backgroundColor: "#f5f7fa",
        padding: "20px",
        borderRadius: "10px",
      }}
    >
      <h4
        style={{
          margin: 0,
          color: "#555",
        }}
      >
        {title}
      </h4>

      <h2
        style={{
          marginBottom: 0,
          color: "#1976d2",
        }}
      >
        {value}
      </h2>
    </div>
  );
}

// =====================================================
// MANAGEMENT BUTTON
// =====================================================

function ManageButton({
  text,
  color,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      style={{
        ...buttonStyle,
        backgroundColor: color,
      }}
    >
      {text}
    </button>
  );
}

// =====================================================
// INPUT
// =====================================================

function Input({
  label,
  type,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div style={inputGroupStyle}>
      <label>
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  );
}

// =====================================================
// STYLES
// =====================================================

const pageStyle = {
  padding: "30px",
  backgroundColor: "#f5f7fa",
  minHeight: "100vh",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px",
  flexWrap: "wrap",
  gap: "15px",
};

const subText = {
  color: "#666",
  marginTop: "7px",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
};

const cardStyle = {
  backgroundColor: "white",
  padding: "25px",
  borderRadius: "10px",
  boxShadow:
    "0 2px 8px rgba(0,0,0,0.1)",
};

const sectionStyle = {
  marginTop: "40px",
  backgroundColor: "white",
  padding: "25px",
  borderRadius: "12px",
  boxShadow:
    "0 2px 8px rgba(0,0,0,0.1)",
};

const sectionHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "15px",
};

const revenueGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(210px, 1fr))",
  gap: "15px",
  marginTop: "25px",
};

const managementGrid = {
  display: "flex",
  gap: "15px",
  flexWrap: "wrap",
};

const buttonStyle = {
  color: "white",
  border: "none",
  padding: "12px 20px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "15px",
};

const logoutButton = {
  backgroundColor: "#d32f2f",
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: "6px",
  cursor: "pointer",
};

const refreshButton = {
  backgroundColor: "#1976d2",
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: "6px",
  cursor: "pointer",
};

const adButton = {
  backgroundColor: "#e65100",
  color: "white",
  border: "none",
  padding: "11px 18px",
  borderRadius: "6px",
  cursor: "pointer",
};

const passwordButton = {
  backgroundColor: "#5e35b1",
  color: "white",
  border: "none",
  padding: "11px 20px",
  borderRadius: "6px",
  cursor: "pointer",
};

const cancelButton = {
  backgroundColor: "#757575",
  color: "white",
  border: "none",
  padding: "11px 20px",
  borderRadius: "6px",
  cursor: "pointer",
};

const inputGroupStyle = {
  display: "flex",
  flexDirection: "column",
  marginBottom: "15px",
  gap: "6px",
};

const inputStyle = {
  padding: "11px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  fontSize: "15px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const thStyle = {
  padding: "13px",
  borderBottom: "2px solid #ddd",
  textAlign: "center",
};

const tdStyle = {
  padding: "13px",
  borderBottom: "1px solid #eee",
  textAlign: "center",
};

const errorBox = {
  backgroundColor: "#ffebee",
  color: "#c62828",
  padding: "12px",
  borderRadius: "7px",
};

const successBox = {
  backgroundColor: "#e8f5e9",
  color: "#2e7d32",
  padding: "10px",
  borderRadius: "6px",
};

const emptyBox = {
  padding: "30px",
  textAlign: "center",
  border: "1px solid #ddd",
  borderRadius: "8px",
  marginTop: "20px",
};

const centerStyle = {
  padding: "50px",
  textAlign: "center",
};

const retryButton = {
  padding: "10px 20px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

export default AdminDashboard;