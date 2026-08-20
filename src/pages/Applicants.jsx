import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../axiosConfig";

function Applicants() {

  const navigate = useNavigate();
  const { jobId } = useParams();

  const [applications, setApplications] = useState([]);

  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);

  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewMode, setInterviewMode] = useState("Online");
  const [interviewLocation, setInterviewLocation] = useState("");

  useEffect(() => {
    loadApplicants();
  }, []);

  const loadApplicants = async () => {

    try {

      const response = await api.get(
        `/applications/job/${jobId}`
      );

      setApplications(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  const updateStatus = async (applicationId, status) => {

    try {

      await api.put(
        `/applications/status/${applicationId}`,
        {
          status: status
        }
      );

      alert("Status Updated Successfully");

      loadApplicants();

    } catch (error) {

      console.log(error);

      alert("Failed to Update Status");

    }

  };

  const scheduleInterview = async () => {

    try {

      await api.put(
        `/applications/schedule/${selectedApplicationId}`,
        {
          interviewDate,
          interviewTime,
          interviewMode,
          interviewLocation
        }
      );

      alert("Interview Scheduled Successfully");

      setShowInterviewModal(false);

      setInterviewDate("");
      setInterviewTime("");
      setInterviewMode("Online");
      setInterviewLocation("");

      loadApplicants();

    } catch (error) {

      console.log(error);

      alert("Failed to Schedule Interview");

    }

  };

  return (

    <div style={{ width: "90%", margin: "30px auto" }}>

      <h2>Applicants</h2>

      <table border="1" cellPadding="10" width="100%">

        <thead>

          <tr>

            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Resume</th>
            <th>Status</th>
            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {applications.map((application) => (

            <tr key={application.id}>

              <td>{application.applicantName}</td>

              <td>{application.email}</td>

              <td>{application.phone}</td>
              <td>

{application.resume ? (

  application.resume.toLowerCase().endsWith(".pdf") ? (

    <a
      href={`http://localhost:8085/uploads/${application.resume}`}
      target="_blank"
      rel="noreferrer"
    >
      📄 View Resume
    </a>

  ) : (

    <a
      href={`http://localhost:8085/uploads/${application.resume}`}
      download
    >
      ⬇️ Download Resume
    </a>

  )

) : (

  "No Resume"

)}

</td>

              <td>

                <b>{application.status}</b>

              </td>

              <td>
              <button
  disabled={application.status === "Shortlisted"}
  onClick={() => updateStatus(application.id, "Shortlisted")}
  style={{ marginRight: "5px" }}
>
  Shortlist
</button>

<button
  disabled={application.status === "Rejected"}
  onClick={() => updateStatus(application.id, "Rejected")}
  style={{ marginRight: "5px" }}
>
  Reject
</button>

<button
  disabled={application.status === "Selected"}
  onClick={() => updateStatus(application.id, "Selected")}
  style={{ marginRight: "5px" }}
>
  Select
</button>

                <button
                  onClick={() =>
                    navigate(`/chat?receiverId=${application.userId}`)
                  }
                  style={{
                    marginRight: "5px",
                    backgroundColor: "#1976d2",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                >
                  💬 Message
                </button>

                <button
                  onClick={() => {
                    setSelectedApplicationId(application.id);
                    setInterviewDate("");
                    setInterviewTime("");
                    setInterviewMode("Online");
                    setInterviewLocation("");
                    setShowInterviewModal(true);
                  }}
                  style={{
                    backgroundColor: "green",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                >
                  📅 Schedule Interview
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

      {showInterviewModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "10px",
              width: "400px"
            }}
          >
            <h2>Schedule Interview</h2>

            <input
              type="date"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px"
              }}
            />

            <input
              type="time"
              value={interviewTime}
              onChange={(e) => setInterviewTime(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px"
              }}
            />

            <select
              value={interviewMode}
              onChange={(e) => setInterviewMode(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px"
              }}
            >
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>

            <input
              type="text"
              placeholder="Meeting Link / Office Address"
              value={interviewLocation}
              onChange={(e) => setInterviewLocation(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "20px"
              }}
            />

            <button
              onClick={scheduleInterview}
              style={{
                backgroundColor: "green",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
                marginRight: "10px"
              }}
            >
              Schedule
            </button>

            <button
              onClick={() => setShowInterviewModal(false)}
              style={{
                backgroundColor: "red",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>

          </div>
        </div>
      )}

    </div>

  );

}

export default Applicants;