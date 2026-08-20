import { Helmet } from "react-helmet-async";

function SEO({
  title = "HariHire - Find Jobs, Hire Talent & Build Your Career",

  description = "HariHire is a job portal to find the latest IT, Non-IT, Banking, Government and other jobs. Search jobs, apply online and connect with recruiters.",

  keywords = "HariHire, jobs, job portal, IT jobs, software jobs, banking jobs, government jobs, fresher jobs",

  image = "/banner1.jpg.jpg",

  canonicalUrl = window.location.href,

  robots = "index, follow",

  schema = null
}) {

  // =====================================================
  // ORGANIZATION SCHEMA
  // =====================================================

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",

    name: "HariHire",

    url: window.location.origin,

    logo: `${window.location.origin}/banner1.jpg.jpg`,

    description:
      "HariHire is an online job portal for job seekers and recruiters."
  };

  // =====================================================
  // WEBSITE SCHEMA
  // =====================================================

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",

    name: "HariHire",

    url: window.location.origin,

    description:
      "Find IT, Non-IT, Banking, Government, BPO, Healthcare and other jobs on HariHire."
  };

  // =====================================================
  // FINAL SCHEMAS
  // =====================================================

  const schemas = [
    organizationSchema,
    websiteSchema
  ];

  // =====================================================
  // PAGE SPECIFIC SCHEMA
  // =====================================================

  if (schema) {
    if (Array.isArray(schema)) {
      schemas.push(...schema);
    } else {
      schemas.push(schema);
    }
  }

  return (
    <Helmet>

      {/* =================================================
          BASIC SEO
      ================================================= */}

      <title>{title}</title>

      <meta
        name="description"
        content={description}
      />

      <meta
        name="keywords"
        content={keywords}
      />

      <meta
        name="robots"
        content={robots}
      />

      {/* =================================================
          CANONICAL URL
      ================================================= */}

      <link
        rel="canonical"
        href={canonicalUrl}
      />

      {/* =================================================
          OPEN GRAPH
      ================================================= */}

      <meta
        property="og:type"
        content="website"
      />

      <meta
        property="og:title"
        content={title}
      />

      <meta
        property="og:description"
        content={description}
      />

      <meta
        property="og:url"
        content={canonicalUrl}
      />

      <meta
        property="og:image"
        content={image}
      />

      <meta
        property="og:site_name"
        content="HariHire"
      />

      {/* =================================================
          TWITTER
      ================================================= */}

      <meta
        name="twitter:card"
        content="summary_large_image"
      />

      <meta
        name="twitter:title"
        content={title}
      />

      <meta
        name="twitter:description"
        content={description}
      />

      <meta
        name="twitter:image"
        content={image}
      />

      {/* =================================================
          STRUCTURED DATA
      ================================================= */}

      {schemas.map((item, index) => (
        <script
          key={`schema-${index}`}
          type="application/ld+json"
        >
          {JSON.stringify(item)}
        </script>
      ))}

    </Helmet>
  );
}

export default SEO;