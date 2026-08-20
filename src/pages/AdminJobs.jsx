import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig";

function AdminJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddJob, setShowAddJob] = useState(false);

  // =====================================================
  // INITIAL FORM
  // =====================================================

  const initialForm = {
    jobTitle: "",
    companyName: "",
    category: "",
    subCategory: "",
    jobCategory: "",
    jobType: "",
    location: "",
    salary: "",
    experience: "",
    qualification: "",
    description: "",
    applyType: "INTERNAL",
    applyLink: ""
  };

  const [form, setForm] = useState(initialForm);

  // =====================================================
  // CATEGORY DATA
  // =====================================================

  const categoryData = {
    // ===================================================
    // SOFTWARE
    // ===================================================

    Software: {
      IT: [
        "web Developer",
        "Java Developer",
        "Python Developer",
        "Full Stack Developer",
        "Frontend Developer",
        "Backend Developer",
        "Mobile App Developer",
        "Data Analyst",
        "Data Science/AI",
        "Cloud /DevOps",
        "Cyber Security",
        "Testing/QA",
        "DATABASE/SQL",
        "UI/UX Designer"
      ],

      "Non IT": [
        "BPO / Customer Support",
        "Data Entry",
        "Back Office",
        "HR / Recruitment",
        "Sales",
        "Marketing",
        "Operations",
        "Finance & Accounting",
        "Banking",
        "Healthcare",
        "Teaching / Education",
        "Logistics",
        "Retail",
        "Field Executive"
      ]
    },

    // ===================================================
    // BANKING
    // ===================================================

    Banking: {
      Banking: [
        "Bank PO",
        "Bank Clerk",
        "SBI PO",
        "SBI Clerk",
        "IBPS PO",
        "IBPS Clerk",
        "Relationship Manager",
        "Credit Analyst",
        "Loan Officer",
        "Branch Manager",
        "Banking Executive"
      ],

      "Finance & Accounting": [
        "Accountant",
        "Financial Analyst",
        "Tax Analyst",
        "Audit Executive",
        "Finance Executive",
        "Accounts Executive",
        "Senior Accountant",
        "Payroll Executive"
      ],

      Insurance: [
        "Insurance Advisor",
        "Insurance Executive",
        "Claims Executive",
        "Insurance Manager",
        "Relationship Executive"
      ]
    },

    // ===================================================
    // GOVERNMENT
    // ===================================================

    Government: {
      "Central Government": [
        "UPSC",
        "SSC",
        "Railway",
        "Defence",
        "Postal Jobs",
        "Central Police",
        "Other Central Government"
      ],

      "State Government": [
        "State APPSC",
        "Police",
        "Revenue Department",
        "Teaching Jobs",
        "Municipal Jobs",
        "State Health Department",
        "State Government Jobs"
      ]
    },

    // ===================================================
    // BPO
    // ===================================================

    BPO: {
      "BPO / Customer Support": [
        "Customer Support Executive",
        "Voice Process",
        "Non Voice Process",
        "Technical Support Executive",
        "Process Associate",
        "Back Office Executive",
        "Call Center Executive",
        "Customer Care Executive"
      ],

      Operations: [
        "Operations Executive",
        "Process Executive",
        "Operations Associate",
        "Team Leader",
        "Process Coordinator"
      ]
    },

    // ===================================================
    // HEALTHCARE
    // ===================================================

    Healthcare: {
      Medical: [
        "Doctor",
        "Nurse",
        "Medical Officer",
        "Lab Technician",
        "Pharmacist",
        "Physiotherapist",
        "Medical Assistant"
      ],

      "Non Medical": [
        "Hospital Administrator",
        "Medical Billing Executive",
        "Healthcare Executive",
        "Hospital Receptionist",
        "Medical Coordinator"
      ]
    },

    // ===================================================
    // EDUCATION
    // ===================================================

    Education: {
      Teaching: [
        "School Teacher",
        "College Lecturer",
        "Professor",
        "Online Tutor",
        "Subject Matter Expert",
        "Teaching Assistant"
      ],

      Administration: [
        "Academic Coordinator",
        "Education Counselor",
        "Admin Executive",
        "Admission Counselor",
        "Education Consultant"
      ]
    },

    // ===================================================
    // MARKETING
    // ===================================================

    Marketing: {
      "Digital Marketing": [
        "Digital Marketing Executive",
        "SEO Executive",
        "SEM Executive",
        "Social Media Manager",
        "Social Media Executive",
        "Content Marketing Executive",
        "Email Marketing Executive"
      ],

      "Sales & Marketing": [
        "Marketing Executive",
        "Sales Executive",
        "Business Development Executive",
        "Business Development Manager",
        "Sales Manager",
        "Marketing Manager"
      ],

      Content: [
        "Content Writer",
        "Copywriter",
        "Content Creator",
        "Technical Writer",
        "Blog Writer"
      ]
    },

    // ===================================================
    // ENGINEERING
    // ===================================================

    Engineering: {
      Mechanical: [
        "Mechanical Engineer",
        "Production Engineer",
        "Maintenance Engineer",
        "Design Engineer",
        "Quality Engineer"
      ],

      Civil: [
        "Civil Engineer",
        "Site Engineer",
        "Structural Engineer",
        "Construction Engineer",
        "Quantity Surveyor"
      ],

      Electrical: [
        "Electrical Engineer",
        "Electrical Design Engineer",
        "Maintenance Engineer",
        "Electrical Technician"
      ],

      Electronics: [
        "Electronics Engineer",
        "Embedded Engineer",
        "Hardware Engineer",
        "Electronics Technician"
      ]
    },

    // ===================================================
    // HR
    // ===================================================

    HR: {
      Recruitment: [
        "HR Recruiter",
        "IT Recruiter",
        "Non IT Recruiter",
        "Talent Acquisition Executive",
        "Talent Acquisition Manager"
      ],

      "Human Resources": [
        "HR Executive",
        "HR Manager",
        "HR Generalist",
        "Payroll Executive",
        "Employee Relations Executive"
      ]
    }
  };

  // =====================================================
  // DROPDOWN DATA
  // =====================================================

  const categories = Object.keys(categoryData);

  const jobTypes = [
    "Full Time",
    "Part Time",
    "Contract",
    "Internship"
  ];

  const experienceLevels = [
    "Fresher",
    "0-1 Years",
    "1-3 Years",
    "3-5 Years",
    "5+ Years"
  ];

  const qualifications = [
    "Any Qualification",
    "10th",
    "12th",
    "ITI",
    "Diploma",
    "B.Tech",
    "B.E",
    "BCA",
    "B.Sc",
    "B.Com",
    "BBA",
    "BA",
    "M.Tech",
    "MCA",
    "M.Sc",
    "MBA",
    "M.Com",
    "MA",
    "Any Degree"
  ];

  // =====================================================
  // GET SUB CATEGORIES
  // =====================================================

  const subCategories =
    form.category && categoryData[form.category]
      ? Object.keys(categoryData[form.category])
      : [];

  // =====================================================
  // GET JOB ROLES
  // =====================================================

  const jobRoles =
    form.category &&
    form.subCategory &&
    categoryData[form.category] &&
    categoryData[form.category][form.subCategory]
      ? categoryData[form.category][form.subCategory]
      : [];

  // =====================================================
  // LOAD JOBS
  // =====================================================

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);

      const response = await api.get("/jobs");

      console.log("JOBS RESPONSE:", response.data);

      if (Array.isArray(response.data)) {
        setJobs(response.data);
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.error("LOAD JOBS ERROR:", error);

      if (error.response) {
        console.error(
          "BACKEND RESPONSE:",
          error.response.data
        );
      }

      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // NORMAL INPUT CHANGE
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // =====================================================
  // CATEGORY CHANGE
  // =====================================================

  const handleCategoryChange = (event) => {
    const category = event.target.value;

    setForm((prev) => ({
      ...prev,
      category: category,
      subCategory: "",
      jobCategory: ""
    }));
  };

  // =====================================================
  // SUB CATEGORY CHANGE
  // =====================================================

  const handleSubCategoryChange = (event) => {
    const subCategory = event.target.value;

    setForm((prev) => ({
      ...prev,
      subCategory: subCategory,
      jobCategory: ""
    }));
  };

  // =====================================================
  // ADD JOB
  // =====================================================

  const addJob = async (event) => {
    event.preventDefault();

    if (!form.jobTitle.trim()) {
      alert("Please enter Job Title");
      return;
    }

    if (!form.companyName.trim()) {
      alert("Please enter Company Name");
      return;
    }

    if (!form.category) {
      alert("Please select Job Category");
      return;
    }

    if (!form.subCategory) {
      alert("Please select Sub Category");
      return;
    }

    if (!form.jobCategory) {
      alert("Please select Job Role");
      return;
    }

    if (!form.jobType) {
      alert("Please select Job Type");
      return;
    }

    if (!form.location.trim()) {
      alert("Please enter Location");
      return;
    }

    if (!form.description.trim()) {
      alert("Please enter Description");
      return;
    }

    if (
      form.applyType === "EXTERNAL" &&
      !form.applyLink.trim()
    ) {
      alert("Please enter Company Careers URL");
      return;
    }

    try {
      setLoading(true);

      const jobData = {
        jobTitle: form.jobTitle.trim(),
        companyName: form.companyName.trim(),
        location: form.location.trim(),

        salary:
          form.salary.trim() === ""
            ? 0
            : Number(form.salary),

        description: form.description.trim(),

        jobType: form.jobType,

        category: form.category,
        subCategory: form.subCategory,
        jobCategory: form.jobCategory,

        experience: form.experience,
        qualification: form.qualification,

        applyType: form.applyType,

        applyLink:
          form.applyType === "EXTERNAL"
            ? form.applyLink.trim()
            : "",

        recruiterId: null,
        recruiterName: "Admin"
      };

      console.log("ADMIN JOB DATA:", jobData);

      const response = await api.post(
        "/admin/jobs/add",
        jobData
      );

      console.log(
        "ADD JOB RESPONSE:",
        response.data
      );

      alert("Job Added Successfully!");

      setForm({
        ...initialForm
      });

      setShowAddJob(false);

      await loadJobs();
    } catch (error) {
      console.error("ADD JOB ERROR:", error);

      let message = "Failed to add job";

      if (error.response) {
        console.error(
          "BACKEND RESPONSE:",
          error.response.data
        );

        if (
          error.response.data &&
          error.response.data.message
        ) {
          message = error.response.data.message;
        } else if (
          error.response.data &&
          error.response.data.error
        ) {
          message = error.response.data.error;
        } else {
          message =
            "Failed to add job. Status: " +
            error.response.status;
        }
      } else if (error.message) {
        message = error.message;
      }

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // APPROVE JOB
  // =====================================================

  const approveJob = async (id) => {
    try {
      await api.put(
        "/admin/jobs/" + id + "/status",
        null,
        {
          params: {
            status: "APPROVED"
          }
        }
      );

      alert("Job Approved");

      await loadJobs();
    } catch (error) {
      console.error("APPROVE ERROR:", error);
      alert("Failed to approve job");
    }
  };

  // =====================================================
  // REJECT JOB
  // =====================================================

  const rejectJob = async (id) => {
    try {
      await api.put(
        "/admin/jobs/" + id + "/status",
        null,
        {
          params: {
            status: "REJECTED"
          }
        }
      );

      alert("Job Rejected");

      await loadJobs();
    } catch (error) {
      console.error("REJECT ERROR:", error);
      alert("Failed to reject job");
    }
  };

  // =====================================================
  // DELETE JOB
  // =====================================================

  const deleteJob = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this job?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(
        "/admin/jobs/" + id
      );

      alert("Job Deleted");

      await loadJobs();
    } catch (error) {
      console.error("DELETE ERROR:", error);
      alert("Failed to delete job");
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading && jobs.length === 0) {
    return (
      <div style={centerStyle}>
        <h2>Loading Jobs...</h2>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div style={pageStyle}>

      {/* =================================================
          HEADER
      ================================================= */}

      <div style={headerStyle}>
        <h1>Admin Job Management</h1>

        <div>
          <button
            type="button"
            style={addButton}
            onClick={() =>
              setShowAddJob(!showAddJob)
            }
          >
            {showAddJob
              ? "Close"
              : "+ Add Job"}
          </button>

          <button
            type="button"
            style={dashboardButton}
            onClick={() =>
              navigate("/admin/dashboard")
            }
          >
            Dashboard
          </button>
        </div>
      </div>

      {/* =================================================
          ADD JOB FORM
      ================================================= */}

      {showAddJob && (
        <div style={formBox}>

          <h2>Add New Job</h2>

          <form onSubmit={addJob}>

            {/* JOB TITLE */}

            <label style={labelStyle}>
              Job Title *
            </label>

            <input
              type="text"
              name="jobTitle"
              style={inputStyle}
              placeholder="e.g. Back Office Executive"
              value={form.jobTitle}
              onChange={handleChange}
            />

            {/* COMPANY */}

            <label style={labelStyle}>
              Company Name *
            </label>

            <input
              type="text"
              name="companyName"
              style={inputStyle}
              placeholder="e.g. TCS"
              value={form.companyName}
              onChange={handleChange}
            />

            {/* CATEGORY */}

            <label style={labelStyle}>
              Job Category *
            </label>

            <select
              name="category"
              style={selectStyle}
              value={form.category}
              onChange={handleCategoryChange}
            >
              <option value="">
                Select Job Category
              </option>

              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </select>

            {/* SUB CATEGORY */}

            <label style={labelStyle}>
              Job Sub-Category *
            </label>

            <select
              name="subCategory"
              style={{
                ...selectStyle,
                backgroundColor:
                  !form.category
                    ? "#f3f4f6"
                    : "#ffffff"
              }}
              value={form.subCategory}
              onChange={handleSubCategoryChange}
              disabled={!form.category}
            >
              <option value="">
                {form.category
                  ? "Select Sub-Category"
                  : "Select Category First"}
              </option>

              {subCategories.map(
                (subCategory) => (
                  <option
                    key={subCategory}
                    value={subCategory}
                  >
                    {subCategory}
                  </option>
                )
              )}
            </select>

            {/* JOB ROLE */}

            <label style={labelStyle}>
              Job Role *
            </label>

            <select
              name="jobCategory"
              style={{
                ...selectStyle,
                backgroundColor:
                  !form.subCategory
                    ? "#f3f4f6"
                    : "#ffffff"
              }}
              value={form.jobCategory}
              onChange={handleChange}
              disabled={!form.subCategory}
            >
              <option value="">
                {form.subCategory
                  ? "Select Job Role"
                  : "Select Sub-Category First"}
              </option>

              {jobRoles.map((role) => (
                <option
                  key={role}
                  value={role}
                >
                  {role}
                </option>
              ))}
            </select>

            {/* JOB TYPE */}

            <label style={labelStyle}>
              Job Type *
            </label>

            <select
              name="jobType"
              style={selectStyle}
              value={form.jobType}
              onChange={handleChange}
            >
              <option value="">
                Select Job Type
              </option>

              {jobTypes.map((type) => (
                <option
                  key={type}
                  value={type}
                >
                  {type}
                </option>
              ))}
            </select>

            {/* LOCATION */}

            <label style={labelStyle}>
              Location *
            </label>

            <input
              type="text"
              name="location"
              style={inputStyle}
              placeholder="e.g. Hyderabad"
              value={form.location}
              onChange={handleChange}
            />

            {/* SALARY */}

            <label style={labelStyle}>
              Salary
            </label>

            <input
              type="number"
              name="salary"
              style={inputStyle}
              placeholder="e.g. 600000"
              value={form.salary}
              onChange={handleChange}
            />

            {/* EXPERIENCE */}

            <label style={labelStyle}>
              Experience
            </label>

            <select
              name="experience"
              style={selectStyle}
              value={form.experience}
              onChange={handleChange}
            >
              <option value="">
                Select Experience
              </option>

              {experienceLevels.map(
                (experience) => (
                  <option
                    key={experience}
                    value={experience}
                  >
                    {experience}
                  </option>
                )
              )}
            </select>

            {/* QUALIFICATION */}

            <label style={labelStyle}>
              Qualification
            </label>

            <select
              name="qualification"
              style={selectStyle}
              value={form.qualification}
              onChange={handleChange}
            >
              <option value="">
                Select Qualification
              </option>

              {qualifications.map(
                (qualification) => (
                  <option
                    key={qualification}
                    value={qualification}
                  >
                    {qualification}
                  </option>
                )
              )}
            </select>

            {/* APPLY TYPE */}

            <label style={labelStyle}>
              Application Type *
            </label>

            <select
              name="applyType"
              style={selectStyle}
              value={form.applyType}
              onChange={handleChange}
            >
              <option value="INTERNAL">
                Internal Apply
              </option>

              <option value="EXTERNAL">
                External Apply
              </option>
            </select>

            {/* EXTERNAL URL */}

            {form.applyType === "EXTERNAL" && (
              <>
                <label style={labelStyle}>
                  Company Careers URL *
                </label>

                <input
                  type="url"
                  name="applyLink"
                  style={inputStyle}
                  placeholder="https://company.com/careers"
                  value={form.applyLink}
                  onChange={handleChange}
                />
              </>
            )}

            {/* DESCRIPTION */}

            <label style={labelStyle}>
              Description *
            </label>

            <textarea
              name="description"
              style={textareaStyle}
              placeholder="Describe the job responsibilities, skills required, and other important information..."
              value={form.description}
              onChange={handleChange}
            />

            {/* SUBMIT */}

            <button
              type="submit"
              style={submitButton}
              disabled={loading}
            >
              {loading
                ? "Adding Job..."
                : "Add Job"}
            </button>

          </form>
        </div>
      )}

      {/* =================================================
          JOB LIST
      ================================================= */}

      <h2>
        Total Jobs: {jobs.length}
      </h2>

      {jobs.length === 0 ? (
        <div style={emptyStyle}>
          <h3>No Jobs Found</h3>
        </div>
      ) : (
        jobs.map((job) => {
          const currentStatus = String(
            job.status || "PENDING"
          ).toUpperCase();

          return (
            <div
              key={job.id}
              style={jobCard}
            >

              <h2>
                {job.jobTitle}
              </h2>

              <p>
                <b>Company:</b>{" "}
                {job.companyName}
              </p>

              <p>
                <b>Location:</b>{" "}
                {job.location}
              </p>

              <p>
                <b>Salary:</b>{" "}
                {job.salary}
              </p>

              <p>
                <b>Job Type:</b>{" "}
                {job.jobType}
              </p>

              <p>
                <b>Category:</b>{" "}
                {job.category}
              </p>

              <p>
                <b>Sub Category:</b>{" "}
                {job.subCategory || "N/A"}
              </p>

              <p>
                <b>Job Role:</b>{" "}
                {job.jobCategory || "N/A"}
              </p>

              <p>
                <b>Experience:</b>{" "}
                {job.experience || "N/A"}
              </p>

              <p>
                <b>Qualification:</b>{" "}
                {job.qualification || "N/A"}
              </p>

              <p>
                <b>Apply Type:</b>{" "}
                {job.applyType || "INTERNAL"}
              </p>

              <p>
                <b>Recruiter:</b>{" "}
                {job.recruiterName || "Admin"}
              </p>

              <p>
                <b>Status:</b>{" "}
                {currentStatus}
              </p>

              {job.description && (
                <p>
                  <b>Description:</b>{" "}
                  {job.description}
                </p>
              )}

              <div style={actionsStyle}>

                {currentStatus !== "APPROVED" && (
                  <button
                    type="button"
                    style={approveButton}
                    onClick={() =>
                      approveJob(job.id)
                    }
                  >
                    Approve
                  </button>
                )}

                {currentStatus !== "REJECTED" && (
                  <button
                    type="button"
                    style={rejectButton}
                    onClick={() =>
                      rejectJob(job.id)
                    }
                  >
                    Reject
                  </button>
                )}

                <button
                  type="button"
                  style={deleteButton}
                  onClick={() =>
                    deleteJob(job.id)
                  }
                >
                  Delete
                </button>

              </div>
            </div>
          );
        })
      )}

    </div>
  );
}

// =====================================================
// STYLES
// =====================================================

const pageStyle = {
  minHeight: "100vh",
  padding: "30px",
  backgroundColor: "#f5f7fa",
  boxSizing: "border-box"
};

const centerStyle = {
  padding: "50px",
  textAlign: "center"
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "25px",
  flexWrap: "wrap",
  gap: "15px"
};

const addButton = {
  padding: "10px 18px",
  backgroundColor: "#28a745",
  color: "#ffffff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  marginRight: "10px"
};

const dashboardButton = {
  padding: "10px 18px",
  backgroundColor: "#1976d2",
  color: "#ffffff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const formBox = {
  backgroundColor: "#ffffff",
  padding: "25px",
  borderRadius: "10px",
  marginBottom: "25px",
  boxShadow:
    "0 2px 10px rgba(0,0,0,0.08)"
};

const labelStyle = {
  display: "block",
  fontSize: "14px",
  fontWeight: "600",
  color: "#374151",
  marginBottom: "7px"
};

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "12px",
  marginBottom: "16px",
  border: "1px solid #cccccc",
  borderRadius: "6px",
  boxSizing: "border-box",
  fontSize: "14px"
};

const selectStyle = {
  display: "block",
  width: "100%",
  padding: "12px",
  marginBottom: "16px",
  border: "1px solid #cccccc",
  borderRadius: "6px",
  boxSizing: "border-box",
  fontSize: "14px",
  backgroundColor: "#ffffff",
  cursor: "pointer"
};

const textareaStyle = {
  display: "block",
  width: "100%",
  padding: "12px",
  marginBottom: "16px",
  border: "1px solid #cccccc",
  borderRadius: "6px",
  boxSizing: "border-box",
  minHeight: "120px",
  resize: "vertical",
  fontFamily: "inherit",
  fontSize: "14px"
};

const submitButton = {
  padding: "12px 25px",
  backgroundColor: "#28a745",
  color: "#ffffff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600"
};

const jobCard = {
  backgroundColor: "#ffffff",
  padding: "20px",
  marginBottom: "15px",
  borderRadius: "10px",
  boxShadow:
    "0 2px 8px rgba(0,0,0,0.08)"
};

const actionsStyle = {
  display: "flex",
  gap: "10px",
  marginTop: "20px",
  flexWrap: "wrap"
};

const approveButton = {
  padding: "9px 16px",
  backgroundColor: "#28a745",
  color: "#ffffff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

const rejectButton = {
  padding: "9px 16px",
  backgroundColor: "#dc3545",
  color: "#ffffff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

const deleteButton = {
  padding: "9px 16px",
  backgroundColor: "#6c757d",
  color: "#ffffff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

const emptyStyle = {
  backgroundColor: "#ffffff",
  padding: "30px",
  textAlign: "center",
  borderRadius: "10px"
};

export default AdminJobs;