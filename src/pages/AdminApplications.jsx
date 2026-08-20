import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig";

function AdminApplications() {

  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {

    const adminLoggedIn =
      localStorage.getItem("adminLoggedIn");

    if (adminLoggedIn !== "true") {
      navigate("/login");
      return;
    }

    loadApplications();

  }, [navigate]);

  const loadApplications = async () => {

    try {

      setLoading(true);

      const response =
        await api.get("/admin/applications");

      setApplications(response.data);
      setError("");

    } catch (error) {

      console.error(
        "Admin Applications Error:",
        error
      );

      setError(
        "Failed to load applications."
      );

    } finally {

      setLoading(false);

    }

  };

  const softDeleteApplication = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this application?"
      );

    if (!confirmDelete) return;

    try {

      await api.put(
        `/admin/applications/${id}/soft-delete`
      );

      alert(
        "Application Deleted Successfully"
      );

      loadApplications();

    } catch (error) {

      console.error(error);

      alert(
        "Failed to delete application"
      );

    }

  };

  const restoreApplication = async (id) => {

    try {

      await api.put(
        `/admin/applications/${id}/restore`
      );

      alert(
        "Application Restored Successfully"
      );

      loadApplications();

    } catch (error) {

      console.error(error);

      alert(
        "Failed to restore application"
      );

    }

  };

  const filteredApplications =
    applications.filter((application) => {

      const searchValue =
        search.toLowerCase();

      const matchesSearch =
        (application.applicantName || "")
          .toLowerCase()
          .includes(searchValue) ||

        (application.jobTitle || "")
          .toLowerCase()
          .includes(searchValue) ||

        (application.companyName || "")
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "ALL" ||
        (application.status || "")
          .toUpperCase() === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );

    });

  if (loading) {

    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center"
        }}
      >
        Loading Applications...
      </div>
    );

  }

  if (error) {

    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center"
        }}
      >

        <h3>{error}</h3>

        <button
          onClick={loadApplications}
          style={buttonStyle}
        >
          Retry
        </button>

      </div>
    );

  }

  return (

    <div
      style={{
        padding: "30px",
        backgroundColor: "#f5f7fa",
        minHeight: "100vh"
      }}
    >

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px"
        }}
      >

        <h1>
          Admin - Applications
        </h1>

        <button
          onClick={() =>
            navigate("/admin/dashboard")
          }
          style={buttonStyle}
        >
          ← Dashboard
        </button>

      </div>

      {/* Search + Filter */}

      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.08)",
          display: "flex",
          gap: "15px",
          flexWrap: "wrap"
        }}
      >

        <input
          type="text"
          placeholder="Search applicant, job or company..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={{
            flex: "1",
            minWidth: "250px",
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            fontSize: "15px"
          }}
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          style={{
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            minWidth: "180px"
          }}
        >

          <option value="ALL">
            All Status
          </option>

          <option value="APPLIED">
            Applied
          </option>

          <option value="SELECTED">
            Selected
          </option>

          <option value="REJECTED">
            Rejected
          </option>

        </select>

      </div>

      {/* Applications Table */}

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
            minWidth: "950px"
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
                Applicant
              </th>

              <th style={thStyle}>
                Job
              </th>

              <th style={thStyle}>
                Company
              </th>

              <th style={thStyle}>
                Status
              </th>

              <th style={thStyle}>
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredApplications.length === 0 ? (

              <tr>

                <td
                  colSpan="6"
                  style={{
                    padding: "30px",
                    textAlign: "center"
                  }}
                >
                  No Applications Found
                </td>

              </tr>

            ) : (

              filteredApplications.map(
                (application) => (

                  <tr
                    key={application.id}
                  >

                    <td style={tdStyle}>
                      {application.id}
                    </td>

                    <td style={tdStyle}>
                      {application.applicantName ||
                        "N/A"}
                    </td>

                    <td style={tdStyle}>
                      {application.jobTitle ||
                        "N/A"}
                    </td>

                    <td style={tdStyle}>
                      {application.companyName ||
                        "N/A"}
                    </td>

                    <td style={tdStyle}>

                      {application.deleted ? (

                        <span
                          style={{
                            color: "red",
                            fontWeight: "bold"
                          }}
                        >
                          Deleted
                        </span>

                      ) : (

                        <span
                          style={{
                            fontWeight: "bold",
                            color:
                              application.status ===
                              "SELECTED"
                                ? "green"
                                : application.status ===
                                  "REJECTED"
                                ? "red"
                                : "orange"
                          }}
                        >
                          {application.status ||
                            "APPLIED"}
                        </span>

                      )}

                    </td>

                    <td style={tdStyle}>

                      {application.deleted ? (

                        <button
                          onClick={() =>
                            restoreApplication(
                              application.id
                            )
                          }
                          style={{
                            ...smallButtonStyle,
                            backgroundColor:
                              "#2e7d32"
                          }}
                        >
                          Restore
                        </button>

                      ) : (

                        <button
                          onClick={() =>
                            softDeleteApplication(
                              application.id
                            )
                          }
                          style={{
                            ...smallButtonStyle,
                            backgroundColor:
                              "#d32f2f"
                          }}
                        >
                          Delete
                        </button>

                      )}

                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}

const thStyle = {
  padding: "14px",
  textAlign: "left",
  borderBottom: "1px solid #ddd"
};

const tdStyle = {
  padding: "14px",
  borderBottom: "1px solid #eee"
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
  cursor: "pointer"
};

export default AdminApplications;