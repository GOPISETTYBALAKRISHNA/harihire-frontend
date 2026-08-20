import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig";

function MyPostedJobs() {

  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {

    try {

      const response = await api.get("/jobs/my");

      setJobs(response.data);

    } catch (error) {

      console.log(error);

      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      }

    }

  };

  const changeStatus = async (id, status) => {

    try {

      await api.put(`/jobs/status/${id}?status=${status}`);

      alert("Job Status Updated");

      loadJobs();

    } catch (error) {

      console.log(error);

      alert("Failed to Update Status");

    }

  };

  const deleteJob = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      await api.delete(`/jobs/${id}`);

      alert("Job Deleted Successfully");

      loadJobs();

    } catch (error) {

      console.log(error);

      alert("Failed to Delete Job");

    }

  };

  return (

    <div style={{ padding: "30px" }}>

      <h2>My Posted Jobs</h2>

      <table border="1" cellPadding="10" width="100%">

        <thead>

          <tr>
            <th>Job Title</th>
            <th>Company</th>
            <th>Location</th>
            <th>Applicants</th>
            <th>Posted Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>

        </thead>

        <tbody>

          {jobs.map((job) => (

            <tr key={job.id}>

              <td>{job.jobTitle}</td>

              <td>{job.companyName}</td>

              <td>{job.location}</td>

              <td>

                <button
                  onClick={() => navigate(`/applicants/${job.id}`)}
                  style={{
                    backgroundColor: "#1976d2",
                    color: "white",
                    border: "none",
                    padding: "8px 15px",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                >
                  View Applicants
                </button>

              </td>

              <td>{job.postedDate}</td>

              <td>

                {job.status === "Open" ? (

                  <button
                    onClick={() => changeStatus(job.id, "Closed")}
                    style={{
                      backgroundColor: "green",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "5px",
                      cursor: "pointer"
                    }}
                  >
                    Open
                  </button>

                ) : (

                  <button
                    onClick={() => changeStatus(job.id, "Open")}
                    style={{
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "5px",
                      cursor: "pointer"
                    }}
                  >
                    Closed
                  </button>

                )}

              </td>

              <td>

                <button
                  onClick={() => navigate(`/edit-job/${job.id}`)}
                  style={{
                    backgroundColor: "orange",
                    color: "white",
                    border: "none",
                    padding: "8px 15px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginRight: "10px"
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteJob(job.id)}
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    padding: "8px 15px",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}

export default MyPostedJobs;