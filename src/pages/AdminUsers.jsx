import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig";

function AdminUsers() {

  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  useEffect(() => {

    const adminLoggedIn =
      localStorage.getItem("adminLoggedIn");

    if (adminLoggedIn !== "true") {
      navigate("/login");
      return;
    }

    loadUsers();

  }, [navigate]);

  const loadUsers = async () => {

    try {

      setLoading(true);

      const response = await api.get("/admin/users");

      setUsers(response.data);
      setError("");

    } catch (error) {

      console.error("Admin Users Error:", error);

      setError("Failed to load users.");

    } finally {

      setLoading(false);

    }

  };

  const blockUser = async (id) => {

    try {

      await api.put(`/admin/users/${id}/block`);

      alert("User Blocked Successfully");

      loadUsers();

    } catch (error) {

      console.error(error);

      alert("Failed to block user");

    }

  };

  const unblockUser = async (id) => {

    try {

      await api.put(`/admin/users/${id}/unblock`);

      alert("User Unblocked Successfully");

      loadUsers();

    } catch (error) {

      console.error(error);

      alert("Failed to unblock user");

    }

  };

  const softDeleteUser = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this user?"
      );

    if (!confirmDelete) return;

    try {

      await api.put(
        `/admin/users/${id}/soft-delete`
      );

      alert("User Deleted Successfully");

      loadUsers();

    } catch (error) {

      console.error(error);

      alert("Failed to delete user");

    }

  };

  const filteredUsers = users.filter((user) => {

    const value = search.toLowerCase();

    return (
      (user.fullName || "")
        .toLowerCase()
        .includes(value) ||

      (user.email || "")
        .toLowerCase()
        .includes(value) ||

      (user.role || "")
        .toLowerCase()
        .includes(value)
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
        Loading Users...
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
          onClick={loadUsers}
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
          Admin - Users
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
          placeholder="Search by name, email or role..."
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
            borderCollapse: "collapse"
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
                Role
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

            {filteredUsers.length === 0 ? (

              <tr>

                <td
                  colSpan="6"
                  style={{
                    padding: "30px",
                    textAlign: "center"
                  }}
                >
                  No Users Found
                </td>

              </tr>

            ) : (

              filteredUsers.map((user) => (

                <tr key={user.id}>

                  <td style={tdStyle}>
                    {user.id}
                  </td>

                  <td style={tdStyle}>
                    {user.fullName}
                  </td>

                  <td style={tdStyle}>
                    {user.email}
                  </td>

                  <td style={tdStyle}>
                    {user.role}
                  </td>

                  <td style={tdStyle}>

                    {user.deleted ? (
                      <span
                        style={{
                          color: "red",
                          fontWeight: "bold"
                        }}
                      >
                        Deleted
                      </span>
                    ) : user.blocked ? (
                      <span
                        style={{
                          color: "orange",
                          fontWeight: "bold"
                        }}
                      >
                        Blocked
                      </span>
                    ) : (
                      <span
                        style={{
                          color: "green",
                          fontWeight: "bold"
                        }}
                      >
                        Active
                      </span>
                    )}

                  </td>

                  <td style={tdStyle}>

                    {!user.deleted && (

                      <>

                        {user.blocked ? (

                          <button
                            onClick={() =>
                              unblockUser(user.id)
                            }
                            style={{
                              ...smallButtonStyle,
                              backgroundColor:
                                "#2e7d32"
                            }}
                          >
                            Unblock
                          </button>

                        ) : (

                          <button
                            onClick={() =>
                              blockUser(user.id)
                            }
                            style={{
                              ...smallButtonStyle,
                              backgroundColor:
                                "#f57c00"
                            }}
                          >
                            Block
                          </button>

                        )}

                        <button
                          onClick={() =>
                            softDeleteUser(user.id)
                          }
                          style={{
                            ...smallButtonStyle,
                            backgroundColor:
                              "#d32f2f"
                          }}
                        >
                          Delete
                        </button>

                      </>

                    )}

                  </td>

                </tr>

              ))

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
  cursor: "pointer",
  marginRight: "6px",
  marginBottom: "5px"
};

export default AdminUsers;