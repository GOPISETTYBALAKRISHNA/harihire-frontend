
import { useEffect, useState } from "react";
import api from "../axiosConfig";
import { useNavigate } from "react-router-dom";
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
      return;
    }

    try {
      const response = await api.get(
        `/saved-jobs/${user.id}`
      );

      const jobsWithStatus = await Promise.all(
        response.data.map(async (job) => {
          try {
            const check = await api.get(
              `/applications/check/${user.id}/${job.id}`
            );

            return {
              ...job,
              applied: check.data,
            };
          } catch (error) {
            return {
              ...job,
              applied: false,
            };
          }
        })
      );

      setSavedJobs(jobsWithStatus);
    } catch (error) {
      console.log(error);
    }
  };

  const handleApply = async (job) => {
    const loggedIn =
      localStorage.getItem("isLoggedIn");

    if (!loggedIn) {
      alert("Please Login First");
      navigate("/login");
      return;
    }

    const user = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    try {
      const check = await api.get(
        `/applications/check/${user.id}/${job.id}`
      );

      if (check.data) {
        alert("You already applied for this job");
        return;
      }

      await api.post(
        "/applications/apply",
        {
          jobId: job.id,
          userId: user.id,
          applicantName: user.fullName,
          email: user.email,
          phone: user.phone,
          resume: user.resume,
          status: "Applied",
        }
      );

      alert("Application Submitted Successfully");

      loadSavedJobs();
    } catch (error) {
      console.log(error);
      alert("Application Failed");
    }
  };

  const removeSavedJob = async (jobId) => {
    const user = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    try {
      await api.delete(
        `/saved-jobs/${user.id}/${jobId}`
      );

      alert("Job Removed Successfully");

      loadSavedJobs();
    } catch (error) {
      console.log(error);
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
      <h1>
        ⭐ Saved Jobs
      </h1>

      {savedJobs.length === 0 ? (
        <p>
          No Saved Jobs Found
        </p>
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
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <h2>
              {job.jobTitle}
            </h2>

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

            <p>
              {job.description}
            </p>

            {job.applied ? (
              <button
                onClick={() =>
                  alert(
                    "You already applied for this job"
                  )
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
              onClick={() =>
                removeSavedJob(job.id)
              }
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

      {/* =========================
          Advertisement
      ========================= */}

      <AdBanner />
    </div>
  );
}

export default SavedJobs;
