import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig";

function GovernmentJobs() {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] =
    useState("ALL");

  const [selectedSubCategory, setSelectedSubCategory] =
    useState("ALL");

  // =====================================================
  // GOVERNMENT CATEGORY DATA
  // =====================================================

  const governmentCategories = {
    "Central Government": [
      "UPSC",
      "SSC",
      "Railway",
      "Defence",
      "Postal Jobs",
      "Central Police",
      "Other Central Government"
    ],

    "State Government": [
      "State APPSC",
      "Police",
      "Revenue Department",
      "Teaching Jobs",
      "Municipal Jobs",
      "State Health Department",
      "Other State Government"
    ]
  };

  // =====================================================
  // NORMALIZE TEXT
  // =====================================================

  const normalizeText = (value) => {
    return String(value || "")
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase();
  };

  // =====================================================
  // LOAD GOVERNMENT JOBS
  // =====================================================

  useEffect(() => {
    loadGovernmentJobs();
  }, []);

  const loadGovernmentJobs = async () => {
    try {
      setLoading(true);

      // -------------------------------------------------
      // IMPORTANT:
      // Directly request only Government jobs
      // from backend.
      // -------------------------------------------------

      const response = await api.get(
        "/jobs/active/category",
        {
          params: {
            category: "Government"
          }
        }
      );

      console.log(
        "GOVERNMENT JOBS RESPONSE:",
        response.data
      );

      if (Array.isArray(response.data)) {
        const governmentJobs = response.data.filter(
          (job) => {
            const category = normalizeText(
              job.category
            );

            return (
              category === "government" ||
              category.includes("government")
            );
          }
        );

        console.log(
          "FILTERED GOVERNMENT JOBS:",
          governmentJobs
        );

        setJobs(governmentJobs);
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.error(
        "GOVERNMENT JOBS ERROR:",
        error
      );

      if (error.response) {
        console.error(
          "BACKEND STATUS:",
          error.response.status
        );

        console.error(
          "BACKEND RESPONSE:",
          error.response.data
        );
      }

      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // MAIN CATEGORY CHANGE
  // =====================================================

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedSubCategory("ALL");
  };

  // =====================================================
  // GET JOB ROLES
  // =====================================================

  const getSubCategories = () => {
    if (selectedCategory === "ALL") {
      return [];
    }

    return (
      governmentCategories[selectedCategory] || []
    );
  };

  // =====================================================
  // FILTER JOBS
  // =====================================================

  const filteredJobs = jobs.filter((job) => {
    const jobSubCategory = normalizeText(
      job.subCategory
    );

    const jobRole = normalizeText(
      job.jobCategory
    );

    // -------------------------------------------------
    // ALL GOVERNMENT JOBS
    // -------------------------------------------------

    if (selectedCategory === "ALL") {
      return true;
    }

    // -------------------------------------------------
    // CENTRAL / STATE
    // -------------------------------------------------

    if (
      jobSubCategory !==
      normalizeText(selectedCategory)
    ) {
      return false;
    }

    // -------------------------------------------------
    // ALL JOB ROLES
    // -------------------------------------------------

    if (selectedSubCategory === "ALL") {
      return true;
    }

    // -------------------------------------------------
    // SELECTED JOB ROLE
    // -------------------------------------------------

    return (
      jobRole ===
      normalizeText(selectedSubCategory)
    );
  });

  // =====================================================
  // OPEN JOB DETAILS
  // =====================================================

  const openJob = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingCard}>
          <div style={styles.loadingIcon}>
            🏛️
          </div>

          <h2>
            Loading Government Jobs...
          </h2>

          <p>
            Please wait while we fetch the latest
            government job opportunities.
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div style={styles.page}>

      {/* =================================================
          HEADER
      ================================================= */}

      <div style={styles.header}>

        <button
          type="button"
          style={styles.backButton}
          onClick={() => navigate("/jobs")}
        >
          ← Back to Jobs
        </button>

        <div style={styles.headerIcon}>
          🏛️
        </div>

        <h1 style={styles.title}>
          Government Jobs
        </h1>

        <p style={styles.subtitle}>
          Explore Central Government and State
          Government job opportunities.
        </p>

      </div>

      {/* =================================================
          MAIN CATEGORY CARDS
      ================================================= */}

      <div style={styles.mainCategoryGrid}>

        {/* =================================================
            CENTRAL GOVERNMENT
        ================================================= */}

        <div
          style={{
            ...styles.mainCategoryCard,
            ...(selectedCategory ===
            "Central Government"
              ? styles.activeCategoryCard
              : {})
          }}
          onClick={() =>
            handleCategoryChange(
              "Central Government"
            )
          }
        >

          <div style={styles.categoryIcon}>
            🇮🇳
          </div>

          <h2 style={styles.categoryTitle}>
            Central Government
          </h2>

          <p style={styles.categoryDescription}>
            UPSC, SSC CGL, SSC CHSL, Railway,
            Defence, Postal and other central
            government jobs.
          </p>

          <button
            type="button"
            style={styles.categoryButton}
            onClick={(event) => {
              event.stopPropagation();

              handleCategoryChange(
                "Central Government"
              );
            }}
          >
            View Central Jobs →
          </button>

        </div>

        {/* =================================================
            STATE GOVERNMENT
        ================================================= */}

        <div
          style={{
            ...styles.mainCategoryCard,
            ...(selectedCategory ===
            "State Government"
              ? styles.activeCategoryCard
              : {})
          }}
          onClick={() =>
            handleCategoryChange(
              "State Government"
            )
          }
        >

          <div style={styles.categoryIcon}>
            🏛️
          </div>

          <h2 style={styles.categoryTitle}>
            State Government
          </h2>

          <p style={styles.categoryDescription}>
            State PSC, Police, Revenue, Teaching,
            Health, Municipal and other state
            government jobs.
          </p>

          <button
            type="button"
            style={styles.categoryButton}
            onClick={(event) => {
              event.stopPropagation();

              handleCategoryChange(
                "State Government"
              );
            }}
          >
            View State Jobs →
          </button>

        </div>

      </div>

      {/* =================================================
          ALL GOVERNMENT JOBS
      ================================================= */}

      <div style={styles.allJobsArea}>

        <button
          type="button"
          style={
            selectedCategory === "ALL"
              ? styles.allJobsActiveButton
              : styles.allJobsButton
          }
          onClick={() => {
            setSelectedCategory("ALL");
            setSelectedSubCategory("ALL");
          }}
        >
          📋 All Government Jobs
        </button>

      </div>

      {/* =================================================
          JOB ROLE SECTION
      ================================================= */}

      {selectedCategory !== "ALL" && (
        <div style={styles.subCategorySection}>

          <h2 style={styles.subCategoryTitle}>
            {selectedCategory} Jobs
          </h2>

          <div style={styles.subCategoryGrid}>

            {/* ALL */}

            <button
              type="button"
              style={
                selectedSubCategory === "ALL"
                  ? styles.subActiveButton
                  : styles.subButton
              }
              onClick={() =>
                setSelectedSubCategory("ALL")
              }
            >
              All
            </button>

            {/* JOB ROLES */}

            {getSubCategories().map(
              (subCategory) => (
                <button
                  type="button"
                  key={subCategory}
                  style={
                    selectedSubCategory ===
                    subCategory
                      ? styles.subActiveButton
                      : styles.subButton
                  }
                  onClick={() =>
                    setSelectedSubCategory(
                      subCategory
                    )
                  }
                >
                  {subCategory}
                </button>
              )
            )}

          </div>

        </div>
      )}

      {/* =================================================
          RESULT HEADER
      ================================================= */}

      <div style={styles.resultHeader}>

        <h2>
          Government Jobs
        </h2>

        <span style={styles.jobCount}>
          {filteredJobs.length} Jobs Found
        </span>

      </div>

      {/* =================================================
          JOB LIST
      ================================================= */}

      {filteredJobs.length === 0 ? (

        <div style={styles.emptyCard}>

          <div style={styles.emptyIcon}>
            🏛️
          </div>

          <h2>
            No Government Jobs Found
          </h2>

          <p>
            No jobs are available for the selected
            government category right now.
          </p>

          <button
            type="button"
            style={styles.refreshButton}
            onClick={loadGovernmentJobs}
          >
            🔄 Refresh Jobs
          </button>

        </div>

      ) : (

        <div style={styles.jobsGrid}>

          {filteredJobs.map((job) => (

            <div
              key={job.id}
              style={styles.jobCard}
            >

              {/* =================================================
                  JOB HEADER
              ================================================= */}

              <div style={styles.jobHeader}>

                <div style={styles.jobIcon}>
                  🏛️
                </div>

                <div>

                  <h2 style={styles.jobTitle}>
                    {job.jobTitle}
                  </h2>

                  <p style={styles.companyName}>
                    {job.companyName}
                  </p>

                </div>

              </div>

              {/* =================================================
                  JOB DETAILS
              ================================================= */}

              <div style={styles.details}>

                <div style={styles.detailItem}>
                  <span>📍</span>
                  <span>
                    {job.location || "India"}
                  </span>
                </div>

                <div style={styles.detailItem}>
                  <span>💼</span>
                  <span>
                    {job.jobType || "Government"}
                  </span>
                </div>

                <div style={styles.detailItem}>
                  <span>🎓</span>
                  <span>
                    {job.qualification ||
                      "Any Qualification"}
                  </span>
                </div>

                <div style={styles.detailItem}>
                  <span>🧑‍💼</span>
                  <span>
                    {job.experience ||
                      "Not Specified"}
                  </span>
                </div>

              </div>

              {/* =================================================
                  CATEGORY TAGS
              ================================================= */}

              <div style={styles.tags}>

                <span style={styles.categoryTag}>
                  Government
                </span>

                {job.subCategory && (
                  <span
                    style={styles.subCategoryTag}
                  >
                    {job.subCategory}
                  </span>
                )}

                {job.jobCategory && (
                  <span style={styles.roleTag}>
                    {job.jobCategory}
                  </span>
                )}

              </div>

              {/* =================================================
                  SALARY
              ================================================= */}

              {job.salary !== undefined &&
                job.salary !== null &&
                Number(job.salary) > 0 && (

                  <div style={styles.salary}>
                    💰 Salary: ₹
                    {Number(
                      job.salary
                    ).toLocaleString("en-IN")}
                  </div>

                )}

              {/* =================================================
                  DESCRIPTION
              ================================================= */}

              {job.description && (

                <p style={styles.description}>

                  {job.description.length > 180
                    ? job.description.substring(
                        0,
                        180
                      ) + "..."
                    : job.description}

                </p>

              )}

              {/* =================================================
                  VIEW DETAILS
              ================================================= */}

              <button
                type="button"
                style={styles.viewButton}
                onClick={() =>
                  openJob(job.id)
                }
              >
                View Job Details →
              </button>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = {

  page: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fb",
    padding: "30px 5%",
    boxSizing: "border-box"
  },

  loadingPage: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px"
  },

  loadingCard: {
    backgroundColor: "#ffffff",
    padding: "45px",
    borderRadius: "14px",
    textAlign: "center",
    boxShadow:
      "0 4px 18px rgba(0,0,0,0.08)"
  },

  loadingIcon: {
    fontSize: "50px",
    marginBottom: "15px"
  },

  header: {
    textAlign: "center",
    marginBottom: "35px",
    position: "relative"
  },

  backButton: {
    position: "absolute",
    left: 0,
    top: 0,
    padding: "10px 16px",
    border: "none",
    borderRadius: "7px",
    backgroundColor: "#ffffff",
    color: "#374151",
    cursor: "pointer",
    fontWeight: "600",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.08)"
  },

  headerIcon: {
    fontSize: "52px",
    marginBottom: "8px"
  },

  title: {
    margin: 0,
    color: "#1f2937",
    fontSize: "36px",
    fontWeight: "700"
  },

  subtitle: {
    color: "#6b7280",
    fontSize: "17px",
    marginTop: "10px"
  },

  mainCategoryGrid: {
    maxWidth: "950px",
    margin: "0 auto 25px",
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "25px"
  },

  mainCategoryCard: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "30px",
    textAlign: "center",
    cursor: "pointer",
    border: "2px solid transparent",
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.08)",
    transition: "all 0.25s ease"
  },

  activeCategoryCard: {
    border: "2px solid #1976d2",
    boxShadow:
      "0 5px 20px rgba(25,118,210,0.18)"
  },

  categoryIcon: {
    fontSize: "50px",
    marginBottom: "10px"
  },

  categoryTitle: {
    margin: "8px 0",
    color: "#1f2937",
    fontSize: "24px"
  },

  categoryDescription: {
    color: "#6b7280",
    fontSize: "14px",
    lineHeight: "1.6",
    minHeight: "48px"
  },

  categoryButton: {
    marginTop: "15px",
    padding: "10px 18px",
    backgroundColor: "#1976d2",
    color: "#ffffff",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600"
  },

  allJobsArea: {
    textAlign: "center",
    marginBottom: "25px"
  },

  allJobsButton: {
    padding: "11px 22px",
    border: "1px solid #1976d2",
    backgroundColor: "#ffffff",
    color: "#1976d2",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600"
  },

  allJobsActiveButton: {
    padding: "11px 22px",
    border: "none",
    backgroundColor: "#1976d2",
    color: "#ffffff",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600"
  },

  subCategorySection: {
    maxWidth: "1100px",
    margin: "0 auto 30px",
    backgroundColor: "#ffffff",
    padding: "25px",
    borderRadius: "14px",
    boxShadow:
      "0 3px 12px rgba(0,0,0,0.07)"
  },

  subCategoryTitle: {
    marginTop: 0,
    textAlign: "center",
    color: "#1f2937"
  },

  subCategoryGrid: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "10px"
  },

  subButton: {
    padding: "9px 15px",
    border: "1px solid #d1d5db",
    backgroundColor: "#ffffff",
    color: "#374151",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "14px"
  },

  subActiveButton: {
    padding: "9px 15px",
    border: "1px solid #1976d2",
    backgroundColor: "#1976d2",
    color: "#ffffff",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600"
  },

  resultHeader: {
    maxWidth: "1100px",
    margin: "0 auto 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px"
  },

  jobCount: {
    backgroundColor: "#e8f1ff",
    color: "#1976d2",
    padding: "8px 14px",
    borderRadius: "20px",
    fontWeight: "600",
    fontSize: "14px"
  },

  jobsGrid: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "20px"
  },

  jobCard: {
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    padding: "22px",
    boxShadow:
      "0 3px 12px rgba(0,0,0,0.08)",
    border: "1px solid #eeeeee"
  },

  jobHeader: {
    display: "flex",
    gap: "14px",
    alignItems: "center",
    marginBottom: "18px"
  },

  jobIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "10px",
    backgroundColor: "#eef5ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "27px"
  },

  jobTitle: {
    margin: 0,
    fontSize: "19px",
    color: "#1f2937"
  },

  companyName: {
    margin: "5px 0 0",
    color: "#6b7280",
    fontSize: "14px"
  },

  details: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, 1fr)",
    gap: "10px",
    marginBottom: "15px"
  },

  detailItem: {
    display: "flex",
    gap: "7px",
    alignItems: "center",
    color: "#4b5563",
    fontSize: "13px"
  },

  tags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "7px",
    marginBottom: "14px"
  },

  categoryTag: {
    backgroundColor: "#e8f1ff",
    color: "#1976d2",
    padding: "5px 9px",
    borderRadius: "5px",
    fontSize: "12px",
    fontWeight: "600"
  },

  subCategoryTag: {
    backgroundColor: "#ecfdf5",
    color: "#059669",
    padding: "5px 9px",
    borderRadius: "5px",
    fontSize: "12px",
    fontWeight: "600"
  },

  roleTag: {
    backgroundColor: "#fff7ed",
    color: "#ea580c",
    padding: "5px 9px",
    borderRadius: "5px",
    fontSize: "12px",
    fontWeight: "600"
  },

  salary: {
    fontWeight: "600",
    color: "#15803d",
    marginBottom: "12px",
    fontSize: "14px"
  },

  description: {
    color: "#6b7280",
    fontSize: "13px",
    lineHeight: "1.6",
    marginBottom: "18px"
  },

  viewButton: {
    width: "100%",
    padding: "11px",
    backgroundColor: "#1976d2",
    color: "#ffffff",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600"
  },

  emptyCard: {
    maxWidth: "600px",
    margin: "30px auto",
    backgroundColor: "#ffffff",
    padding: "45px 30px",
    borderRadius: "14px",
    textAlign: "center",
    boxShadow:
      "0 3px 12px rgba(0,0,0,0.07)"
  },

  emptyIcon: {
    fontSize: "50px",
    marginBottom: "10px"
  },

  refreshButton: {
    marginTop: "15px",
    padding: "10px 18px",
    border: "none",
    borderRadius: "7px",
    backgroundColor: "#1976d2",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "600"
  }
};

export default GovernmentJobs;