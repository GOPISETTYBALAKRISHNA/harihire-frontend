import React, { useEffect, useState } from "react";
import api from "../axiosConfig";
import "../styles/AdminCompanies.css";

function AdminCompanies() {

  const [companies, setCompanies] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    websiteLink: "",
    careersUrl: "",
    description: "",
    logo: null,
    active: true,
    autoSync: false
  });
  useEffect(() => {
    loadCompanies();
  }, []);

  // =====================================================
  // LOAD ALL COMPANIES
  // =====================================================

  const loadCompanies = async () => {
    try {

      const response = await api.get("/companies");

      setCompanies(response.data);

    } catch (error) {

      console.error("Load Companies Error:", error);

      alert("Failed To Load Companies");
    }
  };

  // =====================================================
  // HANDLE FORM CHANGE
  // =====================================================

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // =====================================================
  // ADD COMPANY
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const data = new FormData();

      data.append(
        "companyName",
        formData.companyName
      );

      data.append(
        "websiteLink",
        formData.websiteLink
      );
      data.append(
        "careersUrl",
        formData.careersUrl
      );
      
      data.append(
        "autoSync",
        formData.autoSync
      );

      data.append(
        "description",
        formData.description
      );

      data.append(
        "active",
        formData.active
      );

      if (formData.logo) {
        data.append(
          "logo",
          formData.logo
        );
      }

      await api.post(
        "/companies/add",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("Company Added Successfully");

      setFormData({
        companyName: "",
        websiteLink: "",
        careersUrl: "",
        description: "",
        logo: null,
        active: true,
        autoSync: false
      });

      loadCompanies();

    } catch (error) {

      console.error("Add Company Error:", error);

      alert("Failed To Add Company");
    }
  };

  // =====================================================
  // ACTIVATE COMPANY
  // =====================================================

  const activateCompany = async (id) => {

    try {

      await api.put(
        `/companies/${id}/activate`
      );

      alert("Company Activated Successfully");

      loadCompanies();

    } catch (error) {

      console.error(
        "Activate Company Error:",
        error
      );

      alert("Failed To Activate Company");
    }
  };

  // =====================================================
  // DEACTIVATE COMPANY
  // =====================================================

  const deactivateCompany = async (id) => {

    if (
      !window.confirm(
        "Are you sure you want to deactivate this company?"
      )
    ) {
      return;
    }

    try {

      await api.put(
        `/companies/${id}/deactivate`
      );

      alert("Company Deactivated Successfully");

      loadCompanies();

    } catch (error) {

      console.error(
        "Deactivate Company Error:",
        error
      );

      alert("Failed To Deactivate Company");
    }
  };

  // =====================================================
  // DELETE COMPANY
  // =====================================================

  const deleteCompany = async (id) => {

    if (
      !window.confirm(
        "Delete this company?"
      )
    ) {
      return;
    }

    try {

      await api.delete(
        `/companies/${id}`
      );

      alert("Company Deleted Successfully");

      loadCompanies();

    } catch (error) {

      console.error(
        "Delete Company Error:",
        error
      );

      alert("Delete Failed");
    }
  };
  const editCompany = (company) => {

    setFormData({
      companyName: company.companyName || "",
      websiteLink: company.websiteLink || "",
      careersUrl: company.careersUrl || "",
      description: company.description || "",
      logo: null,
      active: company.active,
      autoSync: company.autoSync || false
    });
  
    setEditingId(company.id);
  
    setIsEditing(true);
  };
  const updateCompany = async (e) => {

    e.preventDefault();
  
    try {
  
      const data = new FormData();
  
      data.append(
        "companyName",
        formData.companyName
      );
  
      data.append(
        "websiteLink",
        formData.websiteLink
      );
  
      data.append(
        "careersUrl",
        formData.careersUrl
      );
  
      data.append(
        "description",
        formData.description
      );
  
      data.append(
        "active",
        formData.active
      );
  
      data.append(
        "autoSync",
        formData.autoSync
      );
  
      if (formData.logo) {
  
        data.append(
          "logo",
          formData.logo
        );
      }
  
      await api.put(
        `/companies/${editingId}`,
        data,
        {
          headers: {
            "Content-Type":
              "multipart/form-data"
          }
        }
      );
  
      alert(
        "Company Updated Successfully"
      );
  
      setEditingId(null);
  
      setIsEditing(false);
  
      setFormData({
        companyName: "",
        websiteLink: "",
        careersUrl: "",
        description: "",
        logo: null,
        active: true,
        autoSync: false
      });
  
      loadCompanies();
  
    } catch (error) {
  
      console.error(
        "Update Company Error:",
        `error.response?.data` ||
        error.message
      );
  
      alert(
        "Failed To Update Company"
      );
    }
  };
  


  // =====================================================
  // UI
  // =====================================================
  const filteredCompanies = companies.filter((company) =>
  String(company.companyName || "")
      .toLowerCase()
      .includes(String(searchTerm || "").toLowerCase())
);
  return (

<div className="admin-companies-container">

<div className="admin-companies-header">
    <h2>🏢 Companies Management</h2>
    <p>
        Manage company profiles, career links and auto sync settings
    </p>
</div>
<div className="company-stats">

  <div className="company-stat-card">
    <h3>Total Companies</h3>
    <h2>{companies.length}</h2>
  </div>

  <div className="company-stat-card">
    <h3>Active Companies</h3>
    <h2>
      {
        companies.filter(
          c => c.active
        ).length
      }
    </h2>
  </div>

  <div className="company-stat-card">
    <h3>Auto Sync Enabled</h3>
    <h2>
      {
        companies.filter(
          c => c.autoSync
        ).length
      }
    </h2>
  </div>

</div>
      {/* =================================================
          ADD COMPANY FORM
      ================================================= */}
<div className="company-form-card">
<form
  onSubmit={
    isEditing
      ? updateCompany
      : handleSubmit
  }
>
<div className="company-form-grid">
        <input
          className="company-input"

  type="text"
  name="companyName"
  placeholder="Company Name"
  value={formData.companyName}
  onChange={handleChange}
  required
/>

<br />
<br />

<input
  className="company-input"
  type="text"
  name="websiteLink"
  placeholder="Website Link"
  value={formData.websiteLink}
  onChange={handleChange}
  required
/>

<br />
<br />

<input
  className="company-input"
  type="text"
  name="careersUrl"
  placeholder="Careers URL"
  value={formData.careersUrl}
  onChange={handleChange}
/>

<br />
<br />

<textarea
  className="company-textarea"
  name="description"
  placeholder="Description"
  value={formData.description}
  onChange={handleChange}
  rows="4"
  cols="50"
/>
</div>

<br />
<br />

<label>
  Company Logo
</label>

<br />

<input
  type="file"
  accept="image/*"
  onChange={(e) =>
    setFormData({
      ...formData,
      logo: e.target.files[0]
    })
  }
  required={!isEditing}

/>

<br />
<br />

<label>
  <input
    type="checkbox"
    name="active"
    checked={formData.active}
    onChange={handleChange}
  />
  {" "}Active
</label>

<br />
<br />

<label>
  <input
    type="checkbox"
    name="autoSync"
    checked={formData.autoSync}
    onChange={handleChange}
  />
  {" "}Auto Sync Jobs
</label>

<br />
<br />

<button
  type="submit"
  className="company-submit-btn"
>
{isEditing
  ? "Update Company"
  : "Add Company"}

</button>

      </form>
      </div>

      <hr />

      {/* =================================================
          COMPANY LIST
      ================================================= */}

      <h3>All Companies</h3>

<div className="company-table-card">

<div className="company-top-section">

<h3>
  🏢 Registered Companies
</h3>

<input
  type="text"
  placeholder="Search company..."
  className="company-search"
  value={searchTerm}
  onChange={(e) =>
    setSearchTerm(e.target.value)
  }
/>

</div>
<br />

<table
  border="1"
  cellPadding="10"
  width="100%"
>

  <thead>

    <tr>
      <th>ID</th>
      <th>Logo</th>
      <th>Company</th>
      <th>Website</th>
      <th>Careers URL</th>
      <th>Auto Sync</th>
      <th>Status</th>
      <th>Action</th>
    </tr>

  </thead>

  <tbody>

{filteredCompanies.length === 0 ? (
      <tr>

        <td
          colSpan="8"
          style={{
            textAlign: "center"
          }}
        >
          No Companies Found
        </td>

      </tr>

    ) : (

      companies.map((company) => (

        <tr key={company.id}>

          <td>
            {company.id}
          </td>

          <td>

            {company.logo ? (

              <img
                className="company-logo"
                src={`http://localhost:8085${company.logo}`}
                alt={company.companyName}
              />

            ) : (

              "No Logo"

            )}

          </td>

          <td>
            {company.companyName}
          </td>

          <td>

            <a
              href={company.websiteLink}
              target="_blank"
              rel="noreferrer"
            >
              Visit
            </a>

          </td>

          <td>

            {company.careersUrl ? (

              <a
                href={company.careersUrl}
                target="_blank"
                rel="noreferrer"
              >
                Careers
              </a>

            ) : (

              "-"

            )}

          </td>

          <td>
            {company.autoSync ? "Yes" : "No"}
          </td>

          <td>

            <span
              className={
                company.active
                  ? "status-active"
                  : "status-inactive"
              }
            >
              {company.active
                ? "Active"
                : "Inactive"}
            </span>

          </td>

          <td>

            {!company.active && (

              <button
                className="action-btn"
                style={{
                  background: "#22c55e",
                  color: "white"
                }}
                onClick={() =>
                  activateCompany(company.id)
                }
              >
                Activate
              </button>

            )}

            {company.active && (

              <button
                className="action-btn"
                style={{
                  background: "#f59e0b",
                  color: "white"
                }}
                onClick={() =>
                  deactivateCompany(company.id)
                }
              >
                Deactivate
              </button>

            )}

            <button
              className="action-btn"
              style={{
                background: "#2563eb",
                color: "white"
              }}
              onClick={() =>
                editCompany(company)
              }
            >
              Edit
            </button>

            <button
              className="action-btn"
              style={{
                background: "#ef4444",
                color: "white"
              }}
              onClick={() =>
                deleteCompany(company.id)
              }
            >
              Delete
            </button>

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

export default AdminCompanies;