import { useEffect, useState } from "react";
import api from "../axiosConfig";
import { useNavigate } from "react-router-dom";

function MyJobs() {

  const [jobs, setJobs] = useState([]);

  const navigate = useNavigate();

  const recruiter = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {

    try {

      const response = await api.get(
        `/jobs/recruiter/${recruiter.id}`
      );

      setJobs(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div style={{ width: "90%", margin: "30px auto" }}>

      <h2>My Posted Jobs</h2>

      <table border="1" cellPadding="10" width="100%">

        <thead>

          <tr>
            <th>Job Title</th>
            <th>Company</th>
            <th>Location</th>
            <th>Applicants</th>
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
                >
                  View Applicants
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}

export default MyJobs;