import {  useEffect, useState } from "react";
import api from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import "../styles/SimpleResume.css";

function SimpleResume() {

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

    const [resume, setResume] = useState({

        userId: user ? user.id : "",
        fullName: user ? user.fullName : "",
        email: user ? user.email : "",
        phone: user ? user.phone : "",
        address: user ? user.address : "",
        education: user ? user.education : "",
        skills: user ? user.skills : "",
        experience: user ? user.experience : "",
      
        objective: "",
        projects: "",
        certifications: "",
      
        resumeType: "SIMPLE",
      
        selectedTemplate:
          
        localStorage.getItem("selectedResumeTemplate") ||
          "Simple Resume",
          
        targetRole: "Default",

careerObjective:
  "Looking for an opportunity to utilize my skills and contribute to organizational growth while continuously learning and improving professionally.",

          
      });
      const [educations, setEducations] = useState([
        {
          degree: "",
          college: "",
          year: "",
          percentage: ""
        }
      ]);
      const [skillsList, setSkillsList] = useState([
        {
        skill:""
        }
      ]);
      const [experiences, setExperiences] = useState([
        {
          company: "",
          role: "",
          duration: "",
          description: ""
        }
      ]);
      const [projectsList, setProjectsList] = useState([
        {
          projectName: "",
          technology: "",
          description: ""
        }
      ]);
      const [certificationsList, setCertificationsList] = useState([
        {
          certificationName: "",
          organization: "",
          year: ""
        }
      ]);
      const objectiveTemplates = {

        Default:
          "Looking for an opportunity to utilize my skills and contribute to organizational growth while continuously learning and improving professionally.",
      
        "Java Developer":
          "Motivated Java Developer seeking an opportunity to apply my knowledge of Java, Spring Boot, SQL, and web technologies while contributing to organizational success.",
      
        "Data Analyst":
          "Aspiring Data Analyst with strong analytical skills seeking an opportunity to leverage SQL, Excel, and Power BI for data-driven decision making.",
      
        "Customer Support Executive":
          "Dedicated customer-focused professional seeking a Customer Support role to provide excellent customer service and problem resolution."
      
      };
      
      const handleRoleChange = (e) => {
      
        const role = e.target.value;
      
        setResume({
          ...resume,
          targetRole: role,
          careerObjective:
            objectiveTemplates[role] ||
            objectiveTemplates.Default
        });
      
      };
      useEffect(() => {

        loadResume();
      
      }, []);
      
      const loadResume = async () => {

        try {
      
          const response =
            await api.get(
              `/resume/user/${user.id}`
            );
      
          if (response.data) {
      
            setResume(response.data);
      
            if (response.data.education) {
      
              setEducations(
                JSON.parse(
                  response.data.education
                )
              );
      
            }
      
            if (response.data.skills) {
      
              setSkillsList(
                JSON.parse(
                  response.data.skills
                )
              );
      
            }
            if (response.data.experience) {

              setExperiences(
                JSON.parse(
                  response.data.experience
                )
              );
            
            }
            if (response.data.projects) {

              setProjectsList(
                JSON.parse(
                  response.data.projects
                )
              );
            
            }
            if (response.data.certifications) {

              setCertificationsList(
                JSON.parse(
                  response.data.certifications
                )
              );
            
            }
      
          }
      
        } catch (error) {
      
          console.log(
            "No saved resume found"
          );
      
        }
      
      };

  const handleChange = (e) => {

    setResume({

      ...resume,

      [e.target.name]:
        e.target.value

    });

  };
  const addEducation = () => {

    setEducations([
      ...educations,
      {
        degree: "",
        college: "",
        year: "",
        percentage: ""
      }
    ]);
  
  };
  
  const handleEducationChange = (
    index,
    e
  ) => {
  
    const values = [...educations];
  
    values[index][e.target.name] =
      e.target.value;
  
    setEducations(values);
  
  };
  const addSkill = () => {

    setSkillsList([
      ...skillsList,
      {
        skill: ""
      }
    ]);
  
  };
  
  const handleSkillChange = (
    index,
    e
  ) => {
  
    const values = [...skillsList];
  
    values[index].skill =
      e.target.value;
  
    setSkillsList(values);
  
  };
  const addExperience = () => {

    setExperiences([
      ...experiences,
      {
        company: "",
        role: "",
        duration: "",
        description: ""
      }
    ]);
  
  };
  
  const handleExperienceChange = (
    index,
    e
  ) => {
  
    const values = [...experiences];
  
    values[index][e.target.name] =
      e.target.value;
  
    setExperiences(values);
  
  };
  const addProject = () => {

    setProjectsList([
      ...projectsList,
      {
        projectName: "",
        technology: "",
        description: ""
      }
    ]);
  
  };
  
  const handleProjectChange = (
    index,
    e
  ) => {
  
    const values = [...projectsList];
  
    values[index][e.target.name] =
      e.target.value;
  
    setProjectsList(values);
  
  };
  const addCertification = () => {

    setCertificationsList([
      ...certificationsList,
      {
        certificationName: "",
        organization: "",
        year: ""
      }
    ]);
  
  };
  
  const handleCertificationChange = (
    index,
    e
  ) => {
  
    const values = [...certificationsList];
  
    values[index][e.target.name] =
      e.target.value;
  
    setCertificationsList(values);
  
  };


  const handleSave = async () => {

    const resumeData = {

      ...resume,
    
      education: JSON.stringify(
        educations
      ),
    
      skills: JSON.stringify(
        skillsList
      ),
    
      experience: JSON.stringify(
        experiences
      ),
      projects: JSON.stringify(
        projectsList
      ),
      certifications: JSON.stringify(
        certificationsList
      )
    
    };
  
    try {
  
      await api.post(
        "/resume/save",
        resumeData
      );
  
      alert(
        "Resume Saved Successfully"
      );
  
    } catch (error) {
  
      console.log(error);
  
      alert(
        "Failed To Save Resume"
      );
  
    }
  
  };
  const navigate = useNavigate();

  const handlePreview = () => {

    const previewData = {

      ...resume,
    
      education: JSON.stringify(
        educations
      ),
    
      skills: JSON.stringify(
        skillsList
      ),
    
      experience: JSON.stringify(
        experiences
      ),
    
      projects: JSON.stringify(
        projectsList
      ),
      certifications: JSON.stringify(
        certificationsList
      )
    
    };  
    localStorage.setItem(
      "resumePreview",
      JSON.stringify(
        previewData
      )
    );
  
    navigate(
      "/resume-preview"
    );
  
  };
  const handleDownload = () => {

    window.open(
      `${api.defaults.baseURL}/resume/download/${resume.userId}`,
      "_blank"
    );
  
  };


  return (

<div className="resume-container">
<h2 className="resume-title">
 Resume Builder
</h2>


      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        value={resume.fullName || ""}
        onChange={handleChange}
        className="resume-input"

      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={resume.email || ""}
        onChange={handleChange}
        className="resume-input"

      />

      <input
        type="text"
        name="phone"
        placeholder="Phone"
        value={resume.phone || ""}
        onChange={handleChange}
        className="resume-input"

      />

      <textarea
        name="address"
        placeholder="Address"
        value={resume.address || ""}
        onChange={handleChange}
        rows="3"
        className="resume-textarea"
       
      />

<h3>Career Objective</h3>

<select
  value={resume.targetRole}
  onChange={handleRoleChange}
  className="resume-select"
>
  <option>Default</option>
  <option>Java Developer</option>
  <option>Data Analyst</option>
  <option>Customer Support Executive</option>
</select>

<textarea
  name="careerObjective"
  value={resume.careerObjective || ""}
  onChange={handleChange}
  rows="5"
  className="resume-textarea"
/>

     <h3>
  Education

  <button
    type="button"
    onClick={addEducation}
    className="add-btn"
  >
    +
  </button>
</h3>

{educations.map((edu, index) => (

  <div
  key={index}
  className="item-card"
 >

    <input
      type="text"
      name="degree"
      placeholder="Qualification/Degree"
      value={edu.degree}
      onChange={(e) =>
        handleEducationChange(index, e)
      }
      className="resume-input"
      
    />

    <input
      type="text"
      name="college"
      placeholder="College"
      value={edu.college}
      onChange={(e) =>
        handleEducationChange(index, e)
      }
      className="resume-input"

    />

    <input
      type="text"
      name="year"
      placeholder="Year"
      value={edu.year}
      onChange={(e) =>
        handleEducationChange(index, e)
      }
      className="resume-input"
     
    />

    <input
      type="text"
      name="percentage"
      placeholder="CGPA / Percentage"
      value={edu.percentage}
      onChange={(e) =>
        handleEducationChange(index, e)
      }
      className="resume-input"

    />

  </div>

))}
<h3>
  Skills

  <button
    type="button"
    onClick={addSkill}
    className="add-btn"
  >
    +
  </button>

</h3>

{skillsList.map((item, index) => (

  <div
    key={index}
   
  >

    <input
      type="text"
      placeholder="Skill"
      value={item.skill}
      onChange={(e) =>
        handleSkillChange(
          index,
          e
        )
      }
      className="resume-input"
      
    />

  </div>

))}

<h3>
  Experience

  <button
    type="button"
    onClick={addExperience}
    className="add-btn"
  >
    +
  </button>

</h3>

{experiences.map((exp, index) => (

  <div
    key={index}
    className="item-card"
  >

    <input
      type="text"
      name="company"
      placeholder="Company Name"
      value={exp.company}
      onChange={(e) =>
        handleExperienceChange(index, e)
      }
      className="resume-input"
    />

    <input
      type="text"
      name="role"
      placeholder="Role"
      value={exp.role}
      onChange={(e) =>
        handleExperienceChange(index, e)
      }
      className="resume-textarea"
    />

    <input
      type="text"
      name="duration"
      placeholder="Duration"
      value={exp.duration}
      onChange={(e) =>
        handleExperienceChange(index, e)
      }
      className="resume-textarea"
    />

    <textarea
      name="description"
      placeholder="Work Description"
      value={exp.description}
      onChange={(e) =>
        handleExperienceChange(index, e)
      }
      className="resume-input"
    />

  </div>

))}

<h3>
  Projects

  <button
    type="button"
    onClick={addProject}
    className="add-btn"
  >
    +
  </button>

</h3>

{projectsList.map(
  (project, index) => (

    <div
      key={index}
      className="item-card"
    >

      <input
        type="text"
        name="projectName"
        placeholder="Project Name"
        value={project.projectName}
        onChange={(e) =>
          handleProjectChange(
            index,
            e
          )
        }
        className="resume-input"

      />

      <input
        type="text"
        name="technology"
        placeholder="Technology Used"
        value={project.technology}
        onChange={(e) =>
          handleProjectChange(
            index,
            e
          )
        }
        className="resume-textarea"
        
      />

      <textarea
        name="description"
        placeholder="Project Description"
        value={project.description}
        onChange={(e) =>
          handleProjectChange(
            index,
            e
          )
        }
        className="resume-textarea"
        rows="3"
       
      />

    </div>

  )
)}
      <h3>
  Certifications

  <button
    type="button"
    onClick={addCertification}
    className="add-btn"
  >
    +
  </button>
</h3>

{certificationsList.map(
  (cert, index) => (

    <div
      key={index}
      className="item-card"
    >

      <input
        type="text"
        name="certificationName"
        placeholder="Certification Name"
        value={cert.certificationName}
        onChange={(e) =>
          handleCertificationChange(
            index,
            e
          )
        }
        className="resume-input"

      />

      <input
        type="text"
        name="organization"
        placeholder="Organization"
        value={cert.organization}
        onChange={(e) =>
          handleCertificationChange(
            index,
            e
          )
        }
        className="resume-input"
      />

      <input
        type="text"
        name="year"
        placeholder="Year"
        value={cert.year}
        onChange={(e) =>
          handleCertificationChange(
            index,
            e
          )
        }
        className="resume-input"
      />

    </div>

  )
)}

   <div className="action-bar">

<button
  className="save-btn"
  onClick={handleSave}
>
  Save Resume
</button>

<button
  className="preview-btn"
  onClick={handlePreview}
>
  Preview Resume
</button>

<button
  className="download-btn"
  onClick={handleDownload}
>
  Download PDF
</button>

</div>

    </div>

  );

}

export default SimpleResume;