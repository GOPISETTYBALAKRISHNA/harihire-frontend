import { useNavigate } from "react-router-dom";

function SoftwareJobs() {
  const navigate = useNavigate();

  const softwareCategories = [
    {
      name: "IT Jobs",
      icon: "💻",
      description:
        "Software development, programming, testing, cloud, data and technology jobs.",
      path: "/jobs/software/it",
    },
    {
      name: "Non-IT Jobs",
      icon: "🧑‍💼",
      description:
        "Technical support, operations, business and other non-development software industry jobs.",
      path: "/jobs/software/non-it",
    },
  ];

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <button
          onClick={() => navigate("/jobs")}
          style={styles.backButton}
        >
          ← Back to Job Categories
        </button>

        <h1 style={styles.title}>
          💻 Software Jobs
        </h1>

        <p style={styles.subtitle}>
          Explore IT and Non-IT opportunities in the software industry.
        </p>
      </div>

      {/* CATEGORY TITLE */}
      <h2 style={styles.sectionTitle}>
        Choose Your Job Type
      </h2>

      {/* CARDS */}
      <div style={styles.grid}>
        {softwareCategories.map((category) => (
          <div
            key={category.name}
            style={styles.card}
            onClick={() => navigate(category.path)}
          >
            <div style={styles.icon}>
              {category.icon}
            </div>

            <h2 style={styles.cardTitle}>
              {category.name}
            </h2>

            <p style={styles.description}>
              {category.description}
            </p>

            <button
              style={styles.exploreButton}
              onClick={(e) => {
                e.stopPropagation();
                navigate(category.path);
              }}
            >
              Explore {category.name} →
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
    marginBottom: "45px",
  },

  backButton: {
    display: "block",
    margin: "0 auto 25px",
    backgroundColor: "#ffffff",
    color: "#1976d2",
    border: "1px solid #1976d2",
    padding: "10px 18px",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
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
  },

  sectionTitle: {
    textAlign: "center",
    color: "#1f2937",
    marginBottom: "30px",
  },

  grid: {
    maxWidth: "900px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "30px",
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "35px 25px",
    textAlign: "center",
    cursor: "pointer",
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.08)",
    border: "1px solid #eeeeee",
    transition: "transform 0.2s ease",
  },

  icon: {
    fontSize: "55px",
    marginBottom: "15px",
  },

  cardTitle: {
    margin: "10px 0",
    fontSize: "25px",
    color: "#1f2937",
  },

  description: {
    color: "#6b7280",
    fontSize: "15px",
    lineHeight: "1.6",
    minHeight: "70px",
  },

  exploreButton: {
    marginTop: "18px",
    backgroundColor: "#1976d2",
    color: "#ffffff",
    border: "none",
    padding: "11px 20px",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
  },
};

export default SoftwareJobs;