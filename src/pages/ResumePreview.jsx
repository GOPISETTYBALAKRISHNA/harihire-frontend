import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ResumePreview() {
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [educations, setEducations] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certifications, setCertifications] = useState([]);

  // Check whether a value contains actual text
  const hasValue = (value) =>
    value !== null &&
    value !== undefined &&
    String(value).trim() !== "";

  // Safely read JSON data stored in localStorage
  const parseArray = (value) => {
    if (!value) return [];

    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  useEffect(() => {
    try {
      const data = localStorage.getItem("resumePreview");

      if (!data) return;

      const parsedResume = JSON.parse(data);
      setResume(parsedResume);

      setEducations(
        parseArray(parsedResume.education).filter(
          (edu) =>
            hasValue(edu.degree) ||
            hasValue(edu.college) ||
            hasValue(edu.year) ||
            hasValue(edu.percentage)
        )
      );

      setSkills(
        parseArray(parsedResume.skills).filter(
          (item) => hasValue(item.skill)
        )
      );

      setExperiences(
        parseArray(parsedResume.experience).filter(
          (exp) =>
            hasValue(exp.company) ||
            hasValue(exp.role) ||
            hasValue(exp.duration) ||
            hasValue(exp.description)
        )
      );

      setProjects(
        parseArray(parsedResume.projects).filter(
          (project) =>
            hasValue(project.projectName) ||
            hasValue(project.technology) ||
            hasValue(project.description)
        )
      );

      setCertifications(
        parseArray(parsedResume.certifications).filter(
          (cert) =>
            hasValue(cert.certificationName) ||
            hasValue(cert.organization) ||
            hasValue(cert.year)
        )
      );
    } catch (error) {
      console.error("Unable to load resume:", error);
    }
  }, []);

  if (!resume) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        No Resume Found
      </h2>
    );
  }

  const hasContact =
    hasValue(resume.email) ||
    hasValue(resume.phone) ||
    hasValue(resume.address);

  const hasName = hasValue(resume.fullName);
  const hasObjective = hasValue(resume.careerObjective);

  const hasAnyContent =
    hasName ||
    hasContact ||
    hasObjective ||
    educations.length > 0 ||
    skills.length > 0 ||
    experiences.length > 0 ||
    projects.length > 0 ||
    certifications.length > 0;

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "30px auto",
        background: "#ffffff",
        padding: "40px",
        borderRadius: "10px",
        boxShadow: "0 0 15px rgba(0,0,0,0.1)",
      }}
    >
      {!hasAnyContent ? (
        <p style={{ textAlign: "center" }}>
          Resume details enter chesi preview choodandi.
        </p>
      ) : (
        <>
          {(hasName || hasContact) && (
            <div
              style={{
                textAlign: "center",
                marginBottom: "25px",
              }}
            >
              {hasName && <h1>{resume.fullName}</h1>}
              {hasValue(resume.email) && <p>{resume.email}</p>}
              {hasValue(resume.phone) && <p>{resume.phone}</p>}
              {hasValue(resume.address) && <p>{resume.address}</p>}
            </div>
          )}

          {(hasName || hasContact) && <hr />}

          {hasObjective && (
            <>
              <h3>Career Objective</h3>
              <p>{resume.careerObjective}</p>
              <hr />
            </>
          )}

          {educations.length > 0 && (
            <>
              <h3>Education</h3>

              {educations.map((edu, index) => (
                <div key={index} style={{ marginBottom: "15px" }}>
                  {hasValue(edu.degree) && (
                    <strong>{edu.degree}</strong>
                  )}

                  {hasValue(edu.college) && (
                    <p>{edu.college}</p>
                  )}

                  {hasValue(edu.year) && <p>{edu.year}</p>}

                  {hasValue(edu.percentage) && (
                    <p>CGPA / Percentage: {edu.percentage}</p>
                  )}
                </div>
              ))}

              <hr />
            </>
          )}

          {skills.length > 0 && (
            <>
              <h3>Skills</h3>
              <ul>
                {skills.map((item, index) => (
                  <li key={index}>{item.skill}</li>
                ))}
              </ul>
              <hr />
            </>
          )}

          {experiences.length > 0 && (
            <>
              <h3>Experience</h3>

              {experiences.map((exp, index) => (
                <div key={index} style={{ marginBottom: "20px" }}>
                  {hasValue(exp.role) && <h4>{exp.role}</h4>}

                  {hasValue(exp.company) && (
                    <p>
                      <strong>Company:</strong> {exp.company}
                    </p>
                  )}

                  {hasValue(exp.duration) && (
                    <p>
                      <strong>Duration:</strong> {exp.duration}
                    </p>
                  )}

                  {hasValue(exp.description) && (
                    <p>{exp.description}</p>
                  )}
                </div>
              ))}

              <hr />
            </>
          )}

          {projects.length > 0 && (
            <>
              <h3>Projects</h3>

              {projects.map((project, index) => (
                <div key={index} style={{ marginBottom: "20px" }}>
                  {hasValue(project.projectName) && (
                    <h4>{project.projectName}</h4>
                  )}

                  {hasValue(project.technology) && (
                    <p>
                      <strong>Technology:</strong> {project.technology}
                    </p>
                  )}

                  {hasValue(project.description) && (
                    <p>{project.description}</p>
                  )}
                </div>
              ))}

              <hr />
            </>
          )}

          {certifications.length > 0 && (
            <>
              <h3>Certifications</h3>

              {certifications.map((cert, index) => (
                <div key={index} style={{ marginBottom: "15px" }}>
                  {hasValue(cert.certificationName) && (
                    <strong>{cert.certificationName}</strong>
                  )}

                  {hasValue(cert.organization) && (
                    <p>{cert.organization}</p>
                  )}

                  {hasValue(cert.year) && <p>{cert.year}</p>}
                </div>
              ))}

              <hr />
            </>
          )}
        </>
      )}

      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <button
          onClick={() => navigate("/simple-resume")}
          style={{
            padding: "10px 25px",
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Back To Edit
        </button>
      </div>
    </div>
  );
}

export default ResumePreview;