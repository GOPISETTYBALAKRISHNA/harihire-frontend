import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../axiosConfig";
import "../styles/Navbar.css";

function Navbar({
  isLoggedIn,
  setIsLoggedIn,
  isAdminLoggedIn,
  setIsAdminLoggedIn
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ==================================================
  // GET USER SAFELY
  // ==================================================
  const getStoredUser = () => {
    try {
      return JSON.parse(
        localStorage.getItem("user") || "null"
      );
    } catch (error) {
      console.log("User parse error:", error);
      return null;
    }
  };

  const user = getStoredUser();

  // ==================================================
  // NOTIFICATION COUNT
  // ==================================================
  const [notificationCount, setNotificationCount] = useState(0);

  // ==================================================
  // LOAD NOTIFICATION COUNT
  // ==================================================
  const loadNotificationCount = async () => {
    if (!isLoggedIn) {
      setNotificationCount(0);
      return;
    }

    if (!user || !user.id) {
      setNotificationCount(0);
      return;
    }

    if (user.role === "RECRUITER" || user.role === "ADMIN") {
      setNotificationCount(0);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setNotificationCount(0);
      return;
    }

    try {
      const response = await api.get("/notifications/count");
      setNotificationCount(Number(response.data) || 0);
    } catch (error) {
      console.log(
        "Notification count error:",
        error.response?.status || error.message
      );
    }
  };

  // ==================================================
  // CLOSE MOBILE MENU ON ROUTE CHANGE
  // ==================================================
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // ==================================================
  // USER NOTIFICATION INTERVAL
  // ==================================================
  useEffect(() => {
    if (!isLoggedIn) {
      setNotificationCount(0);
      return;
    }

    if (!user || !user.id) {
      setNotificationCount(0);
      return;
    }

    if (user.role === "RECRUITER" || user.role === "ADMIN") {
      setNotificationCount(0);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setNotificationCount(0);
      return;
    }

    loadNotificationCount();

    const interval = setInterval(() => {
      loadNotificationCount();
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [isLoggedIn]);

  // ==================================================
  // RECRUITER ACTIVITY
  // ==================================================
  useEffect(() => {
    if (
      !isLoggedIn ||
      !user ||
      !user.id ||
      user.role !== "RECRUITER"
    ) {
      return;
    }

    const updateActivity = async () => {
      try {
        await api.put(`/users/activity/${user.id}`);
      } catch (error) {
        console.log("Recruiter activity update failed:", error);
      }
    };

    updateActivity();

    const interval = setInterval(() => {
      updateActivity();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [isLoggedIn]);

  // ==================================================
  // LOGOUT
  // ==================================================
  const handleLogout = async () => {
    try {
      if (user && user.role === "RECRUITER") {
        try {
          await api.put(`/users/logout/${user.id}`);
        } catch (error) {
          console.log("Recruiter logout status update failed:", error);
        }
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("adminLoggedIn");

      setNotificationCount(0);
      setIsLoggedIn(false);
      setIsAdminLoggedIn(false);
      setIsMobileMenuOpen(false);

      alert("Logged Out Successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("adminLoggedIn");

      setNotificationCount(0);
      setIsLoggedIn(false);
      setIsAdminLoggedIn(false);
      setIsMobileMenuOpen(false);

      navigate("/login");
    }
  };

  // Helper to determine active link
  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // ==================================================
  // 1. ADMIN CONSOLE NAVBAR
  // ==================================================
  if (isAdminLoggedIn) {
    return (
      <header className="hh-shell hh-admin-theme">
        <div className="hh-bar">
          {/* Brand */}
          <div className="hh-brand">
            <Link to="/" className="hh-brand-anchor" aria-label="HariHire Admin Home">
              <div className="hh-brand-logo hh-logo-admin">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className="hh-brand-copy">
                <span className="hh-logo-title">
                  Hari<span className="hh-cyan-glow">Hire</span>
                </span>
                <span className="hh-badge-role hh-role-admin">ADMIN CONSOLE</span>
              </div>
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className={`hh-toggle-btn ${isMobileMenuOpen ? "active" : ""}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="hh-toggle-stick"></span>
            <span className="hh-toggle-stick"></span>
          </button>

          {/* Links & Actions Section */}
          <div className={`hh-viewport ${isMobileMenuOpen ? "open" : ""}`}>
            <nav className="hh-nav-cluster">
              <Link
                to="/admin/dashboard"
                className={`hh-item ${isActive("/admin/dashboard") ? "active" : ""}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/admin/users"
                className={`hh-item ${isActive("/admin/users") ? "active" : ""}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Users
              </Link>
              <Link
                to="/admin/recruiters"
                className={`hh-item ${isActive("/admin/recruiters") ? "active" : ""}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Recruiters
              </Link>
              <Link
                to="/admin/jobs"
                className={`hh-item ${isActive("/admin/jobs") ? "active" : ""}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Jobs
              </Link>
              <Link
                to="/admin/companies"
                className={`hh-item ${isActive("/admin/companies") ? "active" : ""}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Companies
              </Link>
              <Link
                to="/admin/applications"
                className={`hh-item ${isActive("/admin/applications") ? "active" : ""}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Applications
              </Link>
              <Link
                to="/admin/ads"
                className={`hh-item ${isActive("/admin/ads") ? "active" : ""}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Ads
              </Link>
              <Link
                to="/admin/analytics"
                className={`hh-item ${isActive("/admin/analytics") ? "active" : ""}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Analytics
              </Link>
            </nav>

            <div className="hh-actions-cluster">
              <button
                type="button"
                onClick={handleLogout}
                className="hh-btn-logout-admin"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // ==================================================
  // 2. RECRUITER / JOB SEEKER / GUEST NAVBAR
  // ==================================================
  return (
    <header className="hh-shell">
      <div className="hh-bar">
        {/* Brand Area */}
        <div className="hh-brand">
          <Link to="/" className="hh-brand-anchor" aria-label="HariHire Home">
            <div className="hh-brand-logo">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="9" fill="url(#hh-logo-grad)" />
                <path d="M10 8.5V23.5" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M22 8.5V23.5" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M10 16H22" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="22" cy="8.5" r="2" fill="#93C5FD" />
                <defs>
                  <linearGradient id="hh-logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#0F172A" />
                    <stop offset="1" stopColor="#1E293B" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="hh-brand-copy">
              <span className="hh-logo-title">
                Hari<span className="hh-blue-glow">Hire</span>
              </span>
              <span className="hh-brand-subtag">TALENT NETWORK</span>
            </div>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          className={`hh-toggle-btn ${isMobileMenuOpen ? "active" : ""}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="hh-toggle-stick"></span>
          <span className="hh-toggle-stick"></span>
        </button>

        {/* Navigation & Actions Viewport */}
        <div className={`hh-viewport ${isMobileMenuOpen ? "open" : ""}`}>
          <nav className="hh-nav-cluster">
            {/* ----------------------------------------------
                PUBLIC GUEST NAVIGATION
            ----------------------------------------------- */}
            {!isLoggedIn ? (
              <>
                <Link
                  to="/"
                  className={`hh-item ${isActive("/") ? "active" : ""}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/jobs"
                  className={`hh-item ${isActive("/jobs") ? "active" : ""}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Jobs
                </Link>
                <Link
                  to="/companies"
                  className={`hh-item ${isActive("/companies") ? "active" : ""}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Companies
                </Link>
              </>
            ) : user && user.role === "RECRUITER" ? (
              /* ----------------------------------------------
                  RECRUITER NAVIGATION
              ----------------------------------------------- */
              <>
                <Link
                  to="/dashboard"
                  className={`hh-item ${isActive("/dashboard") ? "active" : ""}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hh-item-icon">
                    <rect x="3" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="14" width="7" height="7" rx="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  </svg>
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/my-posted-jobs"
                  className={`hh-item ${isActive("/my-posted-jobs") ? "active" : ""}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hh-item-icon">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                  <span>My Posted Jobs</span>
                </Link>

                <Link
                  to="/post-job"
                  className={`hh-item hh-item-action ${isActive("/post-job") ? "active" : ""}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="hh-item-icon">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                  <span>Post Job</span>
                </Link>

                <Link
                  to="/profile"
                  className={`hh-item ${isActive("/profile") ? "active" : ""}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hh-item-icon">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>My Profile</span>
                </Link>
              </>
            ) : (
              /* ----------------------------------------------
                  JOB SEEKER NAVIGATION
              ----------------------------------------------- */
              <>
                <Link
                  to="/dashboard"
                  className={`hh-item ${isActive("/dashboard") ? "active" : ""}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>

                <Link
                  to="/jobs"
                  className={`hh-item ${isActive("/jobs") ? "active" : ""}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Jobs
                </Link>

                <Link
                  to="/resume-builder"
                  className={`hh-item ${isActive("/resume-builder") ? "active" : ""}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hh-item-icon">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                  <span>Resume Builder</span>
                </Link>

                <Link
                  to="/companies"
                  className={`hh-item ${isActive("/companies") ? "active" : ""}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Companies
                </Link>

                <Link
                  to="/notifications"
                  className={`hh-item hh-notification-trigger ${isActive("/notifications") ? "active" : ""}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="hh-notification-label">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hh-item-icon">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    <span>Notifications</span>
                  </span>
                  {notificationCount > 0 && (
                    <span className="hh-pill-badge" title={`${notificationCount} unread notifications`}>
                      {notificationCount > 99 ? "99+" : notificationCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/messages"
                  className={`hh-item ${isActive("/messages") ? "active" : ""}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hh-item-icon">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span>Messages</span>
                </Link>

                <Link
                  to="/profile"
                  className={`hh-item ${isActive("/profile") ? "active" : ""}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Profile
                </Link>
              </>
            )}
          </nav>

          {/* Action Zone (Right) */}
          <div className="hh-actions-cluster">
            {!isLoggedIn ? (
              <div className="hh-guest-suite">
                <Link
                  to="/login"
                  className="hh-btn-login"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="hh-btn-register"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="hh-user-suite">
                {/* User Status Chip */}
                <div className="hh-user-card" title={user?.role || "User"}>
                  <div className="hh-avatar-circle">
                    {user?.name
                      ? user.name.charAt(0).toUpperCase()
                      : user?.role === "RECRUITER"
                      ? "R"
                      : "U"}
                  </div>
                  <div className="hh-user-info">
                    <span className="hh-user-name">
                      {user?.name ? user.name.split(" ")[0] : (user?.role === "RECRUITER" ? "Recruiter" : "Job Seeker")}
                    </span>
                    <span className="hh-user-role-text">
                      {user?.role === "RECRUITER" ? "RECRUITER" : "TALENT"}
                    </span>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="hh-btn-logout"
                  title="Sign out of your account"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;