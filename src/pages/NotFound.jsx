import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "80px 20px"
      }}
    >
      <h1
        style={{
          fontSize: "80px",
          marginBottom: "10px",
          color: "#1976d2"
        }}
      >
        404
      </h1>

      <h2>Page Not Found</h2>

      <p>
        Sorry, the page you are looking for does not exist.
      </p>

      <Link
        to="/"
        style={{
          display: "inline-block",
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#1976d2",
          color: "white",
          textDecoration: "none",
          borderRadius: "5px"
        }}
      >
        Go To Home
      </Link>
    </div>
  );
}

export default NotFound;