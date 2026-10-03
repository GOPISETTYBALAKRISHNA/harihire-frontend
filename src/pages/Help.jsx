import React from "react";

function Help() {
  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "30px auto",
        padding: "30px",
        backgroundColor: "#ffffff",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
      }}
    >
      <h1>Help Center</h1>

      {/* ABOUT US */}

      <section style={{ marginTop: "30px" }}>
        <h2>About HariHire</h2>

        <p>
          HariHire is a job portal designed to connect
          job seekers with recruiters and companies.
          Our goal is to provide fast, simple and
          reliable hiring solutions across India.
        </p>

        <p>
          Users can search jobs, apply online,
          upload resumes, save jobs and receive
          job notifications.
        </p>
      </section>

      {/* CONTACT US */}

      <section style={{ marginTop: "30px" }}>
        <h2>Contact Us</h2>

        <p>Email: harihirejobsupport@gmail.com.com</p>

        <p>Website: www.harihire.com</p>

        <p>Location: Hyderabad, Telangana, India</p>
      </section>

      {/* PRIVACY POLICY */}

      <section style={{ marginTop: "30px" }}>
        <h2>Privacy Policy</h2>

        <p>
          HariHire collects user information such as
          name, email, phone number, resume and profile
          details only for recruitment purposes.
        </p>

        <p>
          We do not sell user data to third parties.
          Information is shared only with recruiters
          when users apply for jobs.
        </p>

        <p>
          User information is stored securely and used
          only to improve hiring services.
        </p>
      </section>

      {/* TERMS & CONDITIONS */}

      <section style={{ marginTop: "30px" }}>
        <h2>Terms & Conditions</h2>

        <p>
          Users must provide accurate information while
          creating accounts and applying for jobs.
        </p>

        <p>
          Recruiters are responsible for posting genuine
          job opportunities and maintaining professional
          communication.
        </p>

        <p>
          HariHire reserves the right to remove fake,
          misleading or fraudulent content.
        </p>
      </section>

      {/* FAQ */}

      <section style={{ marginTop: "30px" }}>
        <h2>Frequently Asked Questions</h2>

        <h4>How do I apply for a job?</h4>
        <p>
          Open the job details page and click Apply.
        </p>

        <h4>How do I upload my resume?</h4>
        <p>
          Go to My Profile and upload your resume.
        </p>

        <h4>How do I reset my password?</h4>
        <p>
          Use the Forgot Password option on the login page.
        </p>

        <h4>How can recruiters post jobs?</h4>
        <p>
          Recruiters can login and use the Post Job feature.
        </p>
      </section>
    </div>
  );
}

export default Help;