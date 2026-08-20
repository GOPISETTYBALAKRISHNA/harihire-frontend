import { useEffect, useState } from "react";
import api from "../axiosConfig";
import AdBanner from "../components/AdBanner";

function Profile() {

  // =====================================================
  // INITIAL USER STATE
  // =====================================================

  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    education: "",
    skills: "",
    experience: "",
    about: "",
    resume: "",
  });

  // =====================================================
  // STATES
  // =====================================================

  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // =====================================================
  // LOGGED IN USER
  // =====================================================

  const loggedInUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  // =====================================================
  // LOAD PROFILE
  // =====================================================

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {

    if (!loggedInUser || !loggedInUser.id) {
      setLoading(false);
      setErrorMessage("Please login to view your profile.");
      return;
    }

    try {

      setLoading(true);

      const response = await api.get(
        `/users/profile/${loggedInUser.id}`
      );

      const data = response.data;

      setUser({
        fullName: data.fullName || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        education: data.education || "",
        skills: data.skills || "",
        experience: data.experience || "",
        about: data.about || "",
        resume: data.resume || "",
      });

    } catch (error) {

      console.error("Profile Loading Error:", error);

      if (`error.response?.status === 403`) {
        setErrorMessage(
          "Session expired. Please login again."
        );
      } else {
        setErrorMessage(
          "Unable to load profile details."
        );
      }

    } finally {

      setLoading(false);

    }
  };

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (event) => {

    const { name, value } = event.target;

    setUser((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
    setErrorMessage("");
  };

  // =====================================================
  // PHONE CHANGE
  // =====================================================

  const handlePhoneChange = (event) => {

    const value = event.target.value
      .replace(/\D/g, "")
      .slice(0, 10);

    setUser((previous) => ({
      ...previous,
      phone: value,
    }));

    setMessage("");
    setErrorMessage("");
  };

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const updateProfile = async () => {

    if (!loggedInUser || !loggedInUser.id) {
      setErrorMessage(
        "Please login again to update your profile."
      );
      return;
    }

    // Full name validation
    if (!user.fullName.trim()) {
      setErrorMessage(
        "Please enter your full name."
      );
      return;
    }

    // Phone validation
    if (!user.phone.trim()) {
      setErrorMessage(
        "Please enter your mobile number."
      );
      return;
    }

    const phonePattern = /^[6-9]\d{9}$/;

    if (!phonePattern.test(user.phone.trim())) {
      setErrorMessage(
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    try {

      setSaving(true);
      setMessage("");
      setErrorMessage("");

      await api.put(
        `/users/profile/${loggedInUser.id}`,
        user
      );

      // =================================================
      // UPDATE LOCAL STORAGE
      // =================================================

      try {

        const storedUser = JSON.parse(
          localStorage.getItem("user") || "{}"
        );

        const updatedStoredUser = {
          ...storedUser,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
        };

        localStorage.setItem(
          "user",
          JSON.stringify(updatedStoredUser)
        );

      } catch (storageError) {

        console.log(
          "Local storage update error:",
          storageError
        );
      }

      setMessage(
        "Profile updated successfully!"
      );

    } catch (error) {

      console.error(
        "Profile Update Error:",
        error
      );

      if (`error.response?.status === 403`) {

        setErrorMessage(
          "Session expired. Please login again."
        );

      } else {

        setErrorMessage(
          "Unable to update profile. Please try again."
        );

      }

    } finally {

      setSaving(false);

    }
  };

  // =====================================================
  // RESUME FILE SELECT
  // =====================================================

  const handleResumeChange = (event) => {

    // IMPORTANT:
    // Actual File object
    const file = `event.target.files?.[0]`;

    if (!file) {

      setResumeFile(null);
      return;

    }

    // =================================================
    // ALLOWED FILE TYPES
    // =================================================

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {

      setErrorMessage(
        "Please select a PDF, DOC or DOCX file."
      );

      event.target.value = "";
      setResumeFile(null);

      return;
    }

    // =================================================
    // FILE SIZE - 5 MB
    // =================================================

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {

      setErrorMessage(
        "Resume file size must be less than 5 MB."
      );

      event.target.value = "";
      setResumeFile(null);

      return;
    }

    setResumeFile(file);

    setMessage("");
    setErrorMessage("");
  };

  // =====================================================
  // UPLOAD RESUME
  // =====================================================

  const uploadResume = async () => {

    if (!loggedInUser || !loggedInUser.id) {

      setErrorMessage(
        "Please login again."
      );

      return;
    }

    if (!resumeFile) {

      setErrorMessage(
        "Please select a resume file first."
      );

      return;
    }

    const formData = new FormData();

    formData.append("file", resumeFile);

    try {

      setUploadingResume(true);

      setMessage("");
      setErrorMessage("");

      await api.post(
        `/users/${loggedInUser.id}/upload-resume`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(
        "Resume uploaded successfully!"
      );

      setResumeFile(null);

      // Reload latest profile
      await loadProfile();

    } catch (error) {

      console.error(
        "Resume Upload Error:",
        error
      );

      if (`error.response?.status === 403`) {

        setErrorMessage(
          "Session expired. Please login again."
        );

      } else {

        setErrorMessage(
          "Resume upload failed. Please try again."
        );

      }

    } finally {

      setUploadingResume(false);

    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div style={styles.loadingPage}>

        <div style={styles.loadingCard}>

          <div style={styles.spinner}></div>

          <h3>Loading Profile...</h3>

          <p>Please wait.</p>

        </div>

      </div>
    );
  }

  // =====================================================
  // LOGIN REQUIRED
  // =====================================================

  if (!loggedInUser) {

    return (
      <div style={styles.loadingPage}>

        <div style={styles.loadingCard}>

          <div style={styles.loginIcon}>
            🔐
          </div>

          <h2>Login Required</h2>

          <p>
            Please login to view your profile.
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (

    <div style={styles.page}>

      {/* =================================================
          HEADER
      ================================================= */}

      <div style={styles.header}>

        <div style={styles.headerContent}>

          <div>

            <h1 style={styles.pageTitle}>
              My Profile
            </h1>

            <p style={styles.pageSubtitle}>
              Manage your personal and professional
              information
            </p>

          </div>

          <div style={styles.profileBadge}>

            <div style={styles.profileAvatar}>

              {user.fullName
                ? user.fullName
                    .charAt(0)
                    .toUpperCase()
                : "U"}

            </div>

            <div>

              <strong>
                {user.fullName || "User"}
              </strong>

              <small style={styles.profileBadgeSmall}>
                Job Seeker
              </small>

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          MAIN CONTAINER
      ================================================= */}

      <div style={styles.container}>

        {/* SUCCESS MESSAGE */}

        {message && (

          <div style={styles.successMessage}>

            <span style={styles.messageIcon}>
              ✓
            </span>

            <span>
              {message}
            </span>

          </div>

        )}

        {/* ERROR MESSAGE */}

        {errorMessage && (

          <div style={styles.errorMessage}>

            <span style={styles.messageIcon}>
              !
            </span>

            <span>
              {errorMessage}
            </span>

          </div>

        )}

        {/* =================================================
            PERSONAL INFORMATION
        ================================================= */}

        <div style={styles.card}>

          <div style={styles.sectionHeader}>

            <div style={styles.sectionIcon}>
              👤
            </div>

            <div>

              <h2 style={styles.sectionTitle}>
                Personal Information
              </h2>

              <p style={styles.sectionSubtitle}>
                Update your basic personal details
              </p>

            </div>

          </div>

          <div style={styles.formGrid}>

            {/* FULL NAME */}

            <div style={styles.field}>

              <label style={styles.label}>
                Full Name
              </label>

              <input
                type="text"
                name="fullName"
                value={user.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                style={styles.input}
              />

            </div>

            {/* EMAIL */}

            <div style={styles.field}>

              <label style={styles.label}>
                Email Address
              </label>

              <input
                type="email"
                value={user.email}
                disabled
                style={{
                  ...styles.input,
                  ...styles.disabledInput,
                }}
              />

              <small style={styles.helperText}>
                Email address cannot be changed here.
              </small>

            </div>

            {/* PHONE */}

            <div style={styles.field}>

              <label style={styles.label}>
                Mobile Number
              </label>

              <input
                type="tel"
                name="phone"
                value={user.phone}
                onChange={handlePhoneChange}
                placeholder="Enter 10-digit mobile number"
                maxLength={10}
                style={styles.input}
              />

            </div>

            {/* ADDRESS */}

            <div
              style={{
                ...styles.field,
                gridColumn: "1 / -1",
              }}
            >

              <label style={styles.label}>
                Address
              </label>

              <input
                type="text"
                name="address"
                value={user.address}
                onChange={handleChange}
                placeholder="Enter your address"
                style={styles.input}
              />

            </div>

            {/* CITY */}

            <div style={styles.field}>

              <label style={styles.label}>
                City
              </label>

              <input
                type="text"
                name="city"
                value={user.city}
                onChange={handleChange}
                placeholder="Enter your city"
                style={styles.input}
              />

            </div>

            {/* STATE */}

            <div style={styles.field}>

              <label style={styles.label}>
                State
              </label>

              <input
                type="text"
                name="state"
                value={user.state}
                onChange={handleChange}
                placeholder="Enter your state"
                style={styles.input}
              />

            </div>

          </div>

        </div>

        {/* =================================================
            PROFESSIONAL INFORMATION
        ================================================= */}

        <div style={styles.card}>

          <div style={styles.sectionHeader}>

            <div style={styles.sectionIcon}>
              💼
            </div>

            <div>

              <h2 style={styles.sectionTitle}>
                Professional Information
              </h2>

              <p style={styles.sectionSubtitle}>
                Add your education, skills and experience
              </p>

            </div>

          </div>

          <div style={styles.formGrid}>

            {/* EDUCATION */}

            <div style={styles.field}>

              <label style={styles.label}>
                Education
              </label>

              <input
                type="text"
                name="education"
                value={user.education}
                onChange={handleChange}
                placeholder="Example: MCA, B.Tech, BCA"
                style={styles.input}
              />

            </div>

            {/* EXPERIENCE */}

            <div style={styles.field}>

              <label style={styles.label}>
                Experience
              </label>

              <input
                type="text"
                name="experience"
                value={user.experience}
                onChange={handleChange}
                placeholder="Example: Fresher / 2 Years"
                style={styles.input}
              />

            </div>

            {/* SKILLS */}

            <div
              style={{
                ...styles.field,
                gridColumn: "1 / -1",
              }}
            >

              <label style={styles.label}>
                Skills
              </label>

              <input
                type="text"
                name="skills"
                value={user.skills}
                onChange={handleChange}
                placeholder="Example: Java, Python, SQL, React"
                style={styles.input}
              />

              <small style={styles.helperText}>
                Separate multiple skills using commas.
              </small>

            </div>

            {/* ABOUT */}

            <div
              style={{
                ...styles.field,
                gridColumn: "1 / -1",
              }}
            >

              <label style={styles.label}>
                About Me
              </label>

              <textarea
                name="about"
                value={user.about}
                onChange={handleChange}
                placeholder="Write a short professional introduction about yourself..."
                style={styles.textarea}
              />

              <small style={styles.helperText}>
                Keep your introduction professional and concise.
              </small>

            </div>

          </div>

        </div>

        {/* =================================================
            RESUME
        ================================================= */}

        <div style={styles.card}>

          <div style={styles.sectionHeader}>

            <div style={styles.sectionIcon}>
              📄
            </div>

            <div>

              <h2 style={styles.sectionTitle}>
                Resume
              </h2>

              <p style={styles.sectionSubtitle}>
                Upload your latest resume
              </p>

            </div>

          </div>

          {/* EXISTING RESUME */}

          {user.resume ? (

            <div style={styles.existingResume}>

              <div style={styles.resumeLeft}>

                <div style={styles.resumeIcon}>
                  📄
                </div>

                <div>

                  <strong>
                    Current Resume
                  </strong>

                  <p style={styles.resumeName}>
                    {user.resume}
                  </p>

                </div>

              </div>

              <a
                href={`http://localhost:8085/uploads/${user.resume}`}
                target="_blank"
                rel="noreferrer"
                style={styles.viewResumeButton}
              >
                View Resume
              </a>

            </div>

          ) : (

            <div style={styles.noResume}>

              <span style={{ fontSize: "25px" }}>
                📁
              </span>

              <div>

                <strong>
                  No resume uploaded
                </strong>

                <p style={{ margin: "4px 0 0" }}>
                  Upload a resume to make your profile
                  more complete.
                </p>

              </div>

            </div>

          )}

          {/* UPLOAD AREA */}

          <div style={styles.uploadArea}>

            <div style={styles.uploadIcon}>
              ⬆️
            </div>

            <h3 style={styles.uploadTitle}>
              Upload New Resume
            </h3>

            <p style={styles.uploadDescription}>
              PDF, DOC or DOCX files only
              <br />
              Maximum file size: 5 MB
            </p>

            <input
              id="resume-upload"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeChange}
              style={styles.fileInput}
            />

            <label
              htmlFor="resume-upload"
              style={styles.chooseFileButton}
            >
              Choose Resume
            </label>

            {resumeFile && (

              <div style={styles.selectedFile}>

                <span>
                  📎
                </span>

                <span>
                  {resumeFile.name}
                </span>

              </div>

            )}

            <button
              type="button"
              onClick={uploadResume}
              disabled={
                uploadingResume ||
                !resumeFile
              }
              style={{
                ...styles.uploadButton,
                opacity:
                  uploadingResume || !resumeFile
                    ? 0.6
                    : 1,
                cursor:
                  uploadingResume || !resumeFile
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {uploadingResume
                ? "Uploading..."
                : "Upload Resume"}
            </button>

          </div>

        </div>

        {/* =================================================
            SAVE PROFILE
        ================================================= */}

        <div style={styles.actionCard}>

          <div>

            <h3 style={styles.actionTitle}>
              Keep your profile updated
            </h3>

            <p style={styles.actionText}>
              Make sure your information is accurate before saving.
            </p>

          </div>

          <button
            type="button"
            onClick={updateProfile}
            disabled={saving}
            style={{
              ...styles.saveButton,
              opacity: saving ? 0.7 : 1,
              cursor: saving
                ? "not-allowed"
                : "pointer",
            }}
          >
            {saving
              ? "Saving..."
              : "✓ Save Profile"}
          </button>

        </div>

      </div>

      {/* =================================================
          ADVERTISEMENT
      ================================================= */}

      <div style={styles.adContainer}>
        <AdBanner />
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
    paddingBottom: "40px",
  },

  header: {
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    padding: "28px 20px",
  },

  headerContent: {
    maxWidth: "1000px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
  },

  pageTitle: {
    margin: 0,
    color: "#111827",
    fontSize: "30px",
    fontWeight: "700",
  },

  pageSubtitle: {
    margin: "6px 0 0",
    color: "#6b7280",
    fontSize: "14px",
  },

  profileBadge: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#f8fafc",
    padding: "8px 14px",
    borderRadius: "30px",
    border: "1px solid #e5e7eb",
  },

  profileAvatar: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    backgroundColor: "#1976d2",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: "700",
    flexShrink: 0,
  },

  profileBadgeSmall: {
    display: "block",
    color: "#6b7280",
    marginTop: "2px",
  },

  container: {
    width: "100%",
    maxWidth: "1000px",
    margin: "30px auto",
    padding: "0 20px",
    boxSizing: "border-box",
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    padding: "25px",
    marginBottom: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    boxSizing: "border-box",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "25px",
    paddingBottom: "18px",
    borderBottom: "1px solid #eeeeee",
  },

  sectionIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    backgroundColor: "#eaf3ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0,
  },

  sectionTitle: {
    margin: 0,
    fontSize: "19px",
    color: "#111827",
  },

  sectionSubtitle: {
    margin: "4px 0 0",
    fontSize: "13px",
    color: "#6b7280",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "20px",
  },

  field: {
    minWidth: 0,
  },

  label: {
    display: "block",
    marginBottom: "7px",
    color: "#374151",
    fontSize: "14px",
    fontWeight: "600",
  },

  input: {
    width: "100%",
    padding: "12px 13px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    fontSize: "14px",
    color: "#111827",
    backgroundColor: "#ffffff",
    outline: "none",
    boxSizing: "border-box",
  },

  disabledInput: {
    backgroundColor: "#f3f4f6",
    color: "#6b7280",
    cursor: "not-allowed",
  },

  textarea: {
    width: "100%",
    minHeight: "120px",
    padding: "12px 13px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    fontSize: "14px",
    color: "#111827",
    backgroundColor: "#ffffff",
    resize: "vertical",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },

  helperText: {
    display: "block",
    marginTop: "5px",
    color: "#9ca3af",
    fontSize: "12px",
  },

  existingResume: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    padding: "15px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e5e7eb",
    borderRadius: "9px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },

  resumeLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minWidth: 0,
  },

  resumeIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "8px",
    backgroundColor: "#eaf3ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0,
  },

  resumeName: {
    margin: "4px 0 0",
    color: "#6b7280",
    fontSize: "13px",
    wordBreak: "break-all",
  },

  viewResumeButton: {
    backgroundColor: "#1976d2",
    color: "#ffffff",
    textDecoration: "none",
    padding: "9px 15px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },

  noResume: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "15px",
    backgroundColor: "#fff8e1",
    border: "1px solid #ffe082",
    borderRadius: "8px",
    marginBottom: "20px",
    color: "#795548",
  },

  uploadArea: {
    textAlign: "center",
    border: "2px dashed #cbd5e1",
    borderRadius: "10px",
    padding: "28px 20px",
    backgroundColor: "#fafcff",
  },

  uploadIcon: {
    fontSize: "30px",
    marginBottom: "8px",
  },

  uploadTitle: {
    margin: "5px 0",
    color: "#1f2937",
    fontSize: "17px",
  },

  uploadDescription: {
    color: "#6b7280",
    fontSize: "13px",
    lineHeight: "1.6",
  },

  fileInput: {
    display: "none",
  },

  chooseFileButton: {
    display: "inline-block",
    backgroundColor: "#ffffff",
    color: "#1976d2",
    border: "1px solid #1976d2",
    padding: "9px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    marginTop: "5px",
  },

  selectedFile: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "7px",
    marginTop: "15px",
    color: "#374151",
    fontSize: "13px",
    wordBreak: "break-all",
  },

  uploadButton: {
    display: "block",
    margin: "18px auto 0",
    backgroundColor: "#1976d2",
    color: "#ffffff",
    border: "none",
    padding: "10px 22px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "600",
  },

  actionCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "20px 25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },

  actionTitle: {
    margin: 0,
    color: "#111827",
    fontSize: "16px",
  },

  actionText: {
    margin: "5px 0 0",
    color: "#6b7280",
    fontSize: "13px",
  },

  saveButton: {
    backgroundColor: "#2e7d32",
    color: "#ffffff",
    border: "none",
    padding: "12px 24px",
    borderRadius: "7px",
    fontSize: "14px",
    fontWeight: "600",
  },

  successMessage: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#ecfdf5",
    color: "#166534",
    border: "1px solid #bbf7d0",
    padding: "12px 15px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "14px",
    fontWeight: "500",
  },

  errorMessage: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
    padding: "12px 15px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "14px",
    fontWeight: "500",
  },

  messageIcon: {
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    backgroundColor: "rgba(0,0,0,0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    flexShrink: 0,
  },

  loadingPage: {
    minHeight: "70vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f7fb",
    textAlign: "center",
    padding: "20px",
    boxSizing: "border-box",
  },

  loadingCard: {
    backgroundColor: "#ffffff",
    padding: "35px",
    borderRadius: "12px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
  },

  spinner: {
    width: "35px",
    height: "35px",
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #1976d2",
    borderRadius: "50%",
    margin: "0 auto 15px",
    animation: "spin 1s linear infinite",
  },

  loginIcon: {
    fontSize: "40px",
    marginBottom: "10px",
  },

  adContainer: {
    maxWidth: "1000px",
    margin: "25px auto 0",
    padding: "0 20px",
    boxSizing: "border-box",
  },
};

export default Profile;