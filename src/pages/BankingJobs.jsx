import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig";

function BankingJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingJobId, setSavingJobId] = useState(null);
  const [error, setError] = useState("");

  // =====================================================
  // GET USER
  // =====================================================

  const getUser = () => {
    try {
      const user = localStorage.getItem("user");

      if (!user) {
        return null;
      }

      return JSON.parse(user);
    } catch (err) {
      console.error("User parse error:", err);
      return null;
    }
  };

  // =====================================================
  // LOAD BANKING JOBS
  // =====================================================

  useEffect(() => {
    loadBankingJobs();
  }, []);

  const loadBankingJobs = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("Loading Banking Jobs...");

      /*
       * IMPORTANT:
       *
       * Admin/PostJob lo category:
       *
       * category = Banking
       *
       * kabatti backend nundi Banking category jobs
       * fetch chestunnam.
       */

      const response = await api.get("/jobs/category/Banking");

      console.log("BANKING JOB RESPONSE:", response.data);

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      /*
       * Extra frontend filter.
       *
       * Backend extra jobs pampina kuda
       * Banking jobs matrame display avutayi.
       */

      const bankingJobs = data.filter((job) => {
        return (
          String(job.category || "").toLowerCase() ===
          "banking"
        );
      });

      console.log("FILTERED BANKING JOBS:", bankingJobs);

      setJobs(bankingJobs);

      await loadSavedStatus(bankingJobs);
    } catch (err) {
      console.error("BANKING JOB ERROR:", err);

      if (err.response) {
        console.error(
          "STATUS:",
          err.response.status
        );

        console.error(
          "BACKEND RESPONSE:",
          err.response.data
        );
      }

      setJobs([]);

      setError(
        "Failed to load Banking jobs."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD SAVED STATUS
  // =====================================================

  const loadSavedStatus = async (jobList) => {
    const user = getUser();

    if (!user || !user.id) {
      setSavedJobs([]);
      return;
    }

    const savedIds = [];

    for (const job of jobList) {
      try {
        const response = await api.get(
          `/saved-jobs/check?userId=${user.id}&jobId=${job.id}`
        );

        if (response.data === true) {
          savedIds.push(job.id);
        }
      } catch (err) {
        console.error(
          "Saved status error:",
          err
        );
      }
    }

    setSavedJobs(savedIds);
  };

  // =====================================================
  // SAVE / UNSAVE
  // =====================================================

  const handleSaveJob = async (job) => {
    if (!job || !job.id) {
      return;
    }

    const user = getUser();

    if (!user || !user.id) {
      alert("Please login to save this job.");
      navigate("/login");
      return;
    }

    try {
      setSavingJobId(job.id);

      const isSaved =
        savedJobs.includes(job.id);

      // REMOVE
      if (isSaved) {
        await api.delete(
          `/saved-jobs/${user.id}/${job.id}`
        );

        setSavedJobs((previous) => {
          return previous.filter(
            (id) => id !== job.id
          );
        });

        return;
      }

      // SAVE
      await api.post(
        "/saved-jobs/save",
        {
          userId: user.id,
          jobId: job.id
        }
      );

      setSavedJobs((previous) => {
        if (previous.includes(job.id)) {
          return previous;
        }

        return [
          ...previous,
          job.id
        ];
      });
    } catch (err) {
      console.error(
        "Save job error:",
        err
      );

      if (
        err.response &&
        (
          err.response.status === 401 ||
          err.response.status === 403
        )
      ) {
        alert(
          "Please login again to save jobs."
        );
      } else {
        alert(
          "Unable to save this job."
        );
      }
    } finally {
      setSavingJobId(null);
    }
  };

  // =====================================================
  // APPLY
  // =====================================================

  const handleApply = (job) => {
    if (!job || !job.id) {
      return;
    }

    const applyType = String(
      job.applyType || "INTERNAL"
    ).toUpperCase();

    // EXTERNAL
    if (applyType === "EXTERNAL") {
      if (!job.applyLink) {
        alert(
          "Company application link is not available."
        );
        return;
      }

      window.open(
        job.applyLink,
        "_blank",
        "noopener,noreferrer"
      );

      return;
    }

    // INTERNAL
    navigate(`/job/${job.id}`);
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div style={styles.center}>
        <h2>
          Loading Banking Jobs...
        </h2>

        <p>
          Please wait...
        </p>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div style={styles.center}>
        <h2 style={styles.errorText}>
          ❌ {error}
        </h2>

        <button
          type="button"
          onClick={loadBankingJobs}
          style={styles.retryButton}
        >
          Retry
        </button>
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
          onClick={() => navigate("/jobs")}
          style={styles.backButton}
        >
          ← Back to Job Categories
        </button>

        <h1 style={styles.title}>
          🏦 Banking Jobs
        </h1>

        <p style={styles.subtitle}>
          Explore Banking, Finance and Insurance
          job opportunities.
        </p>

      </div>

      {/* =================================================
          CATEGORY INFORMATION
      ================================================= */}

      <div style={styles.categoryBox}>

        <div style={styles.categoryItem}>
          <span>🏦</span>
          <strong>Banking</strong>
        </div>

        <div style={styles.categoryItem}>
          <span>💰</span>
          <strong>Finance & Accounting</strong>
        </div>

        <div style={styles.categoryItem}>
          <span>🛡️</span>
          <strong>Insurance</strong>
        </div>

      </div>

      {/* =================================================
          RESULT HEADER
      ================================================= */}

      <div style={styles.resultHeader}>

        <h2>
          Available Banking Jobs
        </h2>

        <span style={styles.count}>
          {jobs.length}{" "}
          {jobs.length === 1
            ? "Job"
            : "Jobs"}
        </span>

      </div>

      {/* =================================================
          NO JOBS
      ================================================= */}

      {jobs.length === 0 && (

        <div style={styles.noJobs}>

          <div style={styles.noJobsIcon}>
            🏦
          </div>

          <h2>
            No Banking Jobs Available
          </h2>

          <p>
            There are currently no approved
            Banking jobs available.
          </p>

          <button
            type="button"
            onClick={loadBankingJobs}
            style={styles.retryButton}
          >
            Refresh Jobs
          </button>

        </div>

      )}

      {/* =================================================
          JOB LIST
      ================================================= */}

      <div style={styles.container}>

        {jobs.map((job) => {

          const isSaved =
            savedJobs.includes(job.id);

          const status =
            String(
              job.status || "APPROVED"
            );

          const applyType =
            String(
              job.applyType || "INTERNAL"
            ).toUpperCase();

          return (

            <div
              key={job.id}
              style={styles.card}
            >

              {/* JOB HEADER */}

              <div style={styles.jobHeader}>

                <div>

                  <h2 style={styles.jobTitle}>
                    {job.jobTitle ||
                      "Job Title Not Available"}
                  </h2>

                  <h3 style={styles.company}>
                    🏢{" "}
                    {job.companyName ||
                      "Company Not Available"}
                  </h3>

                </div>

                <span style={styles.status}>
                  {status}
                </span>

              </div>

              {/* DETAILS */}

              <div style={styles.details}>

                <span>
                  📍{" "}
                  {job.location ||
                    "Location not specified"}
                </span>

                <span>
                  💰{" "}
                  {job.salary
                    ? `₹${job.salary}`
                    : "Salary not disclosed"}
                </span>

                <span>
                  💼{" "}
                  {job.jobType ||
                    "Job Type not specified"}
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

              {/* CATEGORY */}

              <div style={styles.categoryInfo}>

                <span>
                  Category:{" "}
                  <strong>
                    {job.category ||
                      "Banking"}
                  </strong>
                </span>

                <span>
                  Sub Category:{" "}
                  <strong>
                    {job.subCategory ||
                      "N/A"}
                  </strong>
                </span>

                <span>
                  Job Role:{" "}
                  <strong>
                    {job.jobCategory ||
                      job.jobTitle ||
                      "N/A"}
                  </strong>
                </span>

              </div>

              {/* DESCRIPTION */}

              <div style={styles.description}>

                <h4>
                  Job Description
                </h4>

                <p>
                  {job.description ||
                    "No description available."}
                </p>

              </div>

              {/* FOOTER */}

              <div style={styles.footer}>

                <span style={styles.date}>
                  📅 Posted:{" "}
                  {job.postedDate ||
                    "Recently"}
                </span>

                <div style={styles.actions}>

                  {/* SAVE */}

                  <button
                    type="button"
                    onClick={() =>
                      handleSaveJob(job)
                    }
                    disabled={
                      savingJobId === job.id
                    }
                    style={{
                      ...styles.saveButton,
                      backgroundColor:
                        isSaved
                          ? "#fff3e0"
                          : "#ffffff",
                      color:
                        isSaved
                          ? "#ef6c00"
                          : "#1976d2",
                      border:
                        isSaved
                          ? "1px solid #ef6c00"
                          : "1px solid #1976d2"
                    }}
                  >
                    {savingJobId === job.id
                      ? "Saving..."
                      : isSaved
                      ? "❤️ Saved"
                      : "♡ Save Job"}
                  </button>

                  {/* APPLY TYPE */}

                  <span
                    style={{
                      ...styles.applyType,
                      backgroundColor:
                        applyType ===
                        "EXTERNAL"
                          ? "#fff3e0"
                          : "#e3f2fd",
                      color:
                        applyType ===
                        "EXTERNAL"
                          ? "#ef6c00"
                          : "#1565c0"
                    }}
                  >
                    {applyType ===
                    "EXTERNAL"
                      ? "Company Website"
                      : "HariHire"}
                  </span>

                  {/* APPLY */}

                  <button
                    type="button"
                    onClick={() =>
                      handleApply(job)
                    }
                    style={
                      styles.applyButton
                    }
                  >
                    Apply Now →
                  </button>

                </div>

              </div>

            </div>
          );
        })}

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
    boxSizing: "border-box"
  },

  header: {
    textAlign: "center",
    marginBottom: "30px"
  },

  backButton: {
    backgroundColor: "#ffffff",
    color: "#1976d2",
    border: "1px solid #1976d2",
    padding: "10px 18px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600",
    marginBottom: "20px"
  },

  title: {
    margin: 0,
    fontSize: "36px",
    color: "#1f2937"
  },

  subtitle: {
    color: "#6b7280",
    fontSize: "16px",
    marginTop: "10px"
  },

  categoryBox: {
    maxWidth: "900px",
    margin: "0 auto 35px",
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    flexWrap: "wrap"
  },

  categoryItem: {
    backgroundColor: "#ffffff",
    padding: "12px 20px",
    borderRadius: "8px",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.07)",
    color: "#374151",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },

  resultHeader: {
    maxWidth: "1100px",
    margin: "0 auto 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  count: {
    backgroundColor: "#e3f2fd",
    color: "#1565c0",
    padding: "7px 14px",
    borderRadius: "20px",
    fontWeight: "600"
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "25px",
    boxShadow:
      "0 3px 12px rgba(0,0,0,0.08)",
    border: "1px solid #eeeeee"
  },

  jobHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "15px"
  },

  jobTitle: {
    margin: 0,
    color: "#1f2937",
    fontSize: "22px"
  },

  company: {
    color: "#555555",
    fontSize: "16px",
    marginTop: "8px"
  },

  status: {
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
    padding: "6px 12px",
    borderRadius: "20px",
    fontWeight: "600",
    fontSize: "13px"
  },

  details: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "20px",
    padding: "15px 0",
    borderTop: "1px solid #eeeeee",
    borderBottom: "1px solid #eeeeee"
  },

  categoryInfo: {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
    marginTop: "15px",
    fontSize: "13px",
    color: "#666666"
  },

  description: {
    marginTop: "15px",
    color: "#555555",
    lineHeight: "1.6"
  },

  footer: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap"
  },

  date: {
    color: "#777777",
    fontSize: "14px"
  },

  actions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap"
  },

  saveButton: {
    padding: "9px 14px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px"
  },

  applyType: {
    padding: "7px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600"
  },

  applyButton: {
    backgroundColor: "#1976d2",
    color: "#ffffff",
    border: "none",
    padding: "11px 20px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600"
  },

  noJobs: {
    maxWidth: "700px",
    margin: "50px auto",
    backgroundColor: "#ffffff",
    padding: "45px 25px",
    textAlign: "center",
    borderRadius: "12px",
    boxShadow:
      "0 3px 12px rgba(0,0,0,0.08)"
  },

  noJobsIcon: {
    fontSize: "50px"
  },

  center: {
    minHeight: "70vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center"
  },

  errorText: {
    color: "#d32f2f"
  },

  retryButton: {
    marginTop: "15px",
    backgroundColor: "#1976d2",
    color: "#ffffff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600"
  }
};

export default BankingJobs;