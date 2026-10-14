import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig";
import AdBanner from "../components/AdBanner";

function SavedJobs() {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    loadSavedJobs();
  }, []);

  const loadSavedJobs = async () => {
    const user = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    if (!user) {
      setSavedJobs([]);
      return;
    }

    try {
      const response = await api.get(
        `/saved-jobs/${user.id}`
      );

      const jobs = Array.isArray(response.data)
        ? response.data
        : [];

      const jobsWithStatus = await Promise.all(
        jobs.map(async (job) => {
          try {
            const check = await api.get(
              `/applications/check/${user.id}/${job.id}`
            );

            return {
              ...job,
              applied: check.data === true,
            };
          } catch (error) {
            console.error(
              "Application status check failed:",
              error
            );

            return {
              ...job,
              applied: false,
            };
          }
        })
      );

      setSavedJobs(jobsWithStatus);
    } catch (error) {
      console.error("Failed to load saved jobs:", error);
      alert("Saved jobs load cheyyadam lo problem vachindi.");
    }
  };

  const handleApply = async (job) => {
    const loggedIn = localStorage.getItem("isLoggedIn");

    if (!loggedIn || loggedIn === "false") {
      alert("Please Login First");
      navigate("/login");
      return;
    }

    const user = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    if (!user) {
      alert("Please login again.");
      navigate("/login");
      return;
    }

    // External jobs: open the original application website.
    const applyType = String(job.applyType || "").toUpperCase();
    const sourceType = String(job.sourceType || "").toUpperCase();

    const isExternalJob =
      applyType === "EXTERNAL" ||
      sourceType === "ADZUNA" ||
      sourceType === "OFFICIAL";

    if (isExternalJob) {
      const externalUrl = job.applyLink || job.sourceUrl;

      if (!externalUrl) {
        alert("External application link is not available.");
        return;
      }

      try {
        const parsedUrl = new URL(externalUrl);

        if (
          parsedUrl.protocol !== "https:" &&
          parsedUrl.protocol !== "http:"
        ) {
          alert("Invalid application link.");
          return;
        }

        window.open(
          parsedUrl.href,
          "_blank",
          "noopener,noreferrer"
        );
      } catch (error) {
        console.error("Invalid external URL:", error);
        alert("Invalid application link.");
      }

      return;
    }

    // Internal recruiter jobs: submit the application to HariHire.
    try {
      const check = await api.get(
        `/applications/check/${user.id}/${job.id}`
      );

      if (check.data === true) {
        alert("You already applied for this job.");
        return;
      }

      await api.post("/applications/apply", {
        jobId: job.id,
        userId: user.id,
        applicantName: user.fullName,
        email: user.email,
        phone: user.phone,
        resume: user.resume,
        status: "Applied",
      });

      alert("Application Submitted Successfully");
      await loadSavedJobs();
    } catch (error) {
      console.error("Application error:", error);

      alert(
        `error.response?.data?.message` ||
        "Application Failed. Please try again."
      );
    }
  };

  const removeSavedJob = async (jobId) => {
    const user = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    if (!user) {
      alert("Please login again.");
      navigate("/login");
      return;
    }

    try {
      await api.delete(
        `/saved-jobs/${user.id}/${jobId}`
      );

      alert("Job Removed Successfully");
      await loadSavedJobs();
    } catch (error) {
      console.error("Remove saved job failed:", error);
      alert("Job remove cheyyadam lo problem vachindi.");
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        backgroundColor: "#f5f7fa",
        minHeight: "100vh",
      }}
    >
      <h1>⭐ Saved Jobs</h1>

      {savedJobs.length === 0 ? (
        <p>No Saved Jobs Found</p>
      ) : (
        savedJobs.map((job) => (
          <div
            key={job.id}
            style={{
              border: "1px solid lightgray",
              borderRadius: "10px",
              padding: "20px",
              marginBottom: "20px",
              backgroundColor: "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <h2>{job.jobTitle}</h2>

            <p>
              <b>Company:</b> {job.companyName}
            </p>

            <p>
              <b>Location:</b> {job.location}
            </p>

            <p>
              <b>Salary:</b> ₹{job.salary}
            </p>

            <p>
              <b>Experience:</b> {job.experience}
            </p>

            <p>{job.description}</p>

            {job.applied ? (
              <button
                onClick={() =>
                  alert("You already applied for this job.")
                }
                style={{
                  backgroundColor: "green",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                ✔ Applied
              </button>
            ) : (
              <button
                onClick={() => handleApply(job)}
                style={{
                  backgroundColor: "#1976d2",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Apply Now
              </button>
            )}

            <button
              onClick={() => removeSavedJob(job.id)}
              style={{
                backgroundColor: "#ff9800",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
                marginLeft: "10px",
              }}
            >
              Remove Saved
            </button>
          </div>
        ))
      )}

      <AdBanner />
    </div>
  );
}

export default SavedJobs;