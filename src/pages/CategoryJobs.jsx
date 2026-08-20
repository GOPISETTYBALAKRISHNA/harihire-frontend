import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../axiosConfig";

function CategoryJobs() {
  const navigate = useNavigate();
  const { category } = useParams();

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);

  const [searchText, setSearchText] = useState("");

  const [loading, setLoading] = useState(true);
  const [savingJobId, setSavingJobId] = useState(null);
  const [error, setError] = useState("");

  // =====================================================
  // GET USER
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
  // CATEGORY NAME
  // =====================================================

  const getCategoryName = () => {
    if (!category) {
      return "";
    }

    return category
      .split("-")
      .map((word) => {
        return (
          word.charAt(0).toUpperCase() +
          word.slice(1)
        );
      })
      .join(" ");
  };

  // =====================================================
  // SEO CATEGORY DATA
  // =====================================================

  const getSeoData = () => {
    const seoData = {
      software: {
        title: "Software Jobs | IT Jobs | HariHire",
        description:
          "Find the latest Software and IT jobs on HariHire. Explore developer, testing, support, full stack and other IT job opportunities for freshers and experienced candidates.",
        keywords:
          "software jobs, IT jobs, developer jobs, programming jobs, fresher IT jobs, software jobs India",
      },

      banking: {
        title: "Banking Jobs | Finance Jobs | HariHire",
        description:
          "Find the latest Banking, Finance, Insurance and FinTech jobs on HariHire. Explore opportunities for freshers and experienced professionals.",
        keywords:
          "banking jobs, finance jobs, bank jobs, insurance jobs, fintech jobs, banking jobs India",
      },

      government: {
        title: "Government Jobs | Sarkari Jobs | HariHire",
        description:
          "Find the latest Central Government and State Government job opportunities on HariHire. Explore government jobs for freshers and experienced candidates.",
        keywords:
          "government jobs, govt jobs, sarkari jobs, central government jobs, state government jobs",
      },

      bpo: {
        title: "BPO Jobs | Customer Support Jobs | HariHire",
        description:
          "Find the latest BPO, voice, non-voice and customer support jobs on HariHire. Explore opportunities for freshers and experienced candidates.",
        keywords:
          "BPO jobs, voice jobs, non voice jobs, customer support jobs, BPO jobs India",
      },

      healthcare: {
        title: "Healthcare Jobs | Medical Jobs | HariHire",
        description:
          "Find healthcare and medical job opportunities on HariHire. Explore jobs for healthcare professionals, freshers and experienced candidates.",
        keywords:
          "healthcare jobs, medical jobs, hospital jobs, healthcare careers",
      },

      education: {
        title: "Education Jobs | Teaching Jobs | HariHire",
        description:
          "Find the latest teaching and education jobs on HariHire. Explore opportunities for teachers, lecturers, trainers and education professionals.",
        keywords:
          "education jobs, teaching jobs, teacher jobs, lecturer jobs, faculty jobs",
      },

      finance: {
        title: "Finance Jobs | Accounting Jobs | HariHire",
        description:
          "Find the latest finance, accounting and financial services jobs on HariHire. Explore opportunities for freshers and experienced professionals.",
        keywords:
          "finance jobs, accounting jobs, accountant jobs, financial analyst jobs",
      },

      marketing: {
        title: "Marketing Jobs | Digital Marketing Jobs | HariHire",
        description:
          "Find the latest marketing and digital marketing jobs on HariHire. Explore opportunities in marketing, SEO, social media and business growth.",
        keywords:
          "marketing jobs, digital marketing jobs, SEO jobs, social media jobs",
      },

      hr: {
        title: "HR Jobs | Human Resources Jobs | HariHire",
        description:
          "Find the latest Human Resources and HR jobs on HariHire. Explore recruitment, talent acquisition and HR opportunities.",
        keywords:
          "HR jobs, human resources jobs, recruitment jobs, talent acquisition jobs",
      },

      sales: {
        title: "Sales Jobs | Business Development Jobs | HariHire",
        description:
          "Find the latest sales and business development jobs on HariHire. Explore sales opportunities for freshers and experienced candidates.",
        keywords:
          "sales jobs, business development jobs, sales executive jobs, BDE jobs",
      },

      core: {
        title: "Core Jobs | Engineering Jobs | HariHire",
        description:
          "Find the latest core industry and engineering jobs on HariHire. Explore opportunities across different core industries.",
        keywords:
          "core jobs, engineering jobs, core industry jobs, mechanical jobs, electrical jobs",
      },

      logistics: {
        title: "Logistics Jobs | Supply Chain Jobs | HariHire",
        description:
          "Find the latest logistics, transportation and supply chain jobs on HariHire. Explore opportunities for freshers and experienced professionals.",
        keywords:
          "logistics jobs, supply chain jobs, warehouse jobs, transportation jobs",
      },

      retail: {
        title: "Retail Jobs | Store Jobs | HariHire",
        description:
          "Find the latest retail and store jobs on HariHire. Explore retail, sales and store management opportunities.",
        keywords:
          "retail jobs, store jobs, retail sales jobs, store manager jobs",
      },

      "work-from-home": {
        title: "Work From Home Jobs | Remote Jobs | HariHire",
        description:
          "Find work from home and remote job opportunities on HariHire. Explore remote jobs for freshers and experienced professionals.",
        keywords:
          "work from home jobs, remote jobs, WFH jobs, online jobs, remote jobs India",
      },

      internships: {
        title: "Internships | Internship Jobs | HariHire",
        description:
          "Find the latest internship opportunities on HariHire. Explore internships for students, graduates and freshers.",
        keywords:
          "internships, internship jobs, student internships, fresher internships",
      },

      fresher: {
        title: "Fresher Jobs | Entry Level Jobs | HariHire",
        description:
          "Find the latest fresher and entry-level jobs on HariHire. Explore career opportunities for graduates and candidates starting their careers.",
        keywords:
          "fresher jobs, freshers jobs, entry level jobs, graduate jobs, fresher jobs India",
      },
    };

    return (
      seoData[category] || {
        title: `${getCategoryName()} Jobs | HariHire`,
        description: `Find the latest ${getCategoryName()} jobs on HariHire. Explore job opportunities for freshers and experienced candidates.`,
        keywords: `${getCategoryName()} jobs, jobs India, latest jobs`,
      }
    );
  };

  // =====================================================
  // SEO META TAGS
  // =====================================================

  useEffect(() => {
    const seo = getSeoData();

    const canonicalUrl =
      `${window.location.origin}/jobs/${category}`;

    // ---------------------------------------------------
    // TITLE
    // ---------------------------------------------------

    document.title = seo.title;

    // ---------------------------------------------------
    // HELPER FUNCTION
    // ---------------------------------------------------

    const setMeta = (
      attribute,
      attributeValue,
      content
    ) => {
      let element = document.head.querySelector(
        `meta[${attribute}="${attributeValue}"]`
      );

      if (!element) {
        element = document.createElement("meta");

        element.setAttribute(
          attribute,
          attributeValue
        );

        document.head.appendChild(element);
      }

      element.setAttribute("content", content);
    };

    // ---------------------------------------------------
    // BASIC SEO
    // ---------------------------------------------------

    setMeta(
      "name",
      "description",
      seo.description
    );

    setMeta(
      "name",
      "keywords",
      seo.keywords
    );

    setMeta(
      "name",
      "robots",
      "index, follow"
    );

    // ---------------------------------------------------
    // AUTHOR
    // ---------------------------------------------------

    setMeta(
      "name",
      "author",
      "HariHire"
    );

    // ---------------------------------------------------
    // OPEN GRAPH
    // ---------------------------------------------------

    setMeta(
      "property",
      "og:title",
      seo.title
    );

    setMeta(
      "property",
      "og:description",
      seo.description
    );

    setMeta(
      "property",
      "og:type",
      "website"
    );

    setMeta(
      "property",
      "og:url",
      canonicalUrl
    );

    setMeta(
      "property",
      "og:site_name",
      "HariHire"
    );

    // ---------------------------------------------------
    // TWITTER
    // ---------------------------------------------------

    setMeta(
      "name",
      "twitter:card",
      "summary"
    );

    setMeta(
      "name",
      "twitter:title",
      seo.title
    );

    setMeta(
      "name",
      "twitter:description",
      seo.description
    );

    // ---------------------------------------------------
    // CANONICAL
    // ---------------------------------------------------

    let canonical =
      document.head.querySelector(
        'link[rel="canonical"]'
      );

    if (!canonical) {
      canonical =
        document.createElement("link");

      canonical.setAttribute(
        "rel",
        "canonical"
      );

      document.head.appendChild(canonical);
    }

    canonical.setAttribute(
      "href",
      canonicalUrl
    );

    // ---------------------------------------------------
    // CLEANUP
    // ---------------------------------------------------

    return () => {
      document.title = "HariHire";
    };
  }, [category]);

  // =====================================================
  // NORMALIZE TEXT
  // =====================================================

  const normalizeText = (value) => {
    if (
      value === null ||
      value === undefined
    ) {
      return "";
    }

    return String(value)
      .toLowerCase()
      .trim()
      .replace(/[-_]/g, " ")
      .replace(/\s+/g, " ");
  };

  // =====================================================
  // CATEGORY MATCH
  // =====================================================

  const isCategoryMatch = (job) => {
    if (!job) {
      return false;
    }

    const selectedCategory =
      normalizeText(getCategoryName());

    const jobCategory =
      normalizeText(job.category);

    const jobCategory2 =
      normalizeText(job.jobCategory);

    const jobSubCategory =
      normalizeText(job.subCategory);

    const jobTitle =
      normalizeText(job.jobTitle);

    if (
      jobCategory === selectedCategory ||
      jobCategory.includes(selectedCategory) ||
      selectedCategory.includes(jobCategory)
    ) {
      return true;
    }

    if (
      jobCategory2 === selectedCategory ||
      jobCategory2.includes(selectedCategory) ||
      selectedCategory.includes(jobCategory2)
    ) {
      return true;
    }

    if (
      jobSubCategory === selectedCategory ||
      jobSubCategory.includes(selectedCategory) ||
      selectedCategory.includes(jobSubCategory)
    ) {
      return true;
    }

    if (
      jobTitle.includes(selectedCategory)
    ) {
      return true;
    }

    return false;
  };

  // =====================================================
  // LOAD CATEGORY JOBS
  // =====================================================

  const loadCategoryJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get("/jobs");

      const allJobs =
        Array.isArray(response.data)
          ? response.data
          : [];

      // Remove deleted jobs
      const activeJobs = allJobs.filter(
        (job) =>
          job &&
          job.deleted !== true
      );

      const categoryJobs =
        activeJobs.filter((job) =>
          isCategoryMatch(job)
        );

      console.log(
        "Category:",
        getCategoryName()
      );

      console.log(
        "Category Jobs:",
        categoryJobs
      );

      setJobs(categoryJobs);
      setFilteredJobs(categoryJobs);

      await loadSavedStatus(categoryJobs);

    } catch (error) {
      console.error(
        "Load category jobs error:",
        error
      );

      setJobs([]);
      setFilteredJobs([]);

      setError(
        "Failed to load jobs."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD SAVED STATUS
  // =====================================================

  const loadSavedStatus = async (jobList) => {
    const user = getUser();

    if (!user || !user.id) {
      setSavedJobs([]);
      return;
    }

    const savedIds = [];

    for (const job of jobList) {
      try {
        const response =
          await api.get(
            `/saved-jobs/check?userId=${user.id}&jobId=${job.id}`
          );

        if (response.data === true) {
          savedIds.push(job.id);
        }
      } catch (error) {
        console.error(
          "Saved status error:",
          error
        );
      }
    }

    setSavedJobs(savedIds);
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadCategoryJobs();
  }, [category]);

  // =====================================================
  // SEARCH
  // =====================================================

  useEffect(() => {
    const search =
      normalizeText(searchText);

    if (!search) {
      setFilteredJobs(jobs);
      return;
    }

    const result =
      jobs.filter((job) => {
        const searchableText = [
          job.jobTitle,
          job.companyName,
          job.location,
          job.category,
          job.jobCategory,
          job.subCategory,
          job.description,
          job.jobType,
          job.experience,
          job.qualification,
          job.workMode,
        ]
          .filter(Boolean)
          .join(" ");

        return normalizeText(
          searchableText
        ).includes(search);
      });

    setFilteredJobs(result);
  }, [searchText, jobs]);

  // =====================================================
  // SAVE / UNSAVE
  // =====================================================

  const handleSaveJob = async (job) => {
    if (!job || !job.id) {
      return;
    }

    const user = getUser();

    if (!user || !user.id) {
      alert(
        "Please login to save this job."
      );

      navigate("/login");
      return;
    }

    try {
      setSavingJobId(job.id);

      const alreadySaved =
        savedJobs.includes(job.id);

      // UNSAVE
      if (alreadySaved) {
        await api.delete(
          `/saved-jobs/${user.id}/${job.id}`
        );

        setSavedJobs((previous) =>
          previous.filter(
            (id) => id !== job.id
          )
        );

        return;
      }

      // SAVE
      await api.post(
        "/saved-jobs/save",
        {
          userId: user.id,
          jobId: job.id,
        }
      );

      setSavedJobs((previous) => {
        if (
          previous.includes(job.id)
        ) {
          return previous;
        }

        return [
          ...previous,
          job.id,
        ];
      });

    } catch (error) {
      console.error(
        "Save job error:",
        error
      );

      alert(
        "Unable to save this job."
      );
    } finally {
      setSavingJobId(null);
    }
  };

  // =====================================================
  // APPLY
  // =====================================================

  const handleApply = (job) => {
    if (!job) {
      return;
    }

    const applyType =
      String(
        job.applyType || "INTERNAL"
      ).toUpperCase();

    if (
      applyType === "EXTERNAL"
    ) {
      if (!job.applyLink) {
        alert(
          "Company application link is not available."
        );

        return;
      }

      window.open(
        job.applyLink,
        "_blank",
        "noopener,noreferrer"
      );

      return;
    }

    navigate(
      `/job/${job.id}/apply`
    );
  };

  // =====================================================
  // SHARE
  // =====================================================

  const handleShare = async (job) => {
    if (!job) {
      return;
    }

    const shareUrl =
      `${window.location.origin}/job/${job.id}`;

    const shareText =
      `Check out this job opportunity at ${
        job.companyName || ""
      }: ${
        job.jobTitle || ""
      }`;

    if (
      navigator.share &&
      typeof navigator.share === "function"
    ) {
      try {
        await navigator.share({
          title:
            job.jobTitle ||
            "Job Opportunity",
          text: shareText,
          url: shareUrl,
        });

        return;
      } catch (error) {
        console.log(
          "Share cancelled."
        );
      }
    }

    try {
      await navigator.clipboard.writeText(
        shareUrl
      );

      alert(
        "Job link copied successfully!"
      );
    } catch (error) {
      alert(
        `Job Link:\n${shareUrl}`
      );
    }
  };

  // =====================================================
  // SEO STRUCTURED DATA
  // =====================================================

  useEffect(() => {
    if (!category) {
      return;
    }

    const seo = getSeoData();

    const canonicalUrl =
      `${window.location.origin}/jobs/${category}`;

    const itemList = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: seo.title,
      description: seo.description,
      url: canonicalUrl,
      numberOfItems: filteredJobs.length,
      itemListElement:
        filteredJobs.map(
          (job, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url:
              `${window.location.origin}/job/${job.id}`,
            name:
              job.jobTitle ||
              "Job Opportunity",
          })
        ),
    };

    let script =
      document.getElementById(
        "category-job-itemlist"
      );

    if (!script) {
      script =
        document.createElement(
          "script"
        );

      script.id =
        "category-job-itemlist";

      script.type =
        "application/ld+json";

      document.head.appendChild(
        script
      );
    }

    script.textContent =
      JSON.stringify(itemList);

    return () => {
      const oldScript =
        document.getElementById(
          "category-job-itemlist"
        );

      if (oldScript) {
        oldScript.remove();
      }
    };
  }, [
    category,
    filteredJobs,
  ]);

  // =====================================================
  // CATEGORY
  // =====================================================

  const displayCategory =
    getCategoryName() || "Jobs";

  const seo = getSeoData();

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div style={styles.center}>
        <h2>
          Loading {displayCategory} Jobs...
        </h2>

        <p>
          Please wait.
        </p>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div style={styles.center}>
        <h2 style={styles.errorText}>
          ❌ {error}
        </h2>

        <button
          type="button"
          onClick={loadCategoryJobs}
          style={styles.retryButton}
        >
          Retry
        </button>
      </div>
    );
  }

  // =====================================================
  // MAIN
  // =====================================================

  return (
    <div style={styles.page}>

      {/* =================================================
          SEO CONTENT
      ================================================= */}

      <section style={styles.seoIntro}>

        <h1 style={styles.title}>
          {displayCategory} Jobs
        </h1>

        <p style={styles.subtitle}>
          {seo.description}
        </p>

      </section>

      {/* =================================================
          HEADER
      ================================================= */}

      <div style={styles.header}>

        <button
          type="button"
          onClick={() =>
            navigate("/jobs")
          }
          style={styles.backButton}
        >
          ← Back to Jobs
        </button>

      </div>

      {/* =================================================
          SEARCH
      ================================================= */}

      <div style={styles.searchBox}>

        <input
          type="text"
          value={searchText}
          onChange={(event) =>
            setSearchText(
              event.target.value
            )
          }
          onKeyDown={(event) => {
            if (
              event.key === "Enter"
            ) {
              event.preventDefault();
            }
          }}
          placeholder={`Search ${displayCategory} jobs, companies, skills...`}
          style={styles.searchInput}
          aria-label={`Search ${displayCategory} jobs`}
        />

        <button
          type="button"
          onClick={() =>
            setSearchText(searchText)
          }
          style={styles.searchButton}
        >
          🔍 Search
        </button>

      </div>

      {/* =================================================
          RESULT HEADER
      ================================================= */}

      <div style={styles.resultHeader}>

        <div>
          <h2
            style={
              styles.availableTitle
            }
          >
            Latest {displayCategory} Jobs
          </h2>

          <p style={styles.resultDescription}>
            Browse available{" "}
            {displayCategory.toLowerCase()} job
            opportunities on HariHire.
          </p>
        </div>

        <span style={styles.count}>
          {filteredJobs.length}{" "}
          {filteredJobs.length === 1
            ? "Job"
            : "Jobs"}
        </span>

      </div>

      {/* =================================================
          NO JOBS
      ================================================= */}

      {filteredJobs.length === 0 && (
        <div style={styles.noJobs}>

          <div style={styles.noJobsIcon}>
            🔍
          </div>

          <h2>
            {searchText
              ? "No Matching Jobs"
              : `No ${displayCategory} Jobs Available`}
          </h2>

          <p>
            {searchText
              ? "Try another job name, company or skill."
              : `There are currently no ${displayCategory.toLowerCase()} jobs available.`}
          </p>

          {searchText && (
            <button
              type="button"
              onClick={() =>
                setSearchText("")
              }
              style={
                styles.backButtonBlue
              }
            >
              Show All Jobs
            </button>
          )}

        </div>
      )}

      {/* =================================================
          JOB LIST
      ================================================= */}

      <div style={styles.container}>

        {filteredJobs.map((job) => {

          const isSaved =
            savedJobs.includes(
              job.id
            );

          const status =
            String(
              job.status || "Open"
            );

          const isOpen =
            status.toLowerCase() ===
            "open";

          const applyType =
            String(
              job.applyType ||
              "INTERNAL"
            ).toUpperCase();

          return (
            <article
              key={job.id}
              style={styles.card}
              itemScope
              itemType="https://schema.org/JobPosting"
            >

              {/* JOB HEADER */}

              <div style={styles.jobHeader}>

                <div>

                  <h3
                    style={
                      styles.jobTitle
                    }
                    itemProp="title"
                  >
                    {job.jobTitle ||
                      "Job Title Not Available"}
                  </h3>

                  <h4
                    style={
                      styles.company
                    }
                    itemProp="hiringOrganization"
                  >
                    🏢{" "}
                    {job.companyName ||
                      "Company Not Available"}
                  </h4>

                </div>

                <span
                  style={{
                    ...styles.status,
                    backgroundColor:
                      isOpen
                        ? "#e8f5e9"
                        : "#ffebee",
                    color:
                      isOpen
                        ? "#2e7d32"
                        : "#c62828",
                  }}
                >
                  {status}
                </span>

              </div>

              {/* DETAILS */}

              <div style={styles.details}>

                <span
                  itemProp="jobLocation"
                >
                  📍{" "}
                  {job.location ||
                    "Location not specified"}
                </span>

                <span>
                  💰{" "}
                  {job.salary
                    ? `₹${job.salary}`
                    : "Salary not disclosed"}
                </span>

                <span>
                  💼{" "}
                  {job.jobType ||
                    "Job type not specified"}
                </span>

                <span>
                  🎯{" "}
                  {job.experience ||
                    "Experience not specified"}
                </span>

                <span>
                  🎓{" "}
                  {job.qualification ||
                    "Qualification not specified"}
                </span>

              </div>

              {/* DESCRIPTION */}

              <div style={styles.description}>

                <h5>
                  Job Description
                </h5>

                <p itemProp="description">
                  {job.description ||
                    "No description available."}
                </p>

              </div>

              {/* FOOTER */}

              <div style={styles.footer}>

                <span style={styles.date}>
                  📅 Posted:{" "}
                  {job.postedDate ||
                    "Recently"}
                </span>

                <div style={styles.actions}>

                  {/* SAVE */}

                  <button
                    type="button"
                    onClick={() =>
                      handleSaveJob(job)
                    }
                    disabled={
                      savingJobId ===
                      job.id
                    }
                    style={{
                      ...styles.saveButton,
                      backgroundColor:
                        isSaved
                          ? "#fff3e0"
                          : "#ffffff",
                      color:
                        isSaved
                          ? "#ef6c00"
                          : "#1976d2",
                      border:
                        isSaved
                          ? "1px solid #ef6c00"
                          : "1px solid #1976d2",
                    }}
                  >
                    {savingJobId ===
                    job.id
                      ? "Saving..."
                      : isSaved
                      ? "❤️ Saved"
                      : "♡ Save Job"}
                  </button>

                  {/* SHARE */}

                  <button
                    type="button"
                    onClick={() =>
                      handleShare(job)
                    }
                    style={
                      styles.shareButton
                    }
                  >
                    📤 Share
                  </button>

                  {/* APPLY TYPE */}

                  <span
                    style={{
                      ...styles.applyType,
                      backgroundColor:
                        applyType ===
                        "EXTERNAL"
                          ? "#fff3e0"
                          : "#e3f2fd",
                      color:
                        applyType ===
                        "EXTERNAL"
                          ? "#ef6c00"
                          : "#1565c0",
                    }}
                  >
                    {applyType ===
                    "EXTERNAL"
                      ? "Company Website"
                      : "HariHire"}
                  </span>

                  {/* APPLY */}

                  <button
                    type="button"
                    onClick={() =>
                      handleApply(job)
                    }
                    style={
                      styles.applyButton
                    }
                  >
                    Apply Now →
                  </button>

                </div>

              </div>

            </article>
          );
        })}

      </div>

      {/* =================================================
          SEO FOOTER CONTENT
      ================================================= */}

      <section style={styles.seoFooter}>

        <h2>
          Find {displayCategory} Jobs on HariHire
        </h2>

        <p>
          HariHire helps job seekers discover
          the latest {displayCategory.toLowerCase()}{" "}
          opportunities. Search jobs by title,
          company, location, skills, experience
          and qualification.
        </p>

        <p>
          Whether you are a fresher or an
          experienced professional, explore
          relevant opportunities and apply for
          jobs that match your career goals.
        </p>

      </section>

    </div>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = {

  page: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fb",
    padding: "35px 5%",
    boxSizing: "border-box",
  },

  seoIntro: {
    maxWidth: "1000px",
    margin: "0 auto 20px",
    textAlign: "center",
  },

  header: {
    maxWidth: "1100px",
    margin: "0 auto 20px",
  },

  title: {
    margin: 0,
    fontSize: "34px",
    color: "#1f2937",
  },

  subtitle: {
    color: "#6b7280",
    fontSize: "16px",
    lineHeight: "1.7",
    marginTop: "12px",
  },

  backButton: {
    backgroundColor: "#ffffff",
    color: "#1976d2",
    border: "1px solid #1976d2",
    padding: "10px 18px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600",
  },

  searchBox: {
    maxWidth: "850px",
    margin: "0 auto 35px",
    display: "flex",
    gap: "10px",
    backgroundColor: "#ffffff",
    padding: "10px",
    borderRadius: "10px",
    boxShadow:
      "0 3px 12px rgba(0,0,0,0.08)",
  },

  searchInput: {
    flex: 1,
    border: "1px solid #ddd",
    outline: "none",
    padding: "13px",
    fontSize: "16px",
    borderRadius: "7px",
  },

  searchButton: {
    border: "none",
    backgroundColor: "#1976d2",
    color: "#ffffff",
    padding: "12px 22px",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
  },

  resultHeader: {
    maxWidth: "1100px",
    margin: "0 auto 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
  },

  availableTitle: {
    color: "#1f2937",
    marginBottom: "5px",
  },

  resultDescription: {
    color: "#6b7280",
    marginTop: "5px",
  },

  count: {
    backgroundColor: "#e3f2fd",
    color: "#1565c0",
    padding: "7px 14px",
    borderRadius: "20px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "25px",
    boxShadow:
      "0 3px 12px rgba(0,0,0,0.08)",
    border: "1px solid #eeeeee",
  },

  jobHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "15px",
  },

  jobTitle: {
    margin: 0,
    color: "#1f2937",
    fontSize: "22px",
  },

  company: {
    color: "#555",
    fontSize: "16px",
    marginTop: "8px",
  },

  status: {
    padding: "6px 12px",
    borderRadius: "20px",
    fontWeight: "600",
    fontSize: "13px",
    whiteSpace: "nowrap",
  },

  details: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "20px",
    padding: "15px 0",
    borderTop: "1px solid #eeeeee",
    borderBottom: "1px solid #eeeeee",
    color: "#555",
  },

  description: {
    marginTop: "15px",
    color: "#555",
    lineHeight: "1.6",
  },

  footer: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap",
  },

  date: {
    color: "#777",
    fontSize: "14px",
  },

  actions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },

  saveButton: {
    padding: "9px 14px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
  },

  shareButton: {
    backgroundColor: "#ffffff",
    color: "#1976d2",
    border: "1px solid #1976d2",
    padding: "9px 14px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
  },

  applyType: {
    padding: "7px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
  },

  applyButton: {
    backgroundColor: "#1976d2",
    color: "#ffffff",
    border: "none",
    padding: "11px 20px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600",
  },

  noJobs: {
    maxWidth: "700px",
    margin: "50px auto",
    backgroundColor: "#ffffff",
    padding: "45px 25px",
    textAlign: "center",
    borderRadius: "12px",
    boxShadow:
      "0 3px 12px rgba(0,0,0,0.08)",
  },

  noJobsIcon: {
    fontSize: "50px",
  },

  backButtonBlue: {
    marginTop: "15px",
    backgroundColor: "#1976d2",
    color: "#ffffff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  seoFooter: {
    maxWidth: "1000px",
    margin: "50px auto 20px",
    padding: "25px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    lineHeight: "1.7",
    color: "#555",
  },

  center: {
    minHeight: "70vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },

  errorText: {
    color: "#d32f2f",
  },

  retryButton: {
    backgroundColor: "#1976d2",
    color: "#ffffff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default CategoryJobs;