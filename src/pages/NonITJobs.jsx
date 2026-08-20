import { useNavigate } from "react-router-dom";

function NonITJobs() {
  const navigate = useNavigate();

  // =====================================================
  // NON-IT JOB CATEGORIES
  // =====================================================

  const categories = [
    {
      name: "BPO / Customer Support",
      icon: "🎧",
      path: "/jobs/software/non-it/bpo-customer-support",
    },
    {
      name: "Data Entry",
      icon: "⌨️",
      path: "/jobs/software/non-it/data-entry",
    },
    {
      name: "Back Office",
      icon: "🗂️",
      path: "/jobs/software/non-it/back-office",
    },
    {
      name: "HR / Recruitment",
      icon: "👥",
      path: "/jobs/software/non-it/hr-recruitment",
    },
    {
      name: "Sales",
      icon: "📈",
      path: "/jobs/software/non-it/sales",
    },
    {
      name: "Marketing",
      icon: "📢",
      path: "/jobs/software/non-it/marketing",
    },
    {
      name: "Operations",
      icon: "⚙️",
      path: "/jobs/software/non-it/operations",
    },
    {
      name: "Finance & Accounting",
      icon: "💰",
      path: "/jobs/software/non-it/finance-accounting",
    },
    {
      name: "Banking",
      icon: "🏦",
      path: "/jobs/software/non-it/banking",
    },
    {
      name: "Healthcare",
      icon: "🏥",
      path: "/jobs/software/non-it/healthcare",
    },
    {
      name: "Teaching / Education",
      icon: "🎓",
      path: "/jobs/software/non-it/teaching-education",
    },
    {
      name: "Logistics",
      icon: "🚚",
      path: "/jobs/software/non-it/logistics",
    },
    {
      name: "Retail",
      icon: "🛍️",
      path: "/jobs/software/non-it/retail",
    },
    {
      name: "Field Executive",
      icon: "🚶",
      path: "/jobs/software/non-it/field-executive",
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
          💼 NON-IT Jobs
        </h1>

        <p style={styles.subtitle}>
          Explore non-IT job opportunities and choose
          a category that matches your skills.
        </p>

      </div>

      {/* =================================================
          CATEGORY TITLE
      ================================================= */}

      <h2 style={styles.sectionTitle}>
        NON-IT Job Categories
      </h2>

      {/* =================================================
          CATEGORY GRID
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

            <div style={styles.icon}>
              {category.icon}
            </div>

            <h3 style={styles.cardTitle}>
              {category.name}
            </h3>

            <button
              type="button"
              style={styles.exploreButton}
              onClick={(event) => {
                event.stopPropagation();

                handleCategoryClick(
                  category.path
                );
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

  sectionTitle: {
    textAlign: "center",
    color: "#1f2937",
    marginBottom: "30px",
    fontSize: "25px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "22px",
    maxWidth: "1200px",
    margin: "0 auto",
  },

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

  icon: {
    fontSize: "45px",
    marginBottom: "12px",
  },

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

export default NonITJobs;