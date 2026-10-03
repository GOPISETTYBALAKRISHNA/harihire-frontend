import { useNavigate } from "react-router-dom";
import "../styles/ResumeBuilder.css";

function ResumeBuilder() {
  const navigate = useNavigate();

  const handleProfessionalResume = () => {
    alert(
      "Professional Resume Builder will be available soon. Stay tuned!"
    );
  };

  return (
    <div className="resume-page-layout">

      {/* Left Banner */}
      {/*<div className="side-banner">
        <div className="banner-box">
          <h3>Advertisement</h3>
          <p>Place Banner Here</p>
        </div>
  </div>*/}

      {/* Main Content */}
      <div className="resume-builder-container">

        <div className="resume-hero">
          <h1>Build Your Professional Resume</h1>

          <p>
            Create ATS-friendly resumes and download them instantly.
            Choose from simple or professional resume templates.
          </p>
        </div>

        <div className="resume-cards">

          {/* Simple Resume */}
          <div className="resume-card">
            <div className="resume-badge free">
              FREE
            </div>

            <h2>Simple Resume</h2>

            <p>
              Perfect for freshers and job seekers.
            </p>

            <ul>
              <li>✔ ATS Friendly</li>
              <li>✔ Free PDF Download</li>
              <li>✔ Quick Resume Creation</li>
            </ul>

            <button
              className="resume-btn"
              onClick={() => navigate("/simple-resume")}
            >
              Create Resume
            </button>
          </div>

          {/* Professional Resume */}
          <div className="resume-card">
            <div className="resume-badge premium">
              PREMIUM
            </div>

            <h2>Professional Resume</h2>

            <p>
              Premium Templates designed for professionals.
            </p>

            <p className="coming-soon-text">
              Launching Soon 🚀
            </p>

            <ul>
              <li>✔ Modern Templates</li>
              <li>✔ Premium Layouts</li>
              <li>✔ Professional Design</li>
            </ul>

            <button
              className="resume-btn premium-btn"
              onClick={handleProfessionalResume}
            >
              Coming Soon
            </button>
          </div>

        </div>
      </div>

     {/* Right Banner */}
    {/*  <div className="side-banner">
        <div className="banner-box">
          <h3>Advertisement</h3>
          <p>Place Banner Here</p>
        </div>
  </div>  */}

    </div>
  );
}

export default ResumeBuilder;