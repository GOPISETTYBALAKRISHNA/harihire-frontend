import { useState } from "react";
import api from "../axiosConfig";

function PostJob() {
  // =====================================================
  // INITIAL FORM
  // =====================================================

  const initialJob = {
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
    applyLink: "",
  };

  const [job, setJob] = useState(initialJob);
  const [loading, setLoading] = useState(false);

  // =====================================================
  // CATEGORY DATA
  // =====================================================

  const categoryData = {
    Software: {
      IT: [
        "Web Developer",
        "Java Developer",
        "Python Developer",
        "Full Stack Developer",
        "Frontend Developer",
        "Backend Developer",
        "Mobile App Developer",
        "Data Analyst",
        "Data Scientist/AI",
        "Cloud / DevOps",
        "Cyber Security",
        "Testing/QA",
        "Database/SQL",
        "UI/UX Designer",
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
        "Field Executive",
      ],
    },

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
        "Banking Executive",
      ],

      "Finance & Accounting": [
        "Accountant",
        "Financial Analyst",
        "Tax Analyst",
        "Audit Executive",
        "Finance Executive",
        "Accounts Executive",
        "Senior Accountant",
        "Payroll Executive",
      ],

      Insurance: [
        "Insurance Advisor",
        "Insurance Executive",
        "Claims Executive",
        "Insurance Manager",
        "Relationship Executive",
      ],
    },

    Government: {
      "Central Government": [
        "UPSC",
        "SSC",
        "Railway",
        "Defence",
        "Postal Jobs",
        "Central Police",
        "Other Central Government",
      ],

      "State Government": [
        "State APPSC",
        "Police",
        "Revenue Department",
        "Teaching Jobs",
        "Municipal Jobs",
        "State Health Department",
        "State Government Jobs",
      ],
    },

    BPO: {
      "BPO / Customer Support": [
        "Customer Support Executive",
        "Voice Process",
        "Non Voice Process",
        "Technical Support Executive",
        "Process Associate",
        "Back Office Executive",
        "Call Center Executive",
        "Customer Care Executive",
      ],

      Operations: [
        "Operations Executive",
        "Process Executive",
        "Operations Associate",
        "Team Leader",
        "Process Coordinator",
      ],
    },

    Healthcare: {
      Medical: [
        "Doctor",
        "Nurse",
        "Medical Officer",
        "Lab Technician",
        "Pharmacist",
        "Physiotherapist",
        "Medical Assistant",
      ],

      "Non Medical": [
        "Hospital Administrator",
        "Medical Billing Executive",
        "Healthcare Executive",
        "Hospital Receptionist",
        "Medical Coordinator",
      ],
    },

    Education: {
      Teaching: [
        "School Teacher",
        "College Lecturer",
        "Professor",
        "Online Tutor",
        "Subject Matter Expert",
        "Teaching Assistant",
      ],

      Administration: [
        "Academic Coordinator",
        "Education Counselor",
        "Admin Executive",
        "Admission Counselor",
        "Education Consultant",
      ],
    },

    Marketing: {
      "Digital Marketing": [
        "Digital Marketing Executive",
        "SEO Executive",
        "SEM Executive",
        "Social Media Manager",
        "Social Media Executive",
        "Content Marketing Executive",
        "Email Marketing Executive",
      ],

      "Sales & Marketing": [
        "Marketing Executive",
        "Sales Executive",
        "Business Development Executive",
        "Business Development Manager",
        "Sales Manager",
        "Marketing Manager",
      ],

      Content: [
        "Content Writer",
        "Copywriter",
        "Content Creator",
        "Technical Writer",
        "Blog Writer",
      ],
    },

    Engineering: {
      Mechanical: [
        "Mechanical Engineer",
        "Production Engineer",
        "Maintenance Engineer",
        "Design Engineer",
        "Quality Engineer",
      ],

      Civil: [
        "Civil Engineer",
        "Site Engineer",
        "Structural Engineer",
        "Construction Engineer",
        "Quantity Surveyor",
      ],

      Electrical: [
        "Electrical Engineer",
        "Electrical Design Engineer",
        "Maintenance Engineer",
        "Electrical Technician",
      ],

      Electronics: [
        "Electronics Engineer",
        "Embedded Engineer",
        "Hardware Engineer",
        "Electronics Technician",
      ],
    },

    HR: {
      Recruitment: [
        "HR Recruiter",
        "IT Recruiter",
        "Non IT Recruiter",
        "Talent Acquisition Executive",
        "Talent Acquisition Manager",
      ],

      "Human Resources": [
        "HR Executive",
        "HR Manager",
        "HR Generalist",
        "Payroll Executive",
        "Employee Relations Executive",
      ],
    },
  };

  // =====================================================
  // DROPDOWN DATA
  // =====================================================

  const categories = Object.keys(categoryData);

  const jobTypes = [
    "Full Time",
    "Part Time",
    "Contract",
    "Internship",
  ];

  const experienceLevels = [
    "Fresher",
    "0-1 Years",
    "1-3 Years",
    "3-5 Years",
    "5+ Years",
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
    "Any Degree",
  ];

  // =====================================================
  // CATEGORY CHANGE
  // =====================================================

  const handleCategoryChange = (event) => {
    const category = event.target.value;

    setJob((previous) => ({
      ...previous,
      category,
      subCategory: "",
      jobCategory: "",
    }));
  };

  // =====================================================
  // SUB CATEGORY CHANGE
  // =====================================================

  const handleSubCategoryChange = (event) => {
    const subCategory = event.target.value;

    setJob((previous) => ({
      ...previous,
      subCategory,
      jobCategory: "",
    }));
  };

  // =====================================================
  // NORMAL FIELD CHANGE
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setJob((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // POST JOB
  // =====================================================

  const postJob = async (event) => {
    event.preventDefault();

    // ---------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------

    if (!job.jobTitle.trim()) {
      alert("Please enter Job Title");
      return;
    }

    if (!job.companyName.trim()) {
      alert("Please enter Company Name");
      return;
    }

    if (!job.category) {
      alert("Please select Job Category");
      return;
    }

    if (!job.subCategory) {
      alert("Please select Sub Category");
      return;
    }

    if (!job.jobCategory) {
      alert("Please select Job Role");
      return;
    }

    if (!job.jobType) {
      alert("Please select Job Type");
      return;
    }

    if (!job.location.trim()) {
      alert("Please enter Location");
      return;
    }

    if (!job.description.trim()) {
      alert("Please enter Job Description");
      return;
    }

    if (
      job.applyType === "EXTERNAL" &&
      !job.applyLink.trim()
    ) {
      alert("Please enter Company Careers URL");
      return;
    }

    // ---------------------------------------------------
    // SALARY VALIDATION
    // ---------------------------------------------------

    let salaryValue = 0;

    if (job.salary.trim() !== "") {
      salaryValue = Number(job.salary);

      if (
        Number.isNaN(salaryValue) ||
        salaryValue < 0
      ) {
        alert("Please enter a valid Salary");
        return;
      }
    }

    // ---------------------------------------------------
    // API
    // ---------------------------------------------------

    try {
      setLoading(true);

      const jobData = {
        jobTitle: job.jobTitle.trim(),
        companyName: job.companyName.trim(),

        category: job.category,
        subCategory: job.subCategory,
        jobCategory: job.jobCategory,

        jobType: job.jobType,

        location: job.location.trim(),

        salary: salaryValue,

        experience: job.experience,
        qualification: job.qualification,

        description: job.description.trim(),

        applyType: job.applyType,

        applyLink:
          job.applyType === "EXTERNAL"
            ? job.applyLink.trim()
            : "",
      };

      console.log(
        "POSTING JOB:",
        jobData
      );

      const response = await api.post(
        "/jobs/add",
        jobData
      );

      console.log(
        "POST JOB RESPONSE:",
        response.data
      );

      alert(
        "Job Posted Successfully!"
      );

      // -------------------------------------------------
      // RESET
      // -------------------------------------------------

      setJob({
        ...initialJob,
      });
    } catch (error) {
      console.error(
        "POST JOB ERROR:",
        error
      );

      let message =
        "Failed to Post Job";

      if (error.response) {
        console.error(
          "BACKEND RESPONSE:",
          error.response.data
        );

        if (
          typeof error.response.data ===
          "string"
        ) {
          message =
            error.response.data;
        } else if (
          `error.response.data?.message`
        ) {
          message =
            error.response.data.message;
        } else if (
          `error.response.data?.error`
        ) {
          message =
            error.response.data.error;
        } else {
          message =
            "Failed to Post Job. Status: " +
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
  // SUB CATEGORIES
  // =====================================================

  const subCategories =
    job.category &&
    categoryData[job.category]
      ? Object.keys(
          categoryData[job.category]
        )
      : [];

  // =====================================================
  // JOB ROLES
  // =====================================================

  const selectedSubCategoryData =
    job.category &&
    job.subCategory &&
    categoryData[job.category]
      ? categoryData[job.category][
          job.subCategory
        ]
      : [];

  const jobRoles = Array.isArray(
    selectedSubCategoryData
  )
    ? selectedSubCategoryData
    : [];

  // =====================================================
  // UI
  // =====================================================

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* HEADER */}

        <div style={styles.header}>
          <div style={styles.headerIcon}>
            💼
          </div>

          <h1 style={styles.title}>
            Post a New Job
          </h1>

          <p style={styles.subtitle}>
            Create a professional job posting
            and reach the right candidates.
          </p>
        </div>

        {/* BASIC INFORMATION */}

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            📋 Basic Job Information
          </h2>

          <div style={styles.grid}>

            {/* JOB TITLE */}

            <div style={styles.field}>
              <label style={styles.label}>
                Job Title *
              </label>

              <input
                type="text"
                name="jobTitle"
                placeholder="e.g. Back Office Executive"
                value={job.jobTitle}
                onChange={handleChange}
                style={styles.input}
                disabled={loading}
              />
            </div>

            {/* COMPANY */}

            <div style={styles.field}>
              <label style={styles.label}>
                Company Name *
              </label>

              <input
                type="text"
                name="companyName"
                placeholder="e.g. TCS"
                value={job.companyName}
                onChange={handleChange}
                style={styles.input}
                disabled={loading}
              />
            </div>

            {/* CATEGORY */}

            <div style={styles.field}>
              <label style={styles.label}>
                Job Category *
              </label>

              <select
                name="category"
                value={job.category}
                onChange={
                  handleCategoryChange
                }
                style={styles.select}
                disabled={loading}
              >
                <option value="">
                  Select Job Category
                </option>

                {categories.map(
                  (category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* SUB CATEGORY */}

            <div style={styles.field}>
              <label style={styles.label}>
                Job Sub-Category *
              </label>

              <select
                name="subCategory"
                value={job.subCategory}
                onChange={
                  handleSubCategoryChange
                }
                disabled={
                  !job.category ||
                  loading
                }
                style={{
                  ...styles.select,
                  backgroundColor:
                    !job.category
                      ? "#f3f4f6"
                      : "#ffffff",
                }}
              >
                <option value="">
                  {job.category
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
            </div>

            {/* JOB ROLE */}

            <div style={styles.field}>
              <label style={styles.label}>
                Job Role *
              </label>

              <select
                name="jobCategory"
                value={job.jobCategory}
                onChange={handleChange}
                disabled={
                  !job.subCategory ||
                  loading
                }
                style={{
                  ...styles.select,
                  backgroundColor:
                    !job.subCategory
                      ? "#f3f4f6"
                      : "#ffffff",
                }}
              >
                <option value="">
                  {job.subCategory
                    ? "Select Job Role"
                    : "Select Sub-Category First"}
                </option>

                {jobRoles.map(
                  (role) => (
                    <option
                      key={role}
                      value={role}
                    >
                      {role}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* JOB TYPE */}

            <div style={styles.field}>
              <label style={styles.label}>
                Job Type *
              </label>

              <select
                name="jobType"
                value={job.jobType}
                onChange={handleChange}
                style={styles.select}
                disabled={loading}
              >
                <option value="">
                  Select Job Type
                </option>

                {jobTypes.map(
                  (type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* LOCATION */}

            <div style={styles.field}>
              <label style={styles.label}>
                Location *
              </label>

              <input
                type="text"
                name="location"
                placeholder="e.g. Hyderabad"
                value={job.location}
                onChange={handleChange}
                style={styles.input}
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* REQUIREMENTS */}

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            🎓 Job Requirements
          </h2>

          <div style={styles.grid}>

            {/* EXPERIENCE */}

            <div style={styles.field}>
              <label style={styles.label}>
                Experience
              </label>

              <select
                name="experience"
                value={job.experience}
                onChange={handleChange}
                style={styles.select}
                disabled={loading}
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
            </div>

            {/* QUALIFICATION */}

            <div style={styles.field}>
              <label style={styles.label}>
                Qualification
              </label>

              <select
                name="qualification"
                value={job.qualification}
                onChange={handleChange}
                style={styles.select}
                disabled={loading}
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
            </div>

            {/* SALARY */}

            <div style={styles.field}>
              <label style={styles.label}>
                Salary
              </label>

              <input
                type="number"
                name="salary"
                min="0"
                placeholder="e.g. 600000"
                value={job.salary}
                onChange={handleChange}
                style={styles.input}
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            📝 Job Description
          </h2>

          <div style={styles.field}>
            <label style={styles.label}>
              Description *
            </label>

            <textarea
              name="description"
              placeholder="Describe the job responsibilities, skills required, and other important information..."
              value={job.description}
              onChange={handleChange}
              style={styles.textarea}
              rows={7}
              disabled={loading}
            />
          </div>
        </div>

        {/* APPLICATION DETAILS */}

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            📩 Application Details
          </h2>

          <div style={styles.field}>
            <label style={styles.label}>
              Application Type *
            </label>

            <select
              name="applyType"
              value={job.applyType}
              onChange={handleChange}
              style={styles.select}
              disabled={loading}
            >
              <option value="INTERNAL">
                Internal Apply
              </option>

              <option value="EXTERNAL">
                External Apply
              </option>
            </select>
          </div>

          {job.applyType ===
            "EXTERNAL" && (
            <div
              style={{
                ...styles.field,
                marginTop: "18px",
              }}
            >
              <label style={styles.label}>
                Company Careers URL *
              </label>

              <input
                type="url"
                name="applyLink"
                placeholder="https://company.com/careers"
                value={job.applyLink}
                onChange={handleChange}
                style={styles.input}
                disabled={loading}
              />
            </div>
          )}
        </div>

        {/* SUBMIT */}

        <div style={styles.submitArea}>
          <button
            type="button"
            onClick={postJob}
            disabled={loading}
            style={{
              ...styles.postButton,
              opacity: loading ? 0.7 : 1,
              cursor: loading
                ? "not-allowed"
                : "pointer",
            }}
          >
            {loading
              ? "Posting Job..."
              : "🚀 Post Job"}
          </button>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fb",
    padding: "40px 20px",
    boxSizing: "border-box",
  },

  container: {
    maxWidth: "1000px",
    margin: "0 auto",
  },

  header: {
    textAlign: "center",
    marginBottom: "35px",
  },

  headerIcon: {
    fontSize: "45px",
    marginBottom: "8px",
  },

  title: {
    margin: 0,
    color: "#1f2937",
    fontSize: "34px",
    fontWeight: "700",
  },

  subtitle: {
    marginTop: "10px",
    color: "#6b7280",
    fontSize: "16px",
  },

  section: {
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    padding: "28px",
    marginBottom: "24px",
    boxShadow:
      "0 3px 15px rgba(0,0,0,0.06)",
    border: "1px solid #e5e7eb",
  },

  sectionTitle: {
    marginTop: 0,
    marginBottom: "24px",
    color: "#1f2937",
    fontSize: "21px",
    borderBottom:
      "1px solid #eeeeee",
    paddingBottom: "14px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
  },

  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "8px",
  },

  input: {
    width: "100%",
    padding: "12px 14px",
    border:
      "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
  },

  select: {
    width: "100%",
    padding: "12px 14px",
    border:
      "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    boxSizing: "border-box",
    outline: "none",
  },

  textarea: {
    width: "100%",
    padding: "12px 14px",
    border:
      "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    resize: "vertical",
    boxSizing: "border-box",
    outline: "none",
    fontFamily: "inherit",
  },

  submitArea: {
    textAlign: "center",
    padding: "10px 0 30px",
  },

  postButton: {
    backgroundColor: "#1976d2",
    color: "#ffffff",
    border: "none",
    padding: "14px 45px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "700",
    boxShadow:
      "0 4px 12px rgba(25,118,210,0.25)",
  },
};

export default PostJob;