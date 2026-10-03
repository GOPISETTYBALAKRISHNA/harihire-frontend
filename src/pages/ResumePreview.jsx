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

  useEffect(() => {

    const data =
      localStorage.getItem(
        "resumePreview"
      );

    if (data) {

      const parsedResume =
        JSON.parse(data);

      setResume(parsedResume);

      try {

        if (parsedResume.education) {

          setEducations(
            JSON.parse(
              parsedResume.education
            )
          );

        }

        if (parsedResume.skills) {

          setSkills(
            JSON.parse(
              parsedResume.skills
            )
          );

        }
        if (parsedResume.experience) {

          setExperiences(
            JSON.parse(
              parsedResume.experience
            )
          );
        
        }
        
        if (parsedResume.projects) {
        
          setProjects(
            JSON.parse(
              parsedResume.projects
            )
          );
        
        }
        if (parsedResume.certifications) {

          setCertifications(
            JSON.parse(
              parsedResume.certifications
            )
          );
        
        }

      } catch (error) {

        console.log(
          "JSON Parse Error"
        );

      }

    }

  }, []);

  if (!resume) {

    return (

      <h2
        style={{
          textAlign: "center",
          marginTop: "50px"
        }}
      >
        No Resume Found
      </h2>

    );

  }

  return (

    <div
      style={{
        maxWidth: "900px",
        margin: "30px auto",
        background: "#ffffff",
        padding: "40px",
        borderRadius: "10px",
        boxShadow:
          "0 0 15px rgba(0,0,0,0.1)"
      }}
    >

      <div
        style={{
          textAlign: "center",
          marginBottom: "25px"
        }}
      >

        <h1>
          {resume.fullName}
        </h1>

        {resume.email && (
          <p>{resume.email}</p>
        )}

        {resume.phone && (
          <p>{resume.phone}</p>
        )}

        {resume.address && (
          <p>{resume.address}</p>
        )}

      </div>

      <hr />

      {resume.careerObjective && (
        <>
          <h3>
            Career Objective
          </h3>

          <p>
            {resume.careerObjective}
          </p>

          <hr />
        </>
      )}

      {educations.length > 0 &&
        educations.some(
          edu =>
            edu.degree ||
            edu.college ||
            edu.year ||
            edu.percentage
        ) && (
        <>
          <h3>
            Education
          </h3>

          {educations.map(
            (edu, index) => (

              (edu.degree ||
               edu.college ||
               edu.year ||
               edu.percentage) && (

                <div
                  key={index}
                  style={{
                    marginBottom: "15px"
                  }}
                >

                  <strong>
                    {edu.degree}
                  </strong>

                  <br />

                  {edu.college && (
                    <>
                      {edu.college}
                      <br />
                    </>
                  )}

                  {edu.year && (
                    <>
                      {edu.year}
                      <br />
                    </>
                  )}

                  {edu.percentage && (
                    <>
                      CGPA / Percentage :
                      {" "}
                      {edu.percentage}
                    </>
                  )}

                </div>

              )

            )
          )}

          <hr />
        </>
      )}

      {skills.length > 0 &&
        skills.some(
          item => item.skill
        ) && (
        <>
          <h3>
            Skills
          </h3>

          <ul>

            {skills.map(
              (item, index) => (

                item.skill && (
                  <li key={index}>
                    {item.skill}
                  </li>
                )

              )
            )}

          </ul>

          <hr />
        </>
      )}

     {experiences.length > 0 && (

<>

  <h3>Experience</h3>

  {experiences.map(
    (exp, index) => (

      (exp.company ||
       exp.role ||
       exp.duration ||
       exp.description) && (

        <div
          key={index}
          style={{
            marginBottom: "20px"
          }}
        >

          <h4>
            {exp.role}
          </h4>

          <p>
            <strong>
              Company:
            </strong>{" "}
            {exp.company}
          </p>

          <p>
            <strong>
              Duration:
            </strong>{" "}
            {exp.duration}
          </p>

          <p>
            {exp.description}
          </p>

        </div>

      )

    )
  )}

  <hr />

</>

)}

     {projects.length > 0 && (

<>

  <h3>Projects</h3>

  {projects.map(
    (project, index) => (

      (project.projectName ||
       project.technology ||
       project.description) && (

        <div
          key={index}
          style={{
            marginBottom: "20px"
          }}
        >

          <h4>
            {project.projectName}
          </h4>

          <p>
            <strong>
              Technology:
            </strong>{" "}
            {project.technology}
          </p>

          <p>
            {project.description}
          </p>

        </div>

      )

    )
  )}

  <hr />

</>

)}
      {certifications.length > 0 && (

<>
  <h3>
    Certifications
  </h3>

  {certifications.map(
    (cert, index) => (

      (cert.certificationName ||
       cert.organization ||
       cert.year) && (

        <div
          key={index}
          style={{
            marginBottom: "15px"
          }}
        >

          <strong>
            {cert.certificationName}
          </strong>

          <br />

          {cert.organization}

          <br />

          {cert.year}

        </div>

      )

    )
  )}
  <hr/>
</>

)}

      <div
        style={{
          marginTop: "30px",
          textAlign: "center"
        }}
      >

        <button
          onClick={() =>
            navigate(
              "/simple-resume"
            )
          }
          style={{
            padding: "10px 25px",
            backgroundColor:
              "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Back To Edit
        </button>

      </div>

    </div>

  );

}

export default ResumePreview;