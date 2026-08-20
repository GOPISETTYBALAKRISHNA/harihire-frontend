
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../axiosConfig";

function AdminJobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    getJob();
  }, []);

  const getJob = async () => {
    try {
      const response = await api.get(`/jobs/${id}`);
      setJob(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!job) {
    return <h3 style={{ padding: "30px" }}>Loading...</h3>;
  }

  return (
    <div style={{ padding: "30px" }}>
      <h2>💼 Job Details</h2>

      <p><b>Job Title:</b> {job.title}</p>
      <p><b>Company:</b> {job.companyName || "-"}</p>
      <p><b>Location:</b> {job.location || "-"}</p>
      <p><b>Category:</b> {job.category || "-"}</p>
      <p><b>Job Type:</b> {job.jobType || "-"}</p>
      <p><b>Salary:</b> {job.salary || "-"}</p>
      <p><b>Experience:</b> {job.experience || "-"}</p>
      <p><b>Recruiter:</b> {job.recruiterName || "-"}</p>
      <p><b>Description:</b> {job.description || "-"}</p>
      <p><b>Skills:</b> {job.skills || "-"}</p>
    </div>
  );
}

export default AdminJobDetails;