import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig";

function AdminRecruiters() {

  const navigate = useNavigate();

  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");


  // =====================================================
  // CREATE RECRUITER
  // =====================================================

  const [showAddRecruiter, setShowAddRecruiter] =
    useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: ""
  });

  const [creating, setCreating] = useState(false);

  const [generatedCredentials, setGeneratedCredentials] =
    useState(null);


  // =====================================================
  // EDIT RECRUITER
  // =====================================================

  const [showEditRecruiter, setShowEditRecruiter] =
    useState(false);

  const [editingRecruiter, setEditingRecruiter] =
    useState(null);

  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: ""
  });

  const [updating, setUpdating] = useState(false);


  // =====================================================
  // GENERATE PASSWORD
  // =====================================================

  const [generatingPassword, setGeneratingPassword] =
    useState(false);


  // =====================================================
  // LOAD RECRUITERS
  // =====================================================

  useEffect(() => {

    const adminLoggedIn =
      localStorage.getItem("adminLoggedIn");

    if (adminLoggedIn !== "true") {

      navigate("/login");

      return;
    }

    loadRecruiters();

  }, [navigate]);


  const loadRecruiters = async () => {

    try {

      setLoading(true);

      const response =
        await api.get("/admin/recruiters");

      setRecruiters(response.data);

      setError("");

    } catch (error) {

      console.error(
        "Admin Recruiters Error:",
        error
      );

      setError(
        `error.response?.data` ||
        "Failed to load recruiters."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // FORM CHANGE - ADD
  // =====================================================

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };


  // =====================================================
  // FORM CHANGE - EDIT
  // =====================================================

  const handleEditChange = (e) => {

    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });

  };


  // =====================================================
  // CREATE RECRUITER
  // =====================================================

  const createRecruiter = async (e) => {

    e.preventDefault();

    if (!form.fullName.trim()) {

      alert("Please enter recruiter name.");

      return;
    }

    if (!form.email.trim()) {

      alert("Please enter recruiter email.");

      return;
    }

    try {

      setCreating(true);

      const response =
        await api.post(
          "/admin/recruiters",
          form
        );

      console.log(
        "Create Recruiter Response:",
        response.data
      );

      setGeneratedCredentials(
        response.data
      );

      setForm({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: ""
      });

      await loadRecruiters();

    } catch (error) {

      console.error(
        "Create Recruiter Error:",
        error
      );

      alert(
        `error.response?.data?.message ||
        error.response?.data` ||
        "Failed to create recruiter."
      );

    } finally {

      setCreating(false);

    }

  };


  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const openEditRecruiter = (recruiter) => {

    setEditingRecruiter(recruiter);

    setEditForm({
      fullName: recruiter.fullName || "",
      email: recruiter.email || "",
      phone: recruiter.phone || "",
      address: recruiter.address || "",
      city: recruiter.city || "",
      state: recruiter.state || ""
    });

    setShowEditRecruiter(true);

  };


  // =====================================================
  // UPDATE RECRUITER
  // =====================================================

  const updateRecruiter = async (e) => {

    e.preventDefault();

    if (!editingRecruiter) {
      return;
    }

    if (!editForm.fullName.trim()) {

      alert("Recruiter name is required.");

      return;
    }

    if (!editForm.email.trim()) {

      alert("Recruiter email is required.");

      return;
    }

    try {

      setUpdating(true);

      const response =
        await api.put(
          `/admin/recruiters/${editingRecruiter.id}`,
          editForm
        );

      console.log(
        "Update Recruiter Response:",
        response.data
      );

      alert(
        "Recruiter Updated Successfully"
      );

      setShowEditRecruiter(false);

      setEditingRecruiter(null);

      await loadRecruiters();

    } catch (error) {

      console.error(
        "Update Recruiter Error:",
        error
      );

      alert(
        `error.response?.data?.message ||
        error.response?.data` ||
        "Failed to update recruiter."
      );

    } finally {

      setUpdating(false);

    }

  };


  // =====================================================
  // GENERATE NEW PASSWORD
  // =====================================================

  const generateNewPassword = async (id) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to generate a new password for this recruiter?"
      );

    if (!confirmed) {
      return;
    }

    try {

      setGeneratingPassword(true);

      const response =
        await api.put(
          `/admin/recruiters/${id}/generate-password`
        );

      console.log(
        "Generate Password Response:",
        response.data
      );

      setGeneratedCredentials({
        id: response.data.id,
        fullName: response.data.fullName,
        email: response.data.email,
        temporaryPassword:
          response.data.temporaryPassword
      });

    } catch (error) {

      console.error(
        "Generate Password Error:",
        error
      );

      alert(
        `error.response?.data?.message ||
        error.response?.data` ||
        "Failed to generate new password."
      );

    } finally {

      setGeneratingPassword(false);

    }

  };


  // =====================================================
  // BLOCK RECRUITER
  // =====================================================

  const blockRecruiter = async (id) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to block this recruiter?"
      );

    if (!confirmed) {
      return;
    }

    try {

      await api.put(
        `/admin/users/${id}/block`
      );

      alert(
        "Recruiter Blocked Successfully"
      );

      await loadRecruiters();

    } catch (error) {

      console.error(
        "Block Recruiter Error:",
        error
      );

      alert(
        `error.response?.data?.message ||
        error.response?.data` ||
        "Failed to block recruiter"
      );

    }

  };


  // =====================================================
  // UNBLOCK RECRUITER
  // =====================================================

  const unblockRecruiter = async (id) => {

    try {

      await api.put(
        `/admin/users/${id}/unblock`
      );

      alert(
        "Recruiter Unblocked Successfully"
      );

      await loadRecruiters();

    } catch (error) {

      console.error(
        "Unblock Recruiter Error:",
        error
      );

      alert(
        `error.response?.data?.message ||
        error.response?.data` ||
        "Failed to unblock recruiter"
      );

    }

  };


  // =====================================================
  // DELETE RECRUITER
  // =====================================================

  const deleteRecruiter = async (id) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this recruiter?"
      );

    if (!confirmed) {
      return;
    }

    try {

      await api.delete(
        `/admin/recruiters/${id}`
      );

      alert(
        "Recruiter Deleted Successfully"
      );

      await loadRecruiters();

    } catch (error) {

      console.error(
        "Delete Recruiter Error:",
        error
      );

      alert(
        `error.response?.data?.message ||
        error.response?.data` ||
        "Failed to delete recruiter"
      );

    }

  };


  // =====================================================
  // ONLINE / OFFLINE STATUS
  // =====================================================

  const getOnlineStatus = (recruiter) => {

    /*
      Supports different possible field names.

      If backend already sends:
      online
      isOnline
      onlineStatus

      this will display the correct status.

      If no online field exists,
      default is Offline.
    */

    if (
      recruiter.online === true ||
      recruiter.isOnline === true ||
      recruiter.onlineStatus === true ||
      recruiter.onlineStatus === "ONLINE" ||
      recruiter.onlineStatus === "Online" ||
      recruiter.onlineStatus === "online"
    ) {
      return true;
    }

    return false;
  };


  // =====================================================
  // FILTER
  // =====================================================

  const filteredRecruiters =
    recruiters.filter((recruiter) => {

      const value =
        search.toLowerCase().trim();

      return (

        (recruiter.fullName || "")
          .toLowerCase()
          .includes(value) ||

        (recruiter.email || "")
          .toLowerCase()
          .includes(value) ||

        (recruiter.city || "")
          .toLowerCase()
          .includes(value)

      );

    });


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div
        style={{
          padding: "40px",
          textAlign: "center"
        }}
      >

        <h3>
          Loading Recruiters...
        </h3>

      </div>

    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (

      <div
        style={{
          padding: "40px",
          textAlign: "center"
        }}
      >

        <h3>
          {error}
        </h3>

        <button
          onClick={loadRecruiters}
          style={buttonStyle}
        >
          Retry
        </button>

      </div>

    );

  }


  // =====================================================
  // MAIN UI
  // =====================================================

  return (

    <div
      style={{
        padding: "30px",
        backgroundColor: "#f5f7fa",
        minHeight: "100vh"
      }}
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
          flexWrap: "wrap",
          gap: "10px"
        }}
      >

        <h1>
          Admin - Recruiters
        </h1>


        <div>

          <button
            onClick={() =>
              setShowAddRecruiter(true)
            }
            style={{
              ...buttonStyle,
              backgroundColor: "#2e7d32",
              marginRight: "10px"
            }}
          >
            + Add Recruiter
          </button>


          <button
            onClick={() =>
              navigate("/admin/dashboard")
            }
            style={buttonStyle}
          >
            ← Dashboard
          </button>

        </div>

      </div>


      {/* =================================================
          SEARCH
      ================================================= */}

      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.08)"
        }}
      >

        <input
          type="text"
          placeholder="Search by name, email or city..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={{
            width: "100%",
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            boxSizing: "border-box",
            fontSize: "15px"
          }}
        />

      </div>


      {/* =================================================
          RECRUITERS TABLE
      ================================================= */}

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "10px",
          overflow: "auto",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.08)"
        }}
      >

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "1250px"
          }}
        >

          <thead>

            <tr
              style={{
                backgroundColor: "#1976d2",
                color: "white"
              }}
            >

              <th style={thStyle}>
                ID
              </th>

              <th style={thStyle}>
                Name
              </th>

              <th style={thStyle}>
                Email
              </th>

              <th style={thStyle}>
                Phone
              </th>

              <th style={thStyle}>
                City
              </th>

              <th style={thStyle}>
                State
              </th>

              <th style={thStyle}>
                Account Status
              </th>

              <th style={thStyle}>
                Online Status
              </th>

              <th style={thStyle}>
                Actions
              </th>

            </tr>

          </thead>


          <tbody>

            {filteredRecruiters.length === 0 ? (

              <tr>

                <td
                  colSpan="9"
                  style={{
                    padding: "30px",
                    textAlign: "center"
                  }}
                >
                  No Recruiters Found
                </td>

              </tr>

            ) : (

              filteredRecruiters.map(
                (recruiter) => {

                  const isOnline =
                    getOnlineStatus(recruiter);

                  return (

                    <tr
                      key={recruiter.id}
                    >

                      <td style={tdStyle}>
                        {recruiter.id}
                      </td>


                      <td style={tdStyle}>
                        {recruiter.fullName || "N/A"}
                      </td>


                      <td style={tdStyle}>
                        {recruiter.email || "N/A"}
                      </td>


                      <td style={tdStyle}>
                        {recruiter.phone || "N/A"}
                      </td>


                      <td style={tdStyle}>
                        {recruiter.city || "N/A"}
                      </td>


                      <td style={tdStyle}>
                        {recruiter.state || "N/A"}
                      </td>


                      {/* =================================================
                          ACCOUNT STATUS
                      ================================================= */}

                      <td style={tdStyle}>

                        {recruiter.deleted ? (

                          <span
                            style={{
                              color: "#d32f2f",
                              fontWeight: "bold"
                            }}
                          >
                            Deleted
                          </span>

                        ) : recruiter.blocked ? (

                          <span
                            style={{
                              color: "#f57c00",
                              fontWeight: "bold"
                            }}
                          >
                            Blocked
                          </span>

                        ) : (

                          <span
                            style={{
                              color: "#2e7d32",
                              fontWeight: "bold"
                            }}
                          >
                            Active
                          </span>

                        )}

                      </td>


                      {/* =================================================
                          ONLINE / OFFLINE STATUS
                      ================================================= */}

                      <td style={tdStyle}>

                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "6px 12px",
                            borderRadius: "20px",
                            backgroundColor:
                              isOnline
                                ? "#e8f5e9"
                                : "#f5f5f5",
                            border:
                              isOnline
                                ? "1px solid #a5d6a7"
                                : "1px solid #ddd"
                          }}
                        >

                          <span
                            style={{
                              width: "10px",
                              height: "10px",
                              borderRadius: "50%",
                              display: "inline-block",
                              backgroundColor:
                                isOnline
                                  ? "#2e7d32"
                                  : "#757575"
                            }}
                          />

                          <span
                            style={{
                              fontWeight: "bold",
                              color:
                                isOnline
                                  ? "#2e7d32"
                                  : "#616161"
                            }}
                          >
                            {isOnline
                              ? "Online"
                              : "Offline"}
                          </span>

                        </div>

                      </td>


                      {/* =================================================
                          ACTIONS
                      ================================================= */}

                      <td style={tdStyle}>

                        {!recruiter.deleted && (

                          <>

                            {/* EDIT */}

                            <button
                              onClick={() =>
                                openEditRecruiter(
                                  recruiter
                                )
                              }
                              style={{
                                ...smallButtonStyle,
                                backgroundColor: "#1976d2"
                              }}
                            >
                              Edit
                            </button>


                            {/* GENERATE PASSWORD */}

                            <button
                              onClick={() =>
                                generateNewPassword(
                                  recruiter.id
                                )
                              }
                              disabled={
                                generatingPassword
                              }
                              style={{
                                ...smallButtonStyle,
                                backgroundColor: "#6a1b9a",
                                opacity:
                                  generatingPassword
                                    ? 0.6
                                    : 1
                              }}
                            >
                              {generatingPassword
                                ? "Generating..."
                                : "New Password"}
                            </button>


                            {/* BLOCK / UNBLOCK */}

                            {recruiter.blocked ? (

                              <button
                                onClick={() =>
                                  unblockRecruiter(
                                    recruiter.id
                                  )
                                }
                                style={{
                                  ...smallButtonStyle,
                                  backgroundColor: "#2e7d32"
                                }}
                              >
                                Unblock
                              </button>

                            ) : (

                              <button
                                onClick={() =>
                                  blockRecruiter(
                                    recruiter.id
                                  )
                                }
                                style={{
                                  ...smallButtonStyle,
                                  backgroundColor: "#f57c00"
                                }}
                              >
                                Block
                              </button>

                            )}


                            {/* DELETE */}

                            <button
                              onClick={() =>
                                deleteRecruiter(
                                  recruiter.id
                                )
                              }
                              style={{
                                ...smallButtonStyle,
                                backgroundColor: "#d32f2f"
                              }}
                            >
                              Delete
                            </button>

                          </>

                        )}

                      </td>

                    </tr>

                  );

                }

              )

            )}

          </tbody>

        </table>

      </div>


      {/* =================================================
          ADD RECRUITER MODAL
      ================================================= */}

      {showAddRecruiter && (

        <div
          style={modalOverlayStyle}
        >

          <div
            style={modalStyle}
          >

            <h2>
              Add Recruiter
            </h2>

            <p
              style={{
                color: "#666",
                marginBottom: "20px"
              }}
            >
              Admin can create recruiter login
              credentials from here.
            </p>


            <form
              onSubmit={createRecruiter}
            >

              <input
                name="fullName"
                placeholder="Full Name *"
                value={form.fullName}
                onChange={handleChange}
                style={inputStyle}
                required
              />


              <input
                name="email"
                type="email"
                placeholder="Email *"
                value={form.email}
                onChange={handleChange}
                style={inputStyle}
                required
              />


              <input
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                style={inputStyle}
              />


              <input
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                style={inputStyle}
              />


              <input
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                style={inputStyle}
              />


              <input
                name="state"
                placeholder="State"
                value={form.state}
                onChange={handleChange}
                style={inputStyle}
              />


              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginTop: "20px"
                }}
              >

                <button
                  type="button"
                  onClick={() => {
                    setShowAddRecruiter(false);
                  }}
                  style={{
                    ...buttonStyle,
                    backgroundColor: "#757575"
                  }}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  disabled={creating}
                  style={{
                    ...buttonStyle,
                    backgroundColor: "#2e7d32"
                  }}
                >
                  {creating
                    ? "Creating..."
                    : "Create Recruiter"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* =================================================
          EDIT RECRUITER MODAL
      ================================================= */}

      {showEditRecruiter && (

        <div
          style={modalOverlayStyle}
        >

          <div
            style={modalStyle}
          >

            <h2>
              Edit Recruiter
            </h2>

            <p
              style={{
                color: "#666",
                marginBottom: "20px"
              }}
            >
              Update recruiter details.
            </p>


            <form
              onSubmit={updateRecruiter}
            >

              <label style={labelStyle}>
                Full Name
              </label>

              <input
                name="fullName"
                value={editForm.fullName}
                onChange={handleEditChange}
                style={inputStyle}
                required
              />


              <label style={labelStyle}>
                Email
              </label>

              <input
                name="email"
                type="email"
                value={editForm.email}
                onChange={handleEditChange}
                style={inputStyle}
                required
              />


              <label style={labelStyle}>
                Phone
              </label>

              <input
                name="phone"
                value={editForm.phone}
                onChange={handleEditChange}
                style={inputStyle}
              />


              <label style={labelStyle}>
                Address
              </label>

              <input
                name="address"
                value={editForm.address}
                onChange={handleEditChange}
                style={inputStyle}
              />


              <label style={labelStyle}>
                City
              </label>

              <input
                name="city"
                value={editForm.city}
                onChange={handleEditChange}
                style={inputStyle}
              />


              <label style={labelStyle}>
                State
              </label>

              <input
                name="state"
                value={editForm.state}
                onChange={handleEditChange}
                style={inputStyle}
              />


              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginTop: "20px"
                }}
              >

                <button
                  type="button"
                  onClick={() => {
                    setShowEditRecruiter(false);
                    setEditingRecruiter(null);
                  }}
                  style={{
                    ...buttonStyle,
                    backgroundColor: "#757575"
                  }}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  disabled={updating}
                  style={{
                    ...buttonStyle,
                    backgroundColor: "#1976d2"
                  }}
                >
                  {updating
                    ? "Updating..."
                    : "Save Changes"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* =================================================
          GENERATED CREDENTIALS / PASSWORD MODAL
      ================================================= */}

      {generatedCredentials && (

        <div
          style={modalOverlayStyle}
        >

          <div
            style={{
              ...modalStyle,
              textAlign: "center"
            }}
          >

            <h2
              style={{
                color: "#2e7d32"
              }}
            >
              {generatedCredentials.message
                ? "New Password Generated"
                : "Recruiter Created Successfully"}
            </h2>


            <p>
              Give these credentials to the recruiter.
            </p>


            <div
              style={{
                backgroundColor: "#f5f5f5",
                padding: "20px",
                borderRadius: "8px",
                marginTop: "20px",
                marginBottom: "20px",
                textAlign: "left"
              }}
            >

              <p>
                <strong>
                  Recruiter ID:
                </strong>{" "}
                {generatedCredentials.id}
              </p>


              <p>
                <strong>
                  Name:
                </strong>{" "}
                {generatedCredentials.fullName}
              </p>


              <p>
                <strong>
                  Email / Login ID:
                </strong>{" "}
                {generatedCredentials.email}
              </p>


              <p>
                <strong>
                  Temporary Password:
                </strong>
              </p>


              <div
                style={{
                  backgroundColor: "#fff3e0",
                  padding: "12px",
                  borderRadius: "6px",
                  textAlign: "center",
                  border:
                    "1px solid #ffb74d"
                }}
              >

                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#d32f2f",
                    letterSpacing: "1px"
                  }}
                >
                  {generatedCredentials.temporaryPassword ||
                    generatedCredentials.password ||
                    "Password not received"}
                </span>

              </div>

            </div>


            <p
              style={{
                color: "#d32f2f",
                fontSize: "13px"
              }}
            >
              Please save this password.
              It will not be available from
              the database in plain text.
            </p>


            <button
              onClick={() =>
                setGeneratedCredentials(null)
              }
              style={{
                ...buttonStyle,
                backgroundColor: "#1976d2"
              }}
            >
              Done
            </button>

          </div>

        </div>

      )}

    </div>

  );

}


// =====================================================
// STYLES
// =====================================================

const thStyle = {

  padding: "14px",

  textAlign: "left",

  borderBottom:
    "1px solid #ddd",

  whiteSpace: "nowrap"

};


const tdStyle = {

  padding: "14px",

  borderBottom:
    "1px solid #eee",

  whiteSpace: "nowrap"

};


const buttonStyle = {

  padding: "10px 18px",

  backgroundColor: "#1976d2",

  color: "white",

  border: "none",

  borderRadius: "6px",

  cursor: "pointer"

};


const smallButtonStyle = {

  padding: "7px 12px",

  color: "white",

  border: "none",

  borderRadius: "5px",

  cursor: "pointer",

  marginRight: "6px",

  marginBottom: "5px"

};


const inputStyle = {

  width: "100%",

  padding: "12px",

  marginBottom: "12px",

  border:
    "1px solid #ccc",

  borderRadius: "6px",

  boxSizing: "border-box",

  fontSize: "15px"

};


const labelStyle = {

  display: "block",

  fontWeight: "bold",

  marginBottom: "5px",

  color: "#444"

};


const modalOverlayStyle = {

  position: "fixed",

  top: 0,

  left: 0,

  right: 0,

  bottom: 0,

  backgroundColor:
    "rgba(0,0,0,0.5)",

  display: "flex",

  justifyContent: "center",

  alignItems: "center",

  zIndex: 1000,

  padding: "20px",

  overflowY: "auto"

};


const modalStyle = {

  backgroundColor: "white",

  width: "100%",

  maxWidth: "500px",

  padding: "30px",

  borderRadius: "12px",

  boxShadow:
    "0 5px 25px rgba(0,0,0,0.25)"

};


export default AdminRecruiters;