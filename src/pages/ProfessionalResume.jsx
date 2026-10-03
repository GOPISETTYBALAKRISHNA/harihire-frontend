import { useNavigate } from "react-router-dom";

function ProfessionalResume() {

  const navigate = useNavigate();

  const templates = [
    {
      id: 1,
      name: "Resume 1",
      image: "/templates/template1.jpg"
    },
    {
      id: 2,
      name: "Resume 2",
      image: "/templates/template2.jpg"
    },
    {
      id: 3,
      name: "Resume 3",
      image: "/templates/template3.jpg"
    },
    {
      id: 4,
      name: "Resume 4",
      image: "/templates/template4.jpg"
    },
    {
      id: 5,
      name: "Resume 5",
      image: "/templates/template5.jpg"
    },
    {
      id: 6,
      name: "Resume 6",
      image: "/templates/template6.jpg"
    }
  ];

  const selectTemplate = (template) => {

    localStorage.setItem(
      "selectedResumeTemplate",
      template.name
    );

    navigate("/simple-resume");
  };

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "30px auto"
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "30px"
        }}
      >
        Select Templates
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(300px,1fr))",
          gap: "20px"
        }}
      >
        {templates.map((template) => (
          <div
            key={template.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              overflow: "hidden",
              cursor: "pointer"
            }}
            onClick={() =>
              selectTemplate(template)
            }
          >
            <img
              src={template.image}
              alt={template.name}
              style={{
                width: "100%",
                height: "400px",
                objectFit: "cover"
              }}
            />

            <div
              style={{
                padding: "15px",
                textAlign: "center"
              }}
            >
              <h4>{template.name}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfessionalResume;