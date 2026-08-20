import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../axiosConfig";
import SEO from "../components/SEO";

function Jobs() {
  const navigate = useNavigate();

  // =====================================================
  // CATEGORIES
  // =====================================================

  const categories = [
    {
      name: "Software Jobs",
      icon: "💻",
      description: "IT and Non-IT software opportunities",
      path: "/jobs/software",
    },

    {
      name: "Banking Jobs",
      icon: "🏦",
      description: "Banking, Finance, Insurance and FinTech",
      path: "/jobs/banking",
    },

    {
      name: "Government Jobs",
      icon: "🏛️",
      description:
        "Central Government and State Government job opportunities",
      path: "/jobs/government",
    },

    {
      name: "BPO Jobs",
      icon: "🎧",
      description: "Voice, Non-Voice and BPO opportunities",
      path: "/jobs/bpo",
    },

    {
      name: "Healthcare Jobs",
      icon: "🏥",
      description: "Medical and Healthcare opportunities",
      path: "/jobs/healthcare",
    },

    {
      name: "Education Jobs",
      icon: "🎓",
      description: "Teaching and Education opportunities",
      path: "/jobs/education",
    },

    {
      name: "Finance Jobs",
      icon: "💰",
      description: "Finance and Accounting opportunities",
      path: "/jobs/finance",
    },

    {
      name: "Marketing Jobs",
      icon: "📢",
      description: "Marketing and Digital Marketing jobs",
      path: "/jobs/marketing",
    },

    {
      name: "HR Jobs",
      icon: "👥",
      description: "Human Resources opportunities",
      path: "/jobs/hr",
    },

    {
      name: "Sales Jobs",
      icon: "📈",
      description: "Sales and Business Development jobs",
      path: "/jobs/sales",
    },

    {
      name: "Core Jobs",
      icon: "⚙️",
      description: "Core industry opportunities",
      path: "/jobs/core",
    },

    {
      name: "Logistics Jobs",
      icon: "🚚",
      description: "Logistics and Supply Chain jobs",
      path: "/jobs/logistics",
    },

    {
      name: "Retail Jobs",
      icon: "🛍️",
      description: "Retail and Store opportunities",
      path: "/jobs/retail",
    },

    {
      name: "Work From Home",
      icon: "🏠",
      description: "Remote and Work From Home jobs",
      path: "/jobs/work-from-home",
    },

    {
      name: "Internships",
      icon: "📚",
      description: "Internship opportunities for students",
      path: "/jobs/internships",
    },

    {
      name: "Fresher Jobs",
      icon: "🌟",
      description: "Jobs specially for freshers",
      path: "/jobs/fresher",
    },
  ];

  // =====================================================
  // STATES
  // =====================================================

  const [searchText, setSearchText] = useState("");

  const [jobs, setJobs] = useState([]);

  const [searchResults, setSearchResults] = useState([]);

  const [loading, setLoading] = useState(false);

  const [searchPerformed, setSearchPerformed] =
    useState(false);

  const [error, setError] = useState("");

  // =====================================================
  // NORMALIZE TEXT
  // =====================================================

  const normalizeText = (value) => {
    if (
      value === null ||
      value === undefined
    ) {
      return "";
    }

    return String(value)
      .toLowerCase()
      .trim()
      .replace(/[-_]/g, " ")
      .replace(/\s+/g, " ");
  };

  // =====================================================
  // LOAD ACTIVE JOBS
  // =====================================================

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/jobs");

      const allJobs = Array.isArray(response.data)
        ? response.data
        : [];

      // =================================================
      // EXTRA FRONTEND SAFETY
      // Deleted jobs should NEVER appear here
      // =================================================

      const activeJobs = allJobs.filter((job) => {
        if (!job) {
          return false;
        }

        if (job.deleted === true) {
          return false;
        }

        return true;
      });

      setJobs(activeJobs);

    } catch (error) {
      console.error(
        "Load jobs error:",
        error
      );

      setJobs([]);

      setError(
        "Failed to load jobs. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadJobs();
  }, []);

  // =====================================================
  // SEARCH JOBS
  // =====================================================

  const handleSearch = () => {
    const search = normalizeText(searchText);

    // =================================================
    // EMPTY SEARCH
    // =================================================

    if (!search) {
      setSearchResults([]);
      setSearchPerformed(false);
      return;
    }

    // =================================================
    // SEARCH ALL IMPORTANT JOB FIELDS
    // =================================================

    const results = jobs.filter((job) => {
      if (!job) {
        return false;
      }

      // Deleted jobs should never appear
      if (job.deleted === true) {
        return false;
      }

      const searchableText = [
        job.jobTitle,
        job.companyName,
        job.location,
        job.category,
        job.subCategory,
        job.jobCategory,
        job.description,
        job.jobType,
        job.workMode,
        job.experience,
        job.qualification,
        job.recruiterName,
      ]
        .filter(Boolean)
        .join(" ");

      return normalizeText(
        searchableText
      ).includes(search);
    });

    setSearchResults(results);
    setSearchPerformed(true);
  };

  // =====================================================
  // ENTER KEY SEARCH
  // =====================================================

  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  // =====================================================
  // CLEAR SEARCH
  // =====================================================

  const clearSearch = () => {
    setSearchText("");
    setSearchResults([]);
    setSearchPerformed(false);
  };

  // =====================================================
  // SEARCH RESULT JOB
  // =====================================================

  const handleJobClick = (job) => {
    if (!job || !job.id) {
      return;
    }

    navigate(`/job/${job.id}`);
  };

  // =====================================================
  // SEARCH RESULTS
  // =====================================================

  const renderSearchResults = () => {
    if (!searchPerformed) {
      return null;
    }

    return (
      <div style={styles.searchResultsSection}>

        {/* RESULT HEADER */}

        <div style={styles.searchResultHeader}>

          <h2 style={styles.resultTitle}>
            Search Results
          </h2>

          <span style={styles.resultCount}>
            {searchResults.length}{" "}
            {searchResults.length === 1
              ? "Job"
              : "Jobs"}
          </span>

        </div>

        {/* NO RESULTS */}

        {searchResults.length === 0 && (
          <div style={styles.noResults}>

            <div style={styles.noResultIcon}>
              🔍
            </div>

            <h2>
              No Jobs Found
            </h2>

            <p>
              No active jobs found for "
              {searchText}"
            </p>

            <button
              type="button"
              onClick={clearSearch}
              style={styles.clearButton}
            >
              Clear Search
            </button>

          </div>
        )}

        {/* RESULTS */}

        {searchResults.length > 0 && (
          <div style={styles.resultsGrid}>

            {searchResults.map((job) => (
              <div
                key={job.id}
                style={styles.jobCard}
                onClick={() =>
                  handleJobClick(job)
                }
              >

                <div style={styles.jobTop}>

                  <div>

                    <h3 style={styles.jobTitle}>
                      {job.jobTitle ||
                        "Job Title Not Available"}
                    </h3>

                    <p style={styles.company}>
                      🏢{" "}
                      {job.companyName ||
                        "Company Not Available"}
                    </p>

                  </div>

                  <span style={styles.openStatus}>
                    {job.status || "Open"}
                  </span>

                </div>

                <div style={styles.jobDetails}>

                  <span>
                    📍{" "}
                    {job.location ||
                      "Location not specified"}
                  </span>

                  <span>
                    💼{" "}
                    {job.jobType ||
                      "Job type not specified"}
                  </span>

                  <span>
                    🎯{" "}
                    {job.experience ||
                      "Experience not specified"}
                  </span>

                  <span>
                    🎓{" "}
                    {job.qualification ||
                      "Qualification not specified"}
                  </span>

                </div>

                {job.description && (
                  <p style={styles.description}>
                    {job.description.length > 180
                      ? `${job.description.substring(
                          0,
                          180
                        )}...`
                      : job.description}
                  </p>
                )}

                <div style={styles.jobBottom}>

                  <span style={styles.categoryBadge}>
                    {job.category ||
                      "General"}
                  </span>

                  <button
                    type="button"
                    style={styles.viewButton}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleJobClick(job);
                    }}
                  >
                    View Job →
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    );
  };

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div style={styles.errorPage}>

        <SEO
          title="Jobs | HariHire"
          description="Find and search for the latest jobs on HariHire."
        />

        <h2>
          ❌ {error}
        </h2>

        <button
          type="button"
          onClick={loadJobs}
          style={styles.retryButton}
        >
          Retry
        </button>

      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <>
      {/* =================================================
          SEO
      ================================================= */}

      <SEO
        title="Latest Jobs | IT, Banking, Government & Fresher Jobs | HariHire"
        description="Find the latest IT, Software, Banking, Government, BPO, Healthcare, Finance and Fresher jobs on HariHire. Search jobs by skills, companies and categories."
        keywords="latest jobs, IT jobs, software jobs, banking jobs, government jobs, BPO jobs, healthcare jobs, finance jobs, fresher jobs, HariHire jobs"
      />

      <div style={styles.page}>

        {/* =================================================
            HEADER
        ================================================= */}

        <div style={styles.header}>

          <h1 style={styles.title}>
            Find Your Dream Job
          </h1>

          <p style={styles.subtitle}>
            Explore jobs by category and find the right
            opportunity for your career.
          </p>

        </div>

        {/* =================================================
            SEARCH
        ================================================= */}

        <div style={styles.searchBox}>

          <input
            type="text"
            value={searchText}
            onChange={(event) =>
              setSearchText(event.target.value)
            }
            onKeyDown={handleSearchKeyDown}
            placeholder="Search jobs, skills or companies..."
            style={styles.searchInput}
          />

          <button
            type="button"
            onClick={handleSearch}
            disabled={loading}
            style={{
              ...styles.searchButton,
              opacity: loading ? 0.6 : 1,
            }}
          >
            🔍 Search
          </button>

        </div>

        {/* =================================================
            SEARCH LOADING
        ================================================= */}

        {loading && (
          <p style={styles.loadingText}>
            Loading jobs...
          </p>
        )}

        {/* =================================================
            SEARCH RESULTS
        ================================================= */}

        {renderSearchResults()}

        {/* =================================================
            CATEGORY TITLE
        ================================================= */}

        {!searchPerformed && (
          <h2 style={styles.sectionTitle}>
            Explore Jobs by Category
          </h2>
        )}

        {/* =================================================
            CATEGORY CARDS
        ================================================= */}

        {!searchPerformed && (
          <div style={styles.grid}>

            {categories.map((category) => (
              <div
                key={category.name}
                style={styles.card}
                onClick={() =>
                  navigate(category.path)
                }
              >

                <div style={styles.icon}>
                  {category.icon}
                </div>

                <h3 style={styles.cardTitle}>
                  {category.name}
                </h3>

                <p style={styles.cardDescription}>
                  {category.description}
                </p>

                <button
                  type="button"
                  style={styles.exploreButton}
                  onClick={(event) => {
                    event.stopPropagation();

                    navigate(category.path);
                  }}
                >
                  Explore Jobs →
                </button>

              </div>
            ))}

          </div>
        )}

      </div>
    </>
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
  },

  searchBox: {
    maxWidth: "800px",
    margin: "0 auto 40px",
    display: "flex",
    gap: "10px",
    backgroundColor: "#ffffff",
    padding: "10px",
    borderRadius: "10px",
    boxShadow:
      "0 3px 12px rgba(0,0,0,0.08)",
  },

  searchInput: {
    flex: 1,
    border: "1px solid #ddd",
    outline: "none",
    padding: "13px",
    fontSize: "16px",
    borderRadius: "7px",
  },

  searchButton: {
    border: "none",
    backgroundColor: "#1976d2",
    color: "#ffffff",
    padding: "12px 22px",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
  },

  loadingText: {
    textAlign: "center",
    color: "#1976d2",
    fontWeight: "600",
    marginBottom: "20px",
  },

  sectionTitle: {
    textAlign: "center",
    color: "#1f2937",
    marginBottom: "25px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "22px",
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    padding: "25px",
    textAlign: "center",
    cursor: "pointer",
    boxShadow:
      "0 3px 12px rgba(0,0,0,0.08)",
    transition: "all 0.25s ease",
    border: "1px solid #eeeeee",
  },

  icon: {
    fontSize: "42px",
    marginBottom: "12px",
  },

  cardTitle: {
    margin: "8px 0",
    fontSize: "20px",
    color: "#1f2937",
  },

  cardDescription: {
    color: "#6b7280",
    fontSize: "14px",
    minHeight: "42px",
    lineHeight: "1.5",
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
  },

  // =====================================================
  // SEARCH RESULTS
  // =====================================================

  searchResultsSection: {
    maxWidth: "1100px",
    margin: "0 auto 40px",
  },

  searchResultHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  resultTitle: {
    color: "#1f2937",
    margin: 0,
  },

  resultCount: {
    backgroundColor: "#e3f2fd",
    color: "#1565c0",
    padding: "7px 14px",
    borderRadius: "20px",
    fontWeight: "600",
  },

  resultsGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  jobCard: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "22px",
    cursor: "pointer",
    boxShadow:
      "0 3px 12px rgba(0,0,0,0.08)",
    border: "1px solid #eeeeee",
  },

  jobTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "15px",
  },

  jobTitle: {
    margin: 0,
    fontSize: "21px",
    color: "#1f2937",
  },

  company: {
    color: "#555",
    marginTop: "8px",
    marginBottom: 0,
  },

  openStatus: {
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },

  jobDetails: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "18px",
    paddingTop: "15px",
    borderTop: "1px solid #eeeeee",
  },

  description: {
    color: "#666",
    lineHeight: "1.6",
    marginTop: "15px",
  },

  jobBottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    marginTop: "18px",
    flexWrap: "wrap",
  },

  categoryBadge: {
    backgroundColor: "#f3f4f6",
    color: "#374151",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "600",
  },

  viewButton: {
    backgroundColor: "#1976d2",
    color: "#ffffff",
    border: "none",
    padding: "9px 17px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },

  noResults: {
    backgroundColor: "#ffffff",
    padding: "45px 25px",
    textAlign: "center",
    borderRadius: "12px",
    boxShadow:
      "0 3px 12px rgba(0,0,0,0.08)",
  },

  noResultIcon: {
    fontSize: "50px",
  },

  clearButton: {
    marginTop: "15px",
    backgroundColor: "#1976d2",
    color: "#ffffff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },

  errorPage: {
    minHeight: "70vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },

  retryButton: {
    marginTop: "15px",
    backgroundColor: "#1976d2",
    color: "#ffffff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default Jobs;