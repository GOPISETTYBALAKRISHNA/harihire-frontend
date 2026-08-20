import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../axiosConfig";

function EditJob() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState({
    jobTitle: "",
    companyName: "",
    location: "",
    salary: "",
    description: "",
    jobType: "",
    category: "",
    experience: "",
    qualification: "",
    applyType: "INTERNAL",
    applyLink: ""
  });

  useEffect(() => {
    loadJob();
  }, []);

  const loadJob = async () => {

    try {

      const response = await api.get(`/jobs/${id}`);

      setJob(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  const handleChange = (e) => {

    setJob({
      ...job,
      [e.target.name]: e.target.value
    });

  };

  const updateJob = async () => {

    try {

      await api.put(`/jobs/update/${id}`, job);

      alert("Job Updated Successfully");

      navigate("/my-posted-jobs");

    } catch (error) {

      console.log(error);

      alert("Failed to Update Job");

    }

  };

  return (

    <div style={{ padding: "30px", maxWidth: "700px", margin: "auto" }}>

      <h2>Edit Job</h2>

      <input
        name="jobTitle"
        value={job.jobTitle}
        onChange={handleChange}
        placeholder="Job Title"
      />
      <br /><br />

      <input
        name="companyName"
        value={job.companyName}
        onChange={handleChange}
        placeholder="Company Name"
      />
      <br /><br />

      <input
        name="location"
        value={job.location}
        onChange={handleChange}
        placeholder="Location"
      />
      <br /><br />

      <input
        name="salary"
        value={job.salary}
        onChange={handleChange}
        placeholder="Salary"
      />
      <br /><br />

      <textarea
        name="description"
        value={job.description}
        onChange={handleChange}
        placeholder="Description"
      />

      <br /><br />

      <button onClick={updateJob}>
        Update Job
      </button>

    </div>

  );

}

export default EditJob;