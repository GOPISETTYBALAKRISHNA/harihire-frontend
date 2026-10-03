import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AdBanner from "../components/AdBanner";
import SEO from "../components/SEO";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();
  const [jobRole, setJobRole] = useState("");
  const [location, setLocation] = useState("");

  // లాగిన్ అయి ఉంటేనే నిర్దిష్ట పేజీకి పంపే ప్రొటెక్టెడ్ నావిగేషన్
  const handleProtectedNavigation = (path) => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
      alert("Please Login First");
      navigate("/login");
      return;
    }

    navigate(path);
  };

  // సెర్చ్ హ్యాండ్లర్
  const handleSearch = () => {
    if (jobRole || location) {
      navigate(`/jobs?role=${encodeURIComponent(jobRole)}&location=${encodeURIComponent(location)}`);
    } else {
      navigate("/jobs");
    }
  };

  return (
    <>
      <SEO
        title="HariHire - Find Jobs, Hire Talent & Build Your Career"
        description="Find the latest IT, Non-IT, Banking, Government and other job opportunities on HariHire."
        keywords="HariHire, Jobs, Software Jobs, Freshers Jobs, Government Jobs"
      />

      <div className="home-container">
        <AdBanner />

        {/* HERO SECTION */}
        <section className="hero-section">
          <div className="hero-content">
            <span className="hero-badge">
              🚀 India's Growing Career Platform
            </span>

            <h1 className="hero-title">
              Find Your Dream Job With <span className="brand-highlight">HariHire</span>
            </h1>

            <p className="hero-description">
              Explore thousands of IT, Non-IT, Banking, Government, Remote and Fresher opportunities from trusted companies.
            </p>

            <div className="search-box">
              <div className="input-group">
                <span className="input-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Job Role, Skills or Company"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                />
              </div>

              <div className="input-group">
                <span className="input-icon">📍</span>
                <input
                  type="text"
                  placeholder="Location or 'Remote'"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <button className="search-btn" onClick={handleSearch}>
                Search Jobs
              </button>
            </div>

            <div className="hero-buttons">
              <button
                className="btn primary-btn"
                onClick={() => navigate("/jobs")}
              >
                Browse Jobs
              </button>

              <button
                className="btn secondary-btn"
                onClick={() => handleProtectedNavigation("/resume-builder")} 
              >
                📄 Resume Builder
              </button>
            </div>
          </div>
        </section>

        <AdBanner />

        {/* STATS SECTION */}
        <section className="stats-section">
          <div className="stat-card">
            <h2>10K+</h2>
            <p>Jobs Available</p>
          </div>

          <div className="stat-card">
            <h2>500+</h2>
            <p>Companies</p>
          </div>

          <div className="stat-card">
            <h2>5K+</h2>
            <p>Job Seekers</p>
          </div>

          <div className="stat-card">
            <h2>100%</h2>
            <p>Free Registration</p>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="features-section">
          <h2 className="section-title">Why Choose HariHire?</h2>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">💼</div>
              <h3>Latest Jobs</h3>
              <p>Daily updated IT, Non-IT, and Fresher job listings tailored for you.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📄</div>
              <h3>Resume Builder</h3>
              <p>Create modern, recruiter-ready professional resumes in minutes.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <h3>Job Alerts</h3>
              <p>Get real-time updates and notifications on the latest opportunities.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🏢</div>
              <h3>Top Companies</h3>
              <p>Apply directly to verified and trusted companies hiring now.</p>
            </div>
          </div>
        </section>

        <AdBanner />
      </div>
    </>
  );
}

export default Home;