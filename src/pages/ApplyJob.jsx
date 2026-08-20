import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../axiosConfig";

function ApplyJob() {

  const { id } = useParams();
  const navigate = useNavigate();

  // =====================================================
  // STATES
  // =====================================================

  const [job, setJob] = useState(null);

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [checkingApplied, setCheckingApplied] = useState(true);

  const [alreadyApplied, setAlreadyApplied] = useState(false);

  const [form, setForm] = useState({
    applicantName: "",
    email: "",
    phone: ""
  });


  // =====================================================
  // GET LOGGED-IN USER
  // =====================================================

  const getUser = () => {

    try {

      const user =
        localStorage.getItem("user");

      if (!user) {
        return null;
      }

      return JSON.parse(user);

    } catch (error) {

      console.error(
        "User parse error:",
        error
      );

      return null;
    }
  };


  // =====================================================
  // LOAD JOB + USER + APPLICATION STATUS
  // =====================================================

  useEffect(() => {

    loadJob();
    loadUser();

  }, [id]);


  // =====================================================
  // LOAD JOB DETAILS
  // =====================================================

  const loadJob = async () => {

    try {

      setLoading(true);

      const response =
        await api.get(`/jobs/${id}`);

      setJob(response.data);

    } catch (error) {

      console.error(
        "Job loading error:",
        error
      );

      alert(
        "Unable to load job details."
      );

      navigate("/jobs");

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // LOAD USER DETAILS
  // =====================================================

  const loadUser = () => {

    const user = getUser();

    if (!user) {

      alert(
        "Please login to apply for this job."
      );

      navigate("/login");

      return;
    }


    setForm({

      applicantName:
        user.fullName || "",

      email:
        user.email || "",

      phone:
        user.phone || ""

    });


    // CHECK ALREADY APPLIED
    checkAlreadyApplied(user.id);

  };


  // =====================================================
  // CHECK ALREADY APPLIED
  // =====================================================

  const checkAlreadyApplied = async (userId) => {

    if (!userId || !id) {

      setCheckingApplied(false);

      return;
    }

    try {

      setCheckingApplied(true);

      const response =
        await api.get(
          `/applications/check/${userId}/${id}`
        );

      console.log(
        "Already Applied Response:",
        response.data
      );

      setAlreadyApplied(
        response.data === true
      );

    } catch (error) {

      console.error(
        "Already Applied Check Error:",
        error
      );

      /*
       * If check API fails, don't block the user.
       * User can still try to apply.
       */

      setAlreadyApplied(false);

    } finally {

      setCheckingApplied(false);

    }
  };


  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (event) => {

    const {
      name,
      value
    } = event.target;


    setForm((previous) => ({

      ...previous,

      [name]: value

    }));

  };


  // =====================================================
  // SUBMIT APPLICATION
  // =====================================================

  const handleSubmit = async (event) => {

    event.preventDefault();


    // =================================================
    // FRONTEND DUPLICATE CHECK
    // =================================================

    if (alreadyApplied) {

      alert(
        "You have already applied for this job. ✅"
      );

      return;
    }


    const user = getUser();


    // =================================================
    // LOGIN CHECK
    // =================================================

    if (!user || !user.id) {

      alert(
        "Please login again."
      );

      navigate("/login");

      return;
    }


    // =================================================
    // VALIDATION
    // =================================================

    if (
      !form.applicantName.trim()
    ) {

      alert(
        "Please enter your name."
      );

      return;
    }


    if (
      !form.email.trim()
    ) {

      alert(
        "Please enter your email."
      );

      return;
    }


    if (
      !form.phone.trim()
    ) {

      alert(
        "Please enter your mobile number."
      );

      return;
    }


    // =================================================
    // MOBILE VALIDATION
    // =================================================

    const phonePattern =
      /^[6-9]\d{9}$/;


    if (
      !phonePattern.test(
        form.phone.trim()
      )
    ) {

      alert(
        "Please enter a valid 10-digit mobile number."
      );

      return;
    }


    // =================================================
    // EMAIL VALIDATION
    // =================================================

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (
      !emailPattern.test(
        form.email.trim()
      )
    ) {

      alert(
        "Please enter a valid email address."
      );

      return;
    }


    try {

      setSubmitting(true);


      // =================================================
      // APPLICATION OBJECT
      // =================================================

      const application = {

        jobId:
          job.id,

        userId:
          user.id,

        recruiterId:
          job.recruiterId || null,

        applicantName:
          form.applicantName.trim(),

        email:
          form.email.trim(),

        phone:
          form.phone.trim(),

        status:
          "APPLIED",

        jobTitle:
          job.jobTitle,

        companyName:
          job.companyName

      };


      console.log(
        "Submitting Application:",
        application
      );


      // =================================================
      // API CALL
      // =================================================

      await api.post(
        "/applications/apply",
        application
      );


      // =================================================
      // UPDATE STATE
      // =================================================

      setAlreadyApplied(true);


      // =================================================
      // SUCCESS
      // =================================================

      alert(
        "Application submitted successfully! 🎉"
      );


      navigate(
        "/my-applications"
      );


    } catch (error) {

      console.error(
        "Application submit error:",
        error
      );


      if (error.response) {

        console.error(
          "Status:",
          error.response.status
        );

        console.error(
          "Response:",
          error.response.data
        );

      }


      // =================================================
      // DUPLICATE APPLICATION
      // =================================================

      if (
        error.response &&
        (
          error.response.status === 409 ||
          error.response.status === 400
        )
      ) {

        setAlreadyApplied(true);

        alert(
          "You have already applied for this job. ✅"
        );

        return;
      }


      // =================================================
      // AUTH ERRORS
      // =================================================

      if (
        error.response &&
        error.response.status === 401
      ) {

        alert(
          "Session expired. Please login again."
        );

        navigate("/login");

      } else if (
        error.response &&
        error.response.status === 403
      ) {

        alert(
          "You are not authorized to apply."
        );

      } else {

        alert(
          "Unable to submit application. Please try again."
        );

      }

    } finally {

      setSubmitting(false);

    }

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading || checkingApplied) {

    return (

      <div style={styles.center}>

        <h2>
          Loading...
        </h2>

        <p>
          Checking application status.
        </p>

      </div>

    );

  }


  // =====================================================
  // JOB NOT FOUND
  // =====================================================

  if (!job) {

    return (

      <div style={styles.center}>

        <h2>
          Job not found.
        </h2>


        <button
          type="button"
          onClick={() =>
            navigate("/jobs")
          }
          style={styles.button}
        >
          Back to Jobs
        </button>

      </div>

    );

  }


  // =====================================================
  // MAIN UI
  // =====================================================

  return (

    <div style={styles.page}>

      <div style={styles.card}>

        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <button
          type="button"
          onClick={() =>
            navigate(-1)
          }
          style={styles.backButton}
        >
          ← Back
        </button>


        {/* =================================================
            TITLE
        ================================================= */}

        <h1 style={styles.title}>
          Apply for Job
        </h1>


        <p style={styles.subtitle}>
          {alreadyApplied
            ? "Application status"
            : "Enter your details to apply for this job."}
        </p>


        {/* =================================================
            JOB INFORMATION
        ================================================= */}

        <div style={styles.jobInfo}>

          <h2 style={styles.jobTitle}>
            {job.jobTitle ||
              "Job Title"}
          </h2>


          <p style={styles.jobDetail}>
            🏢{" "}
            <strong>
              Company:
            </strong>{" "}
            {job.companyName ||
              "Not specified"}
          </p>


          <p style={styles.jobDetail}>
            📍{" "}
            <strong>
              Location:
            </strong>{" "}
            {job.location ||
              "Not specified"}
          </p>


          {job.jobType && (

            <p style={styles.jobDetail}>
              💼{" "}
              <strong>
                Job Type:
              </strong>{" "}
              {job.jobType}
            </p>

          )}

        </div>


        {/* =================================================
            ALREADY APPLIED
        ================================================= */}

        {alreadyApplied ? (

          <div style={styles.alreadyAppliedBox}>

            <div style={styles.successIcon}>
              ✓
            </div>

            <h2 style={styles.alreadyAppliedTitle}>
              Already Applied
            </h2>

            <p style={styles.alreadyAppliedText}>
              You have already submitted an
              application for this job.
            </p>

            <p style={styles.alreadyAppliedSubText}>
              You cannot apply for the same job
              more than once.
            </p>


            <button
              type="button"
              onClick={() =>
                navigate("/my-applications")
              }
              style={styles.viewApplicationButton}
            >
              View My Applications
            </button>

          </div>

        ) : (

          /* =================================================
              APPLICATION FORM
          ================================================= */

          <form
            onSubmit={handleSubmit}
          >

            {/* =================================================
                FULL NAME
            ================================================= */}

            <div style={styles.field}>

              <label style={styles.label}>
                Full Name
              </label>


              <input
                type="text"
                name="applicantName"
                value={
                  form.applicantName
                }
                onChange={
                  handleChange
                }
                placeholder="Enter your full name"
                style={styles.input}
                autoComplete="name"
              />

            </div>


            {/* =================================================
                EMAIL
            ================================================= */}

            <div style={styles.field}>

              <label style={styles.label}>
                Email
              </label>


              <input
                type="email"
                name="email"
                value={
                  form.email
                }
                onChange={
                  handleChange
                }
                placeholder="Enter your email address"
                style={styles.input}
                autoComplete="email"
              />

            </div>


            {/* =================================================
                MOBILE NUMBER
            ================================================= */}

            <div style={styles.field}>

              <label style={styles.label}>
                Mobile Number
              </label>


              <input
                type="tel"
                name="phone"
                value={
                  form.phone
                }
                onChange={(event) => {

                  const value =
                    event.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10);

                  setForm(
                    (previous) => ({

                      ...previous,

                      phone: value

                    })
                  );

                }}
                placeholder="Enter 10-digit mobile number"
                style={styles.input}
                maxLength="10"
                autoComplete="tel"
              />

            </div>


            {/* =================================================
                INFORMATION
            ================================================= */}

            <div style={styles.infoBox}>

              <span>
                ℹ️
              </span>

              <p>
                Please make sure your
                name, email and mobile
                number are correct before
                submitting your application.
              </p>

            </div>


            {/* =================================================
                SUBMIT BUTTON
            ================================================= */}

            <button
              type="submit"
              disabled={submitting}
              style={{
                ...styles.submitButton,

                opacity:
                  submitting
                    ? 0.7
                    : 1,

                cursor:
                  submitting
                    ? "not-allowed"
                    : "pointer"
              }}
            >

              {submitting
                ? "Submitting..."
                : "Submit Application"}

            </button>


          </form>

        )}

      </div>

    </div>

  );
}


// =====================================================
// STYLES
// =====================================================

const styles = {

  page: {

    minHeight:
      "100vh",

    backgroundColor:
      "#f5f7fb",

    padding:
      "40px 20px",

    boxSizing:
      "border-box"

  },


  card: {

    maxWidth:
      "700px",

    margin:
      "0 auto",

    backgroundColor:
      "#ffffff",

    padding:
      "30px",

    borderRadius:
      "12px",

    boxShadow:
      "0 3px 15px rgba(0,0,0,0.08)",

    boxSizing:
      "border-box"

  },


  backButton: {

    backgroundColor:
      "#ffffff",

    color:
      "#1976d2",

    border:
      "1px solid #1976d2",

    padding:
      "9px 16px",

    borderRadius:
      "6px",

    cursor:
      "pointer",

    fontWeight:
      "600",

    marginBottom:
      "20px"

  },


  title: {

    margin:
      "0",

    color:
      "#1f2937",

    fontSize:
      "30px"

  },


  subtitle: {

    color:
      "#6b7280",

    marginTop:
      "8px",

    marginBottom:
      "25px"

  },


  jobInfo: {

    backgroundColor:
      "#f5f7fb",

    padding:
      "20px",

    borderRadius:
      "8px",

    marginBottom:
      "28px",

    border:
      "1px solid #eeeeee"

  },


  jobTitle: {

    marginTop:
      "0",

    marginBottom:
      "15px",

    color:
      "#1f2937",

    fontSize:
      "22px"

  },


  jobDetail: {

    margin:
      "8px 0",

    color:
      "#555",

    fontSize:
      "14px"

  },


  field: {

    marginBottom:
      "20px"

  },


  label: {

    display:
      "block",

    marginBottom:
      "8px",

    color:
      "#1f2937",

    fontWeight:
      "600",

    fontSize:
      "15px"

  },


  input: {

    width:
      "100%",

    boxSizing:
      "border-box",

    padding:
      "13px",

    border:
      "1px solid #d1d5db",

    borderRadius:
      "7px",

    fontSize:
      "15px",

    outline:
      "none"

  },


  infoBox: {

    display:
      "flex",

    gap:
      "10px",

    alignItems:
      "flex-start",

    backgroundColor:
      "#e3f2fd",

    color:
      "#1565c0",

    padding:
      "12px 15px",

    borderRadius:
      "7px",

    marginBottom:
      "22px",

    fontSize:
      "13px"

  },


  submitButton: {

    width:
      "100%",

    backgroundColor:
      "#1976d2",

    color:
      "#ffffff",

    border:
      "none",

    padding:
      "14px",

    borderRadius:
      "7px",

    fontSize:
      "16px",

    fontWeight:
      "600"

  },


  // =====================================================
  // ALREADY APPLIED STYLES
  // =====================================================

  alreadyAppliedBox: {

    textAlign:
      "center",

    backgroundColor:
      "#f1f8f4",

    border:
      "1px solid #c8e6c9",

    borderRadius:
      "12px",

    padding:
      "35px 25px",

    marginTop:
      "10px"

  },


  successIcon: {

    width:
      "60px",

    height:
      "60px",

    borderRadius:
      "50%",

    backgroundColor:
      "#2e7d32",

    color:
      "#ffffff",

    display:
      "flex",

    justifyContent:
      "center",

    alignItems:
      "center",

    margin:
      "0 auto 15px",

    fontSize:
      "35px",

    fontWeight:
      "bold"

  },


  alreadyAppliedTitle: {

    margin:
      "0 0 10px",

    color:
      "#2e7d32",

    fontSize:
      "25px"

  },


  alreadyAppliedText: {

    color:
      "#444",

    fontSize:
      "16px",

    margin:
      "8px 0"

  },


  alreadyAppliedSubText: {

    color:
      "#777",

    fontSize:
      "14px",

    marginBottom:
      "22px"

  },


  viewApplicationButton: {

    backgroundColor:
      "#1976d2",

    color:
      "#ffffff",

    border:
      "none",

    padding:
      "11px 20px",

    borderRadius:
      "7px",

    cursor:
      "pointer",

    fontWeight:
      "600",

    fontSize:
      "14px"

  },


  button: {

    backgroundColor:
      "#1976d2",

    color:
      "#ffffff",

    border:
      "none",

    padding:
      "10px 18px",

    borderRadius:
      "6px",

    cursor:
      "pointer"

  },


  center: {

    minHeight:
      "70vh",

    display:
      "flex",

    flexDirection:
      "column",

    justifyContent:
      "center",

    alignItems:
      "center",

    textAlign:
      "center"

  }

};


export default ApplyJob;