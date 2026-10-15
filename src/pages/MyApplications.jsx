import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../axiosConfig";
import AdBanner from "../components/AdBanner";
import ImageAdManager from "../components/ImageAdManager";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const isLoggedIn =
    localStorage.getItem("isLoggedIn") === "true";

  const isAdminLoggedIn =
    localStorage.getItem("adminLoggedIn") === "true";

  useEffect(() => {
    getApplications();
  }, []);

  const getCurrentUser = () => {
    try {
      return JSON.parse(
        localStorage.getItem("user") || "null"
      );
    } catch (error) {
      console.error("User Parse Error:", error);
      return null;
    }
  };

  const getApplications = async () => {
    const user = getCurrentUser();

    if (!user || !user.id) {
      setLoading(false);
      alert("Please Login First");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const applicationsResponse = await api.get(
        `/applications/user/${user.id}`
      );

      const userApplications = Array.isArray(
        applicationsResponse.data
      )
        ? applicationsResponse.data
        : [];

      const jobsResponse = await api.get("/jobs");

      const activeJobs = Array.isArray(jobsResponse.data)
        ? jobsResponse.data
        : [];

      const activeJobIds = new Set(
        activeJobs
          .map((job) => job.id)
          .filter(
            (jobId) =>
              jobId !== null && jobId !== undefined
          )
      );

      const visibleApplications = userApplications.filter(
        (application) => {
          if (application.deleted === true) {
            return false;
          }

          if (
            application.jobId === null ||
            application.jobId === undefined
          ) {
            return false;
          }

          return activeJobIds.has(application.jobId);
        }
      );

      setApplications(visibleApplications);
    } catch (error) {
      console.error("My Applications Error:", error);

      if (
        `error.response?.status` === 401 ||
        `error.response?.status` === 403
      ) {
        alert("Session expired. Please login again.");

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");

        navigate("/login");
        return;
      }

      alert(
        "Unable to load applications. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingCard}>
          <h2>Loading Applications...</h2>
          <p>Please wait.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {isLoggedIn && !isAdminLoggedIn && (
        <ImageAdManager
          isLoggedIn={isLoggedIn}
          isAdminLoggedIn={isAdminLoggedIn}
          trigger={true}
        />
      )}

      <h1 style={styles.pageTitle}>
        My Applications
      </h1>

      {applications.length === 0 ? (
        <div style={styles.emptyCard}>
          <div style={styles.emptyIcon}>📄</div>

          <h3>No Applications Found</h3>

          <p>
            You haven't applied to any active jobs yet.
          </p>

          <button
            onClick={() => navigate("/jobs")}
            style={styles.jobsButton}
          >
            Browse Jobs
          </button>
        </div>
      ) : (
        <div>
          <div style={styles.countBox}>
            <strong>{applications.length}</strong>

            <span>
              Active Application
              {applications.length !== 1 ? "s" : ""}
            </span>
          </div>

          {applications.map((application) => {
            const status = application.status || "Applied";

            return (
              <div
                key={application.id}
                style={styles.applicationCard}
              >
                <h2 style={styles.jobTitle}>
                  {application.jobTitle || "Job Application"}
                </h2>

                {application.companyName && (
                  <p style={styles.detail}>
                    🏢 <b>Company:</b>{" "}
                    {application.companyName}
                  </p>
                )}

                <p style={styles.detail}>
                  👤 <b>Applicant:</b>{" "}
                  {application.applicantName || "N/A"}
                </p>

                <p style={styles.detail}>
                  📧 <b>Email:</b>{" "}
                  {application.email || "N/A"}
                </p>

                {application.phone && (
                  <p style={styles.detail}>
                    📱 <b>Phone:</b>{" "}
                    {application.phone}
                  </p>
                )}

                <div style={styles.statusSection}>
                  <p style={styles.statusLabel}>
                    Application Status
                  </p>

                  {status === "Applied" && (
                    <div style={styles.appliedStatus}>
                      ✅ Applied
                    </div>
                  )}

                  {status === "Shortlisted" && (
                    <div style={styles.shortlistedBox}>
                      <h3>🎉 Resume Shortlisted</h3>
                      <p>
                        Recruiter shortlisted your application.
                      </p>
                    </div>
                  )}

                  {status === "Interview Scheduled" && (
                    <div style={styles.interviewBox}>
                      <h3>📅 Interview Scheduled</h3>

                      <p>
                        <b>Date:</b>{" "}
                        {application.interviewDate ||
                          "Not specified"}
                      </p>

                      <p>
                        <b>Time:</b>{" "}
                        {application.interviewTime ||
                          "Not specified"}
                      </p>

                      <p>
                        <b>Mode:</b>{" "}
                        {application.interviewMode ||
                          "Not specified"}
                      </p>

                      <p>
                        <b>Location / Link:</b>{" "}
                        {application.interviewLocation ||
                          "Not specified"}
                      </p>
                    </div>
                  )}

                  {status === "Selected" && (
                    <div style={styles.selectedBox}>
                      <h3>🥳 Congratulations! Selected</h3>

                      <p>
                        Your offer letter is ready.
                      </p>

                      {application.offerLetter && (
                        <a
                          href={`/offerletters/${encodeURIComponent(
                            application.offerLetter
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          style={styles.offerLink}
                        >
                          <button style={styles.offerButton}>
                            📄 Download Offer Letter
                          </button>
                        </a>
                      )}
                    </div>
                  )}

                  {status === "Rejected" && (
                    <div style={styles.rejectedStatus}>
                      ❌ Application Rejected
                    </div>
                  )}

                  {![
                    "Applied",
                    "Shortlisted",
                    "Interview Scheduled",
                    "Selected",
                    "Rejected",
                  ].includes(status) && (
                    <div style={styles.otherStatus}>
                      {status}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={styles.bottomAd}>
        <AdBanner />
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "30px 20px",
    backgroundColor: "#f5f7fa",
    boxSizing: "border-box",
  },

  pageTitle: {
    textAlign: "center",
    marginBottom: "25px",
    color: "#1f2937",
  },

  loadingContainer: {
    minHeight: "70vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f7fa",
  },

  loadingCard: {
    textAlign: "center",
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },

  emptyCard: {
    maxWidth: "600px",
    margin: "50px auto",
    backgroundColor: "#ffffff",
    padding: "40px 25px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },

  emptyIcon: {
    fontSize: "45px",
    marginBottom: "10px",
  },

  jobsButton: {
    backgroundColor: "#1976d2",
    color: "#ffffff",
    border: "none",
    padding: "11px 22px",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "10px",
    fontWeight: "600",
  },

  countBox: {
    maxWidth: "900px",
    margin: "0 auto 20px",
    backgroundColor: "#ffffff",
    padding: "12px 18px",
    borderRadius: "8px",
    display: "flex",
    gap: "8px",
    alignItems: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
  },

  applicationCard: {
    maxWidth: "900px",
    margin: "0 auto 20px",
    border: "1px solid #e0e0e0",
    borderRadius: "12px",
    padding: "22px",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    boxSizing: "border-box",
  },

  jobTitle: {
    marginTop: "0",
    marginBottom: "15px",
    color: "#1976d2",
  },

  detail: {
    margin: "8px 0",
    color: "#555",
  },

  statusSection: {
    marginTop: "20px",
    marginBottom: "15px",
  },

  statusLabel: {
    fontWeight: "700",
    marginBottom: "8px",
  },

  appliedStatus: {
    display: "inline-block",
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
    padding: "9px 15px",
    borderRadius: "6px",
    fontWeight: "700",
  },

  shortlistedBox: {
    backgroundColor: "#e8f5e9",
    padding: "15px",
    borderRadius: "8px",
    border: "1px solid #43a047",
  },

  interviewBox: {
    backgroundColor: "#e3f2fd",
    padding: "15px",
    borderRadius: "8px",
    border: "1px solid #1976d2",
  },

  selectedBox: {
    backgroundColor: "#e8f5e9",
    padding: "15px",
    borderRadius: "8px",
    border: "1px solid #43a047",
  },

  rejectedStatus: {
    display: "inline-block",
    backgroundColor: "#ffebee",
    color: "#c62828",
    padding: "9px 15px",
    borderRadius: "6px",
    fontWeight: "700",
  },

  otherStatus: {
    display: "inline-block",
    backgroundColor: "#f3f4f6",
    color: "#374151",
    padding: "9px 15px",
    borderRadius: "6px",
    fontWeight: "600",
  },

  offerLink: {
    textDecoration: "none",
  },

  offerButton: {
    backgroundColor: "#1976d2",
    color: "#ffffff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },

  bottomAd: {
    marginTop: "30px",
  },
};

export default MyApplications;