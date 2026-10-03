import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../axiosConfig";
import "../styles/Dashboard.css";

import AdBanner from "../components/AdBanner";
import ImageAdManager from "../components/ImageAdManager";

function Dashboard() {

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const isLoggedIn =
    localStorage.getItem("isLoggedIn") === "true";

  const isAdminLoggedIn =
    localStorage.getItem("adminLoggedIn") === "true";


  // =====================================================
  // DASHBOARD STATS
  // =====================================================

  const [stats, setStats] = useState({
    jobs: 0,
    applications: 0,
    selected: 0,
    interviews: 0,
    rejected: 0,
  });


  const [applications, setApplications] = useState([]);


  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  useEffect(() => {

    if (user) {
      loadDashboard();
    }

  }, []);


  const loadDashboard = async () => {

    try {

      const statsResponse =
        await api.get(
          `/dashboard/${user.id}`
        );

      setStats(statsResponse.data);


      const appResponse =
        await api.get(
          `/applications/user/${user.id}`
        );

      setApplications(
        appResponse.data
      );

    } catch (error) {

      console.log(error);

    }

  };


  // =====================================================
  // IF USER NOT FOUND
  // =====================================================

  if (!user) {

    return (

      <div className="dashboard-login-gate">

        <h2>
          Please Login First
        </h2>

        <button
          type="button"
          className="dashboard-login-gate-btn"
          onClick={() =>
            navigate("/login")
          }
        >
          Login
        </button>

      </div>

    );

  }


  const handleQuickNavigate = (path) => {
    navigate(path);
  };

  const handleQuickKeyDown = (event, path) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigate(path);
    }
  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="dashboard-container">

      {/* =================================================
          IMAGE AD

          Dashboard lo Image Ad matrame popup ga
          display avutundi.

          Admin:
          ❌ No Image Ad

          Logged out:
          ❌ No Image Ad

          Normal User / Recruiter:
          ✅ Image Ad
      ================================================= */}

      {isLoggedIn && !isAdminLoggedIn && (

        <ImageAdManager
          isLoggedIn={isLoggedIn}
          isAdminLoggedIn={isAdminLoggedIn}
          trigger={true}
        />

      )}

      <div className="dashboard-shell">

      {/* =================================================
          WELCOME
      ================================================= */}
      <section className="dashboard-hero" aria-label="Welcome">
        <div className="dashboard-hero-copy">
          <p className="dashboard-kicker">HariHire workspace</p>
          <h1>
            Welcome Back, {user.fullName} 👋
          </h1>

          <p className="dashboard-hero-subtitle">
            Find your dream job with HariHire
          </p>
        </div>

        <div className="hero-buttons">
          <button
            type="button"
            className="primary-btn"
            onClick={() => navigate("/jobs")}
          >
            Search Jobs
          </button>

          <button
            type="button"
            className="secondary-btn"
            onClick={() => navigate("/resume-builder")}
          >
            Resume Builder
          </button>
        </div>
      </section>


      {/* =================================================
          BANNER AD

          Dashboard lo second ad type.

          VideoAd ikkada intentionally ledu.
      ================================================= */}

      <div className="dashboard-ad-slot">
        <AdBanner />
      </div>


      {/* =================================================
          DASHBOARD STATS
      ================================================= */}

      <section className="dashboard-section" aria-label="Dashboard statistics">
        <div className="dashboard-section-head">
          <h2>Overview</h2>
          <p>Your current job search at a glance</p>
        </div>

        <div className="stats-grid">

          <Card
            title="💼 Jobs"
            value={stats.jobs}
            accent="jobs"
          />

          <Card
            title="📄 Applied"
            value={stats.applications}
            accent="applied"
          />

          <Card
            title="✅ Selected"
            value={stats.selected}
            accent="selected"
          />

          <Card
            title="📅 Interviews"
            value={stats.interviews}
            accent="interviews"
          />

          <Card
            title="❌ Rejected"
            value={stats.rejected}
            accent="rejected"
          />

        </div>
      </section>

      <div className="dashboard-split">

        <section className="quick-actions" aria-label="Quick actions">

          <div className="dashboard-section-head">
            <h2>⚡ Quick Actions</h2>
            <p>Jump to the pages you use most</p>
          </div>

          <div className="quick-grid">

            <div
              className="quick-card"
              role="button"
              tabIndex={0}
              onClick={() =>
                handleQuickNavigate("/companies")
              }
              onKeyDown={(event) =>
                handleQuickKeyDown(event, "/companies")
              }
            >
              <span className="quick-card-icon" aria-hidden="true">🏢</span>
              <span className="quick-card-label">Companies</span>
              <span className="quick-card-hint">Browse hiring companies</span>
            </div>


            <div
              className="quick-card"
              role="button"
              tabIndex={0}
              onClick={() =>
                handleQuickNavigate("/my-applications")
              }
              onKeyDown={(event) =>
                handleQuickKeyDown(event, "/my-applications")
              }
            >
              <span className="quick-card-icon" aria-hidden="true">📄</span>
              <span className="quick-card-label">My Applications</span>
              <span className="quick-card-hint">Track application status</span>
            </div>

            <div
              className="quick-card"
              role="button"
              tabIndex={0}
              onClick={() =>
                handleQuickNavigate("/saved-jobs")
              }
              onKeyDown={(event) =>
                handleQuickKeyDown(event, "/saved-jobs")
              }
            >
              <span className="quick-card-icon" aria-hidden="true">❤️</span>
              <span className="quick-card-label">Saved Jobs</span>
              <span className="quick-card-hint">Revisit roles you saved</span>
            </div>

            <div
              className="quick-card"
              role="button"
              tabIndex={0}
              onClick={() =>
                handleQuickNavigate("/reviews")
              }
              onKeyDown={(event) =>
                handleQuickKeyDown(event, "/reviews")
              }
            >
              <span className="quick-card-icon" aria-hidden="true">⭐</span>
              <span className="quick-card-label">Reviews</span>
              <span className="quick-card-hint">Read and share feedback</span>
            </div>
          </div>

        </section>


        {/* =================================================
            MY PROFILE
        ================================================= */}

        <section className="profile-section" aria-label="My profile">

          <div className="dashboard-section-head">
            <h2>👤 My Profile</h2>
            <p>Details from your HariHire account</p>
          </div>


          <div className="profile-details">

            <div className="profile-row">
              <span className="profile-label">Name</span>
              <span className="profile-value">{user.fullName}</span>
            </div>


            <div className="profile-row">
              <span className="profile-label">Email</span>
              <span className="profile-value">{user.email}</span>
            </div>


            <div className="profile-row">
              <span className="profile-label">Phone</span>
              <span className="profile-value">
                {user.phone ||
                  "Not Updated"}
              </span>
            </div>


            <div className="profile-row">
              <span className="profile-label">Education</span>
              <span className="profile-value">
                {user.education ||
                  "Not Updated"}
              </span>
            </div>


            <div className="profile-row">
              <span className="profile-label">Skills</span>
              <span className="profile-value">
                {user.skills ||
                  "Not Updated"}
              </span>
            </div>


            <div className="profile-row">
              <span className="profile-label">Experience</span>
              <span className="profile-value">
                {user.experience ||
                  "Fresher"}
              </span>
            </div>


            <div className="profile-row">
              <span className="profile-label">City</span>
              <span className="profile-value">
                {user.city ||
                  "Not Updated"}
              </span>
            </div>


            {/* =================================================
                EDIT PROFILE
            ================================================= */}

            <button
              type="button"
              className="edit-profile-btn"
              onClick={() =>
                navigate("/profile")
              }
            >
              Edit Profile
            </button>

          </div>

        </section>

      </div>




      {/* =================================================
          BOTTOM BANNER AD

          Existing Banner functionality maintained.
      ================================================= */}

      <div className="dashboard-bottom">
      {/* =================================================
    HELP CENTER
================================================= */}

        <section className="dashboard-help-section" aria-label="Help center">

          <div className="help-content">

            <div className="help-text">
              <p className="dashboard-kicker dashboard-kicker-on-dark">Support</p>
              <h2>🆘 Need Help?</h2>

              <p>
                Get support, FAQs, Privacy Policy,
                Terms & Conditions, Contact Information
                and more from HariHire Help Center.
              </p>

              <button
                type="button"
                className="help-btn"
                onClick={() => navigate("/help")}
              >
                Open Help Center
              </button>
            </div>

            <div className="help-icon" aria-hidden="true">
              💡
            </div>

          </div>

        </section>

        <div className="dashboard-ad-slot">
          <AdBanner />
        </div>

      </div>

      </div>

    </div>

  );
}


// =====================================================
// STAT CARD
// =====================================================

function Card({
  title,
  value,
  accent,
}) {

  return (

    <div className={`dashboard-card dashboard-card-${accent || "default"}`}>
      <h3>
        {title}
      </h3>


      <p className="dashboard-card-value">
        {value}
      </p>

    </div>

  );

}


export default Dashboard;
