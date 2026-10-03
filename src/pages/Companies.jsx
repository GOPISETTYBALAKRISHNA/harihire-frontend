import React, { useEffect, useState } from "react";
import api from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import "../styles/Companies.css";

function Companies() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompanies();
  }, []);

  // =====================================================
  // LOAD ACTIVE COMPANIES
  // =====================================================

  const loadCompanies = async () => {

    try {

      const response = await api.get("/companies/active");

      // Only active companies
      const activeCompanies = response.data.filter(
        (company) => company.active === true
      );

      setCompanies(activeCompanies);

    } catch (error) {

      console.error(
        "Failed to load companies:",
        error
      );

      setCompanies([]);

    } finally {

      setLoading(false);

    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div style={{ padding: "30px" }}>
        Loading Companies...
      </div>
    );

  }

  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="companies-page">
  
      <div className="companies-hero">
        <h1>Top Companies</h1>
        <p>
          Explore leading companies and discover career opportunities.
        </p>
      </div>
  
      {companies.length === 0 ? (
  
        <p className="no-companies">
          No companies available.
        </p>
  
      ) : (
  
        <div className="companies-grid">
  
          {companies.map((company) => (
  
            <div
              key={company.id}
              className="company-card"
            >
  
              {company.logo ? (
  
                <img
                  src={`http://localhost:8085${company.logo}`}
                  alt={company.companyName}
                  className="company-logo"
                />
  
              ) : (
  
                <div className="company-no-logo">
                  No Logo
                </div>
  
              )}
  
              <h2 className="company-name">
                {company.companyName}
              </h2>
  
              <p className="company-description">
                {company.description}
              </p>
  
              <div className="company-actions">
  
                <a
                  href={company.websiteLink}
                  target="_blank"
                  rel="noreferrer"
                  className="visit-btn"
                >
                  Visit Website
                </a>
  
                <button
                  className="jobs-btn"
                  onClick={() => {
                    if (company.careersUrl) {
                      window.open(
                        company.careersUrl,
                        "_blank"
                      );
                    } else {
                      alert("Career URL not found");
                    }
                  }}
                >
                  View Jobs
                </button>
  
              </div>
  
            </div>
  
          ))}
  
        </div>
  
      )}
  
    </div>
  
  );
}

export default Companies;