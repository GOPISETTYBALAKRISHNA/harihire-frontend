import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import api from "../axiosConfig";
import AdBanner from "../components/AdBanner";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);

  // =====================================================
  // APPLICATION STATES
  // =====================================================

  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [checkingApplication, setCheckingApplication] =
    useState(true);

  const [applying, setApplying] = useState(false);

  const [applyMessage, setApplyMessage] = useState("");
  const [applyError, setApplyError] = useState("");

  // =====================================================
  // SHARE STATES
  // =====================================================

  const [showShareOptions, setShowShareOptions] =
    useState(false);

  const [copyMessage, setCopyMessage] =
    useState("");

  // =====================================================
  // GET CURRENT USER
  // =====================================================

  const getUser = () => {
    try {
      const user = localStorage.getItem("user");

      if (!user) {
        return null;
      }

      return JSON.parse(user);
    } catch (error) {
      console.error("User parse error:", error);
      return null;
    }
  };

  // =====================================================
  // LOAD JOB DETAILS
  // =====================================================

  useEffect(() => {
    const loadJobDetails = async () => {
      try {
        const response = await api.get(`/jobs/${id}`);

        setJob(response.data);
      } catch (error) {
        console.error("Job Details Error:", error);
      }
    };

    loadJobDetails();
  }, [id]);

  // =====================================================
  // CHECK ALREADY APPLIED
  // =====================================================

  useEffect(() => {
    const checkAlreadyApplied = async () => {
      const user = getUser();

      if (!user || !user.id) {
        setAlreadyApplied(false);
        setCheckingApplication(false);
        return;
      }

      try {
        setCheckingApplication(true);

        const response = await api.get(
          `/applications/check/${user.id}/${id}`
        );

        setAlreadyApplied(response.data === true);
      } catch (error) {
        console.error(
          "Already Applied Check Error:",
          error
        );

        setAlreadyApplied(false);
      } finally {
        setCheckingApplication(false);
      }
    };

    checkAlreadyApplied();
  }, [id]);

  // =====================================================
  // SEO DATA
  // =====================================================

  const seoTitle = job
    ? `${job.jobTitle || "Job"} at ${
        job.companyName || "Company"
      } | HariHire`
    : "Job Details | HariHire";

  const seoDescription = job
    ? `Apply for ${
        job.jobTitle || "this job"
      } at ${
        job.companyName || "the company"
      }${
        job.location
          ? ` in ${job.location}`
          : ""
      }. Find job details, salary, experience, qualification and application information on HariHire.`
    : "Find job details and apply for the latest jobs on HariHire.";

  const canonicalUrl =
    `${window.location.origin}/job/${id}`;

  const seoKeywords = job
    ? [
        job.jobTitle,
        job.companyName,
        job.category,
        job.jobCategory,
        job.subCategory,
        job.location,
        job.jobType,
        job.experience,
        "HariHire",
        "jobs",
        "job vacancies",
        "apply jobs",
      ]
        .filter(Boolean)
        .join(", ")
    : "HariHire, jobs, job vacancies, apply jobs";

  const jobImage =
    `job?.imageUrl` ||
    `${window.location.origin}/banner1.jpg.jpg`;

  // =====================================================
  // APPLY JOB
  // =====================================================

  const handleApply = async () => {
    const user = getUser();

    // LOGIN CHECK
    if (!user || !user.id) {
      alert("Please login to apply for this job.");
      navigate("/login");
      return;
    }

    // ALREADY APPLIED CHECK
    if (alreadyApplied) {
      setApplyMessage(
        "You have already applied for this job."
      );
      return;
    }

    // JOB CHECK
    if (!job || !job.id) {
      return;
    }

    try {
      setApplying(true);
      setApplyMessage("");
      setApplyError("");

      const applicationData = {
        userId: user.id,
        jobId: job.id,
      };

      await api.post(
        "/applications/apply",
        applicationData
      );

      setAlreadyApplied(true);

      setApplyMessage(
        "Application submitted successfully!"
      );
    } catch (error) {
      console.error(
        "Apply Job Error:",
        error
      );

      if (
        error.response &&
        (
          error.response.status === 400 ||
          error.response.status === 409
        )
      ) {
        setAlreadyApplied(true);

        setApplyMessage(
          "You have already applied for this job."
        );
      } else {
        setApplyError(
          "Unable to submit application. Please try again."
        );
      }
    } finally {
      setApplying(false);
    }
  };

  // =====================================================
  // GET JOB SHARE LINK
  // =====================================================

  const getJobShareLink = () => {
    return `${window.location.origin}/job/${id}`;
  };

  // =====================================================
  // SHARE JOB
  // =====================================================

  const handleShareJob = async () => {
    if (!job) {
      return;
    }

    const shareUrl =
      getJobShareLink();

    const shareTitle =
      `${job.jobTitle} - ${job.companyName}`;

    const shareText =
      `Check out this job opportunity at ${job.companyName}: ${job.jobTitle}`;

    if (
      navigator.share &&
      typeof navigator.share === "function"
    ) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });

        return;
      } catch (error) {
        console.log(
          "Native share cancelled:",
          error
        );
      }
    }

    setShowShareOptions(true);
  };

  // =====================================================
  // COPY JOB LINK
  // =====================================================

  const handleCopyLink = async () => {
    const shareUrl =
      `${window.location.origin}/job/${id}`;

    try {
      if (
        navigator.clipboard &&
        window.isSecureContext
      ) {
        await navigator.clipboard.writeText(
          shareUrl
        );
      } else {
        const textArea =
          document.createElement("textarea");

        textArea.value = shareUrl;

        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "0";

        document.body.appendChild(textArea);

        textArea.focus();
        textArea.select();

        document.execCommand("copy");

        document.body.removeChild(textArea);
      }

      setCopyMessage(
        "Job link copied successfully!"
      );

      setTimeout(() => {
        setCopyMessage("");
      }, 2500);
    } catch (error) {
      console.error(
        "Copy Link Error:",
        error
      );

      setCopyMessage(
        "Unable to copy job link."
      );

      setTimeout(() => {
        setCopyMessage("");
      }, 2500);
    }
  };

  // =====================================================
  // WHATSAPP SHARE
  // =====================================================

  const handleWhatsAppShare = () => {
    if (!job) {
      return;
    }

    const shareUrl =
      getJobShareLink();

    const message =
      `Check out this job opportunity at ${job.companyName}: ${job.jobTitle}\n\n${shareUrl}`;

    const whatsappUrl =
      `https://wa.me/?text=${encodeURIComponent(
        message
      )}`;

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // =====================================================
  // EMAIL SHARE
  // =====================================================

  const handleEmailShare = () => {
    if (!job) {
      return;
    }

    const shareUrl =
      getJobShareLink();

    const subject =
      `Job Opportunity: ${job.jobTitle}`;

    const body =
      `Hi,

I found this job opportunity at ${job.companyName}.

Job: ${job.jobTitle}

View Job:
${shareUrl}`;

    window.location.href =
      `mailto:?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(
        body
      )}`;
  };

  // =====================================================
  // CLOSE SHARE OPTIONS
  // =====================================================

  const closeShareOptions = () => {
    setShowShareOptions(false);
  };

  // =====================================================
  // JOB POSTING STRUCTURED DATA
  // =====================================================

  const jobPostingSchema = job
    ? {
        "@context": "https://schema.org",
        "@type": "JobPosting",

        title:
          job.jobTitle ||
          "Job Opportunity",

        description:
          job.description ||
          seoDescription,

        datePosted:
          job.postedDate ||
          job.createdAt ||
          undefined,

        employmentType:
          job.jobType ||
          undefined,

        hiringOrganization: {
          "@type": "Organization",

          name:
            job.companyName ||
            "Company",

          sameAs:
            job.companyWebsite ||
            undefined,

          logo:
            job.companyLogo ||
            undefined,
        },

        jobLocation: job.location
          ? {
              "@type": "Place",

              address: {
                "@type":
                  "PostalAddress",

                addressLocality:
                  job.location,

                addressCountry:
                  "IN",
              },
            }
          : undefined,

        baseSalary: job.salary
          ? {
              "@type":
                "MonetaryAmount",

              currency: "INR",

              value: {
                "@type":
                  "QuantitativeValue",

                value:
                  Number(
                    String(job.salary)
                      .replace(/[^0-9.]/g, "")
                  ) || undefined,

                unitText: "MONTH",
              },
            }
          : undefined,

        qualifications:
          job.qualification ||
          undefined,

        experienceRequirements:
          job.experience ||
          undefined,

        url: canonicalUrl,
      }
    : null;

  // =====================================================
  // BREADCRUMB STRUCTURED DATA
  // =====================================================

  const breadcrumbSchema = job
    ? {
        "@context": "https://schema.org",

        "@type":
          "BreadcrumbList",

        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item:
              window.location.origin,
          },

          {
            "@type": "ListItem",
            position: 2,
            name: "Jobs",
            item:
              `${window.location.origin}/jobs`,
          },

          {
            "@type": "ListItem",
            position: 3,
            name:
              job.jobTitle ||
              "Job Details",
            item: canonicalUrl,
          },
        ],
      }
    : null;

  // =====================================================
  // LOADING
  // =====================================================

  if (!job) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h2>
          Loading...
        </h2>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div
      style={{
        padding: "30px",
        minHeight: "100vh",
        backgroundColor: "#f5f7fa",
      }}
    >

      {/* =================================================
          SEO
      ================================================= */}

      <Helmet>

        <title>
          {seoTitle}
        </title>

        <meta
          name="description"
          content={seoDescription}
        />

        <meta
          name="keywords"
          content={seoKeywords}
        />

        <meta
          name="robots"
          content="index, follow"
        />

        <meta
          name="author"
          content="HariHire"
        />

        {/* CANONICAL */}

        <link
          rel="canonical"
          href={canonicalUrl}
        />

        {/* OPEN GRAPH */}

        <meta
          property="og:type"
          content="website"
        />

        <meta
          property="og:title"
          content={seoTitle}
        />

        <meta
          property="og:description"
          content={seoDescription}
        />

        <meta
          property="og:url"
          content={canonicalUrl}
        />

        <meta
          property="og:site_name"
          content="HariHire"
        />

        <meta
          property="og:image"
          content={jobImage}
        />

        {/* TWITTER */}

        <meta
          name="twitter:card"
          content="summary_large_image"
        />

        <meta
          name="twitter:title"
          content={seoTitle}
        />

        <meta
          name="twitter:description"
          content={seoDescription}
        />

        <meta
          name="twitter:image"
          content={jobImage}
        />

        {/* JOB POSTING SCHEMA */}

        {jobPostingSchema && (
          <script type="application/ld+json">
            {JSON.stringify(
              jobPostingSchema
            )}
          </script>
        )}

        {/* BREADCRUMB SCHEMA */}

        {breadcrumbSchema && (
          <script type="application/ld+json">
            {JSON.stringify(
              breadcrumbSchema
            )}
          </script>
        )}

      </Helmet>

      {/* =================================================
          TOP ADVERTISEMENT
      ================================================= */}

      <AdBanner />

      {/* =================================================
          BREADCRUMB
      ================================================= */}

      <div
        style={{
          maxWidth: "900px",
          margin: "15px auto",
          color: "#777",
          fontSize: "14px",
        }}
      >
        <span
          style={{
            cursor: "pointer",
            color: "#1976d2",
          }}
          onClick={() =>
            navigate("/")
          }
        >
          Home
        </span>

        {" / "}

        <span
          style={{
            cursor: "pointer",
            color: "#1976d2",
          }}
          onClick={() =>
            navigate("/jobs")
          }
        >
          Jobs
        </span>

        {" / "}

        <span>
          {job.jobTitle}
        </span>
      </div>

      {/* =================================================
          JOB DETAILS CARD
      ================================================= */}

      <article
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.1)",
        }}
        itemScope
        itemType="https://schema.org/JobPosting"
      >

        {/* JOB TITLE */}

        <h1
          style={{
            marginBottom: "20px",
          }}
          itemProp="title"
        >
          {job.jobTitle}
        </h1>

        {/* COMPANY */}

        <p>
          <b>Company:</b>{" "}
          <span
            itemProp="hiringOrganization"
          >
            {job.companyName}
          </span>
        </p>

        {/* LOCATION */}

        <p>
          <b>Location:</b>{" "}
          <span itemProp="jobLocation">
            {job.location}
          </span>
        </p>

        {/* CATEGORY */}

        {job.category && (
          <p>
            <b>Category:</b>{" "}
            {job.category}
          </p>
        )}

        {/* SUB CATEGORY */}

        {job.subCategory && (
          <p>
            <b>Sub Category:</b>{" "}
            {job.subCategory}
          </p>
        )}

        {/* SALARY */}

        <p>
          <b>Salary:</b>{" "}
          {job.salary
            ? `₹${job.salary}`
            : "Not disclosed"}
        </p>

        {/* EXPERIENCE */}

        <p>
          <b>Experience:</b>{" "}
          <span
            itemProp="experienceRequirements"
          >
            {job.experience}
          </span>
        </p>

        {/* QUALIFICATION */}

        <p>
          <b>Qualification:</b>{" "}
          <span
            itemProp="qualifications"
          >
            {job.qualification}
          </span>
        </p>

        {/* JOB TYPE */}

        <p>
          <b>Job Type:</b>{" "}
          <span
            itemProp="employmentType"
          >
            {job.jobType}
          </span>
        </p>

        {/* WORK MODE */}

        {job.workMode && (
          <p>
            <b>Work Mode:</b>{" "}
            {job.workMode}
          </p>
        )}

        {/* APPLY TYPE */}

        {job.applyType && (
          <p>
            <b>Apply Type:</b>{" "}
            {job.applyType}
          </p>
        )}

        {/* DESCRIPTION */}

        <p
          style={{
            marginTop: "20px",
          }}
        >
          <b>Description:</b>
        </p>

        <p
          style={{
            lineHeight: "1.6",
            color: "#444",
          }}
          itemProp="description"
        >
          {job.description}
        </p>

        {/* =================================================
            APPLY SECTION
        ================================================= */}

        <div
          style={{
            marginTop: "30px",
            paddingTop: "20px",
            borderTop:
              "1px solid #eee",
          }}
        >

          <h3
            style={{
              marginTop: 0,
              marginBottom: "15px",
            }}
          >
            📝 Job Application
          </h3>

          {/* APPLY BUTTON */}

          {checkingApplication ? (
            <button
              type="button"
              disabled
              style={{
                backgroundColor:
                  "#9e9e9e",
                color: "white",
                border: "none",
                padding:
                  "12px 25px",
                borderRadius: "7px",
                cursor:
                  "not-allowed",
                fontSize: "15px",
                fontWeight: "600",
              }}
            >
              Checking Application...
            </button>
          ) : alreadyApplied ? (
            <button
              type="button"
              disabled
              style={{
                backgroundColor:
                  "#2e7d32",
                color: "white",
                border: "none",
                padding:
                  "12px 25px",
                borderRadius: "7px",
                cursor:
                  "not-allowed",
                fontSize: "15px",
                fontWeight: "600",
              }}
            >
              ✓ Already Applied
            </button>
          ) : (
            <button
              type="button"
              onClick={handleApply}
              disabled={applying}
              style={{
                backgroundColor:
                  applying
                    ? "#90caf9"
                    : "#1976d2",
                color: "white",
                border: "none",
                padding:
                  "12px 25px",
                borderRadius: "7px",
                cursor:
                  applying
                    ? "not-allowed"
                    : "pointer",
                fontSize: "15px",
                fontWeight: "600",
              }}
            >
              {applying
                ? "Submitting..."
                : "Apply Now →"}
            </button>
          )}

          {/* SUCCESS */}

          {applyMessage && (
            <div
              style={{
                marginTop: "15px",
                backgroundColor:
                  "#e8f5e9",
                color: "#2e7d32",
                padding:
                  "11px 15px",
                borderRadius: "7px",
                display:
                  "inline-block",
                fontWeight: "600",
              }}
            >
              ✅ {applyMessage}
            </div>
          )}

          {/* ERROR */}

          {applyError && (
            <div
              style={{
                marginTop: "15px",
                backgroundColor:
                  "#ffebee",
                color: "#c62828",
                padding:
                  "11px 15px",
                borderRadius: "7px",
                display:
                  "inline-block",
                fontWeight: "600",
              }}
            >
              ❌ {applyError}
            </div>
          )}

        </div>

        {/* =================================================
            SHARE SECTION
        ================================================= */}

        <div
          style={{
            marginTop: "30px",
            paddingTop: "20px",
            borderTop:
              "1px solid #eee",
          }}
        >

          <h3
            style={{
              marginTop: 0,
              marginBottom: "15px",
            }}
          >
            📤 Share this Job
          </h3>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >

            {/* SHARE */}

            <button
              type="button"
              onClick={handleShareJob}
              style={{
                backgroundColor:
                  "#1976d2",
                color: "white",
                border: "none",
                padding:
                  "11px 20px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: "500",
              }}
            >
              📤 Share Job
            </button>

            {/* COPY */}

            <button
              type="button"
              onClick={handleCopyLink}
              style={{
                backgroundColor:
                  "#555",
                color: "white",
                border: "none",
                padding:
                  "11px 20px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "15px",
              }}
            >
              📋 Copy Link
            </button>

          </div>

          {/* COPY MESSAGE */}

          {copyMessage && (
            <div
              style={{
                marginTop: "12px",
                backgroundColor:
                  "#e8f5e9",
                color: "#2e7d32",
                padding:
                  "10px 14px",
                borderRadius: "6px",
                display:
                  "inline-block",
              }}
            >
              ✅ {copyMessage}
            </div>
          )}

          {/* FALLBACK SHARE */}

          {showShareOptions && (
            <div
              style={{
                marginTop: "18px",
                padding: "18px",
                backgroundColor:
                  "#f8f9fa",
                border:
                  "1px solid #ddd",
                borderRadius: "10px",
              }}
            >

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
                  marginBottom:
                    "15px",
                }}
              >

                <h4
                  style={{
                    margin: 0,
                  }}
                >
                  Share Job Using
                </h4>

                <button
                  type="button"
                  onClick={
                    closeShareOptions
                  }
                  style={{
                    backgroundColor:
                      "transparent",
                    border: "none",
                    fontSize:
                      "20px",
                    cursor:
                      "pointer",
                    color: "#555",
                  }}
                >
                  ✕
                </button>

              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >

                {/* WHATSAPP */}

                <button
                  type="button"
                  onClick={
                    handleWhatsAppShare
                  }
                  style={{
                    backgroundColor:
                      "#25D366",
                    color: "white",
                    border: "none",
                    padding:
                      "10px 15px",
                    borderRadius:
                      "6px",
                    cursor:
                      "pointer",
                  }}
                >
                  💬 WhatsApp
                </button>

                {/* EMAIL */}

                <button
                  type="button"
                  onClick={
                    handleEmailShare
                  }
                  style={{
                    backgroundColor:
                      "#555",
                    color: "white",
                    border: "none",
                    padding:
                      "10px 15px",
                    borderRadius:
                      "6px",
                    cursor:
                      "pointer",
                  }}
                >
                  📧 Email
                </button>

                {/* COPY */}

                <button
                  type="button"
                  onClick={
                    handleCopyLink
                  }
                  style={{
                    backgroundColor:
                      "#1976d2",
                    color: "white",
                    border: "none",
                    padding:
                      "10px 15px",
                    borderRadius:
                      "6px",
                    cursor:
                      "pointer",
                  }}
                >
                  📋 Copy Link
                </button>

              </div>
            </div>
          )}

          <p
            style={{
              color: "#777",
              fontSize: "13px",
              marginTop: "12px",
              marginBottom: 0,
            }}
          >
            Share this job with friends and
            help them discover this opportunity.
          </p>

        </div>

        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <button
          type="button"
          onClick={() =>
            navigate("/jobs")
          }
          style={{
            backgroundColor:
              "#1976d2",
            color: "white",
            border: "none",
            padding:
              "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "25px",
          }}
        >
          ← Back to Jobs
        </button>

      </article>

      {/* =================================================
          SEO FOOTER CONTENT
      ================================================= */}

      <section
        style={{
          maxWidth: "900px",
          margin: "30px auto",
          backgroundColor:
            "#ffffff",
          padding: "25px",
          borderRadius: "10px",
          lineHeight: "1.7",
          color: "#555",
        }}
      >

        <h2
          style={{
            color: "#1f2937",
          }}
        >
          {job.jobTitle} - Job Details
        </h2>

        <p>
          Explore the latest{" "}
          <b>
            {job.jobTitle}
          </b>{" "}
          opportunity at{" "}
          <b>
            {job.companyName}
          </b>
          {job.location
            ? ` in ${job.location}`
            : ""}{" "}
          on HariHire.
        </p>

        <p>
          Review the job description,
          qualification, experience,
          salary and application details
          before applying.
        </p>

      </section>

      {/* =================================================
          BOTTOM ADVERTISEMENT
      ================================================= */}

      <div
        style={{
          marginTop: "30px",
        }}
      >
        <AdBanner />
      </div>

    </div>
  );
}

export default JobDetails;