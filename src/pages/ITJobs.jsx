import { useNavigate } from "react-router-dom";

function ITJobs() {
  const navigate = useNavigate();

  // =====================================================
  // IT JOB CATEGORIES
  // =====================================================

  const categories = [
    {
      name: "Web Developer",
      icon: "🌐",
      path: "/jobs/software/it/web-developer",
    },
    {
      name: "Java Developer",
      icon: "☕",
      path: "/jobs/software/it/java-developer",
    },
    {
      name: "Python Developer",
      icon: "🐍",
      path: "/jobs/software/it/python-developer",
    },
    {
      name: "Full Stack Developer",
      icon: "💻",
      path: "/jobs/software/it/full-stack-developer",
    },
    {
      name: "Frontend Developer",
      icon: "🎨",
      path: "/jobs/software/it/frontend-developer",
    },
    {
      name: "Backend Developer",
      icon: "⚙️",
      path: "/jobs/software/it/backend-developer",
    },
    {
      name: "Mobile App Developer",
      icon: "📱",
      path: "/jobs/software/it/mobile-app-developer",
    },
    {
      name: "Data Analyst",
      icon: "📊",
      path: "/jobs/software/it/data-analyst",
    },
    {
      name: "Data Science / AI",
      icon: "🤖",
      path: "/jobs/software/it/data-science-ai",
    },
    {
      name: "Cloud / DevOps",
      icon: "☁️",
      path: "/jobs/software/it/cloud-devops",
    },
    {
      name: "Cyber Security",
      icon: "🔐",
      path: "/jobs/software/it/cyber-security",
    },
    {
      name: "Testing / QA",
      icon: "🧪",
      path: "/jobs/software/it/testing-qa",
    },
    {
      name: "Database / SQL",
      icon: "🗄️",
      path: "/jobs/software/it/database-sql",
    },
    {
      name: "UI/UX Design",
      icon: "🎨",
      path: "/jobs/software/it/ui-ux-design",
    },
  ];

  // =====================================================
  // NAVIGATION
  // =====================================================

  const handleCategoryClick = (path) => {
    navigate(path);
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div style={styles.page}>

      {/* =================================================
          HEADER
      ================================================= */}

      <div style={styles.header}>

        <button
          type="button"
          onClick={() => navigate("/jobs/software")}
          style={styles.backButton}
        >
          ← Back to Software Jobs
        </button>

        <h1 style={styles.title}>
          💻 IT Jobs
        </h1>

        <p style={styles.subtitle}>
          Choose a technology category and explore
          available job opportunities.
        </p>

      </div>

      {/* =================================================
          CATEGORY TITLE
      ================================================= */}

      <h2 style={styles.sectionTitle}>
        IT Job Categories
      </h2>

      {/* =================================================
          CATEGORY CARDS
      ================================================= */}

      <div style={styles.grid}>

        {categories.map((category) => (

          <div
            key={category.name}
            style={styles.card}
            onClick={() =>
              handleCategoryClick(category.path)
            }
          >

            {/* ICON */}

            <div style={styles.icon}>
              {category.icon}
            </div>

            {/* CATEGORY NAME */}

            <h3 style={styles.cardTitle}>
              {category.name}
            </h3>

            {/* VIEW JOBS BUTTON */}

            <button
              type="button"
              style={styles.exploreButton}
              onClick={(event) => {
                event.stopPropagation();
                handleCategoryClick(category.path);
              }}
            >
              View Jobs →
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}


/* =====================================================
   STYLES
===================================================== */

const styles = {

  page: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fb",
    padding: "35px 5%",
    boxSizing: "border-box",
  },

  /* ===================================================
     HEADER
  =================================================== */

  header: {
    textAlign: "center",
    marginBottom: "40px",
  },

  backButton: {
    backgroundColor: "#ffffff",
    color: "#1976d2",
    border: "1px solid #1976d2",
    padding: "10px 18px",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "25px",
  },

  title: {
    margin: 0,
    fontSize: "36px",
    fontWeight: "700",
    color: "#1f2937",
  },

  subtitle: {
    marginTop: "10px",
    color: "#6b7280",
    fontSize: "17px",
    lineHeight: "1.6",
  },

  /* ===================================================
     SECTION TITLE
  =================================================== */

  sectionTitle: {
    textAlign: "center",
    color: "#1f2937",
    marginBottom: "30px",
    fontSize: "25px",
  },

  /* ===================================================
     GRID
  =================================================== */

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "22px",
    maxWidth: "1200px",
    margin: "0 auto",
  },

  /* ===================================================
     CARD
  =================================================== */

  card: {
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    padding: "28px 20px",
    textAlign: "center",
    cursor: "pointer",
    border: "1px solid #eeeeee",
    boxShadow:
      "0 3px 12px rgba(0,0,0,0.08)",
    transition:
      "transform 0.2s ease, box-shadow 0.2s ease",
  },

  /* ===================================================
     ICON
  =================================================== */

  icon: {
    fontSize: "45px",
    marginBottom: "12px",
  },

  /* ===================================================
     CARD TITLE
  =================================================== */

  cardTitle: {
    margin: "8px 0",
    fontSize: "19px",
    color: "#1f2937",
    minHeight: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: "1.4",
  },

  /* ===================================================
     BUTTON
  =================================================== */

  exploreButton: {
    marginTop: "12px",
    backgroundColor: "#1976d2",
    color: "#ffffff",
    border: "none",
    padding: "9px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },
};

export default ITJobs;