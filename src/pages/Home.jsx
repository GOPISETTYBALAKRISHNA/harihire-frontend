import { useNavigate } from "react-router-dom";
import AdBanner from "../components/AdBanner";
import SEO from "../components/SEO";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      {/* =========================
          SEO
      ========================= */}

      <SEO
        title="HariHire - Find Jobs, Hire Talent & Build Your Career"
        description="Find the latest IT, Non-IT, Banking, Government and other job opportunities on HariHire. Search jobs, explore career opportunities and apply online."
        keywords="HariHire, jobs, job portal, latest jobs, IT jobs, software jobs, banking jobs, government jobs, non IT jobs, fresher jobs, job search, recruitment"
      />

      <div
        style={{
          textAlign: "center",
          padding: "30px 20px",
          minHeight: "100vh",
          boxSizing: "border-box",
        }}
      >
        {/* =========================
            TOP ADVERTISEMENT
        ========================= */}

        <AdBanner />

        {/* =========================
            Welcome Section
        ========================= */}

        <h1
          style={{
            color: "#1976d2",
            fontSize: "45px",
            marginTop: "35px",
            marginBottom: "10px",
          }}
        >
          Welcome to HariHire
        </h1>

        <p
          style={{
            fontSize: "22px",
            color: "gray",
            marginBottom: "0",
          }}
        >
          Find Your Dream Job
        </p>

        {/* =========================
            Job Search
        ========================= */}

        <div
          style={{
            marginTop: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <input
            type="text"
            placeholder="🔍 Job Role"
            style={{
              width: "250px",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid gray",
              boxSizing: "border-box",
              fontSize: "15px",
            }}
          />

          <input
            type="text"
            placeholder="📍 Location"
            style={{
              width: "250px",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid gray",
              boxSizing: "border-box",
              fontSize: "15px",
            }}
          />

          <button
            onClick={() => navigate("/jobs")}
            style={{
              background: "#1976d2",
              color: "white",
              border: "none",
              padding: "12px 25px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            🔍 Search
          </button>
        </div>

        {/* =========================
            MIDDLE ADVERTISEMENT
        ========================= */}

        <div
          style={{
            marginTop: "50px",
          }}
        >
          <AdBanner />
        </div>

        {/* =========================
            Find Jobs Button
        ========================= */}

        <div
          style={{
            marginTop: "40px",
          }}
        >
          <button
            onClick={() => navigate("/jobs")}
            style={{
              background: "#1976d2",
              color: "white",
              border: "none",
              padding: "14px 30px",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            💼 Browse Jobs
          </button>
        </div>

        {/* =========================
            BOTTOM ADVERTISEMENT
        ========================= */}

        <div
          style={{
            marginTop: "50px",
          }}
        >
          <AdBanner />
        </div>
      </div>
    </>
  );
}

export default Home;