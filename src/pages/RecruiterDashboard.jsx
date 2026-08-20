import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../axiosConfig";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";


function RecruiterDashboard() {

  const navigate = useNavigate();

  const [totalJobs, setTotalJobs] = useState(0);
  const [selectedCandidates, setSelectedCandidates] = useState(0);
  const [totalApplications, setTotalApplications] = useState(0);
  const [interviews, setInterviews] = useState(0);

  // =====================================================
  // NOTIFICATION COUNT
  // =====================================================

  const [notificationCount, setNotificationCount] =
    useState(0);


  useEffect(() => {

    const recruiter =
      JSON.parse(localStorage.getItem("user"));


    if (recruiter) {

      // =================================================
      // Total Jobs Count
      // =================================================

      api
        .get(`/dashboard/recruiter/jobs/${recruiter.id}`)
        .then((res) => {

          setTotalJobs(res.data);

        })
        .catch((err) => {

          console.log(err);

        });


      // =================================================
      // Total Applications
      // =================================================

      api
        .get(`/applications/recruiter/${recruiter.id}`)
        .then((res) => {

          setTotalApplications(res.data.length);

        })
        .catch((err) => console.log(err));


      // =================================================
      // Interviews Count
      // =================================================

      api
        .get(`/dashboard/recruiter/interviews/${recruiter.id}`)
        .then((res) => {

          setInterviews(res.data);

        })
        .catch((err) => console.log(err));


      // =================================================
      // Selected Candidates Count
      // =================================================

      api
        .get(`/dashboard/recruiter/selected/${recruiter.id}`)
        .then((res) => {

          setSelectedCandidates(res.data.length);

        })
        .catch((err) => {

          console.log(err);

        });


      // =================================================
      // Notification Count
      // =================================================

      loadNotificationCount();

    }

  }, []);


  // =====================================================
  // LOAD UNREAD NOTIFICATION COUNT
  // =====================================================

  const loadNotificationCount = async () => {

    try {

      const response =
        await api.get("/notifications/count");

      setNotificationCount(
        Number(response.data) || 0
      );

    } catch (error) {

      console.log(
        "Notification Count Error:",
        error
      );

    }

  };


  // =====================================================
  // LISTEN FOR NOTIFICATION READ EVENT
  // =====================================================

  useEffect(() => {

    const handleNotificationRead = () => {

      loadNotificationCount();

    };


    window.addEventListener(
      "notificationRead",
      handleNotificationRead
    );


    return () => {

      window.removeEventListener(
        "notificationRead",
        handleNotificationRead
      );

    };

  }, []);


  // =====================================================
  // CHART DATA
  // =====================================================

  const chartData = [

    {
      name: "Selected",
      candidates: selectedCandidates
    }

  ];


  // =====================================================
  // RETURN
  // =====================================================

  return (

    <div style={{ padding: "30px" }}>


      {/* =================================================
          HEADER
      ================================================= */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px"
        }}
      >

        <h1 style={{ textAlign: "center", margin: 0 }}>
          Recruiter Dashboard
        </h1>


        {/* =================================================
            NOTIFICATION BUTTON
        ================================================= */}

        <button
          onClick={() =>
            navigate("/recruiter/notifications")
          }
          style={{
            position: "relative",
            background: "#1976d2",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold"
          }}
        >

          🔔 Notifications


          {/* Unread Badge */}

          {notificationCount > 0 && (

            <span
              style={{
                position: "absolute",
                top: "-8px",
                right: "-8px",
                background: "#f44336",
                color: "white",
                minWidth: "24px",
                height: "24px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: "bold",
                padding: "2px"
              }}
            >

              {notificationCount > 99
                ? "99+"
                : notificationCount}

            </span>

          )}

        </button>

      </div>


      {/* =================================================
          DASHBOARD CARDS
      ================================================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px,1fr))",
          gap: "20px",
          marginTop: "40px"
        }}
      >


        {/* =================================================
            Total Jobs Card
        ================================================= */}

        <div
          style={{
            background: "#673ab7",
            color: "white",
            padding: "30px",
            borderRadius: "10px",
            textAlign: "center"
          }}
        >

          <h2>📊 Total Jobs</h2>

          <h1>
            {totalJobs}
          </h1>

          <p>
            Jobs posted by you
          </p>

        </div>


        {/* =================================================
            Applications Card
        ================================================= */}

        <div
          style={{
            background: "#2196f3",
            color: "white",
            padding: "30px",
            borderRadius: "10px",
            textAlign: "center"
          }}
        >

          <h2>👥 Applications</h2>

          <h1>
            {totalApplications}
          </h1>

          <p>
            Total applications received
          </p>

        </div>


        {/* =================================================
            Selected Candidates Card
        ================================================= */}

        <div
          style={{
            background: "#009688",
            color: "white",
            padding: "30px",
            borderRadius: "10px",
            textAlign: "center"
          }}
        >

          <h2>✅ Selected Candidates</h2>

          <h1>
            {selectedCandidates}
          </h1>

          <p>
            Candidates selected
          </p>

        </div>


        {/* =================================================
            Interviews Card
        ================================================= */}

        <div
          style={{
            background: "#ff9800",
            color: "white",
            padding: "30px",
            borderRadius: "10px",
            textAlign: "center"
          }}
        >

          <h2>📅 Interviews</h2>

          <h1>
            {interviews}
          </h1>

          <p>
            Scheduled Interviews
          </p>

        </div>


        {/* =================================================
            NOTIFICATIONS CARD
        ================================================= */}

        <div
          style={{
            background: "#3f51b5",
            color: "white",
            padding: "30px",
            borderRadius: "10px",
            textAlign: "center",
            cursor: "pointer",
            position: "relative"
          }}
          onClick={() =>
            navigate("/recruiter/notifications")
          }
        >

          <h2>🔔 Notifications</h2>

          <h1>
            {notificationCount}
          </h1>

          <p>
            Unread notifications
          </p>

        </div>


        {/* =================================================
            Post Job
        ================================================= */}

        <div
          style={{
            background: "#1976d2",
            color: "white",
            padding: "30px",
            borderRadius: "10px",
            textAlign: "center",
            cursor: "pointer"
          }}

          onClick={() =>
            navigate("/post-job")
          }
        >

          <h2>➕ Post New Job</h2>

          <p>
            Create a new job opening
          </p>

        </div>


        {/* =================================================
            My Posted Jobs
        ================================================= */}

        <div
          style={{
            background: "#4caf50",
            color: "white",
            padding: "30px",
            borderRadius: "10px",
            textAlign: "center",
            cursor: "pointer"
          }}

          onClick={() =>
            navigate("/my-posted-jobs")
          }
        >

          <h2>📋 My Posted Jobs</h2>

          <p>
            Manage your jobs
          </p>

        </div>


        {/* =================================================
            Profile
        ================================================= */}

        <div
          style={{
            background: "#ff9800",
            color: "white",
            padding: "30px",
            borderRadius: "10px",
            textAlign: "center",
            cursor: "pointer"
          }}

          onClick={() =>
            navigate("/profile")
          }
        >

          <h2>👤 My Profile</h2>

          <p>
            Update profile details
          </p>

        </div>


        {/* =================================================
            Logout
        ================================================= */}

        <div
          style={{
            background: "#f44336",
            color: "white",
            padding: "30px",
            borderRadius: "10px",
            textAlign: "center",
            cursor: "pointer"
          }}

          onClick={() => {

            localStorage.removeItem(
              "isLoggedIn"
            );

            localStorage.removeItem(
              "user"
            );

            localStorage.removeItem(
              "token"
            );

            navigate("/login");

          }}
        >

          <h2>🚪 Logout</h2>

          <p>
            Sign out securely
          </p>

        </div>


      </div>


      {/* =================================================
          SELECTED CANDIDATES CHART
      ================================================= */}

      <div
        style={{
          marginTop: "40px",
          background: "#fff",
          padding: "20px",
          borderRadius: "10px"
        }}
      >

        <h2
          style={{
            textAlign: "center"
          }}
        >
          📈 Selected Candidates Chart
        </h2>


        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <BarChart
            data={chartData}
          >

            <XAxis
              dataKey="name"
            />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="candidates"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>


      {/* =================================================
          CANDIDATES / APPLICATION MANAGEMENT
      ================================================= */}

      <div
        style={{
          background: "#3f51b5",
          color: "white",
          padding: "30px",
          borderRadius: "10px",
          textAlign: "center",
          cursor: "pointer",
          marginTop: "20px"
        }}

        onClick={() =>
          navigate(
            "/recruiter/applications"
          )
        }

      >

        <h2>
          👥 Candidates
        </h2>

        <p>
          Manage Applications
        </p>

      </div>


    </div>

  );

}


export default RecruiterDashboard;