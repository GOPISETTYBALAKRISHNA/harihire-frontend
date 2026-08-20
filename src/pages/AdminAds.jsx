import { useEffect, useState } from "react";
import api from "../axiosConfig";

function AdminAds() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);

  // =====================================================
  // CREATE FORM
  // =====================================================

  const [form, setForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    targetUrl: "",
    advertiserName: "",
    adType: "BANNER",
    videoUrl: "",
    skippable: false,
    skipAfterSeconds: 10,
    displayOrder: 1,
  });

  // =====================================================
  // EDIT
  // =====================================================

  const [editingAd, setEditingAd] = useState(null);

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    targetUrl: "",
    advertiserName: "",
    adType: "BANNER",
    videoUrl: "",
    skippable: false,
    skipAfterSeconds: 10,
    displayOrder: 1,
    active: true,
  });

  // =====================================================
  // LOAD ADS
  // =====================================================

  useEffect(() => {
    loadAds();
  }, []);

  const loadAds = async () => {
    try {
      setLoading(true);

      const response = await api.get("/ads");

      if (Array.isArray(response.data)) {
        const sortedAds = [...response.data].sort(
          (a, b) =>
            Number(a.displayOrder || 999999) -
            Number(b.displayOrder || 999999)
        );

        setAds(sortedAds);
      } else {
        setAds([]);
      }
    } catch (error) {
      console.error("Load Ads Error:", error);
      alert("Failed to load advertisements.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CREATE FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =====================================================
  // EDIT FORM CHANGE
  // =====================================================

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =====================================================
  // CREATE AD
  // =====================================================

  const createAd = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Please enter Ad Title.");
      return;
    }

    if (!form.advertiserName.trim()) {
      alert("Please enter Advertiser Name.");
      return;
    }

    // VIDEO validation
    if (
      form.adType === "VIDEO" &&
      !form.videoUrl.trim()
    ) {
      alert("Please enter Video URL.");
      return;
    }

    // BANNER / IMAGE validation
    if (
      (form.adType === "BANNER" ||
        form.adType === "IMAGE") &&
      !form.imageUrl.trim()
    ) {
      alert(
        form.adType === "IMAGE"
          ? "Please enter Image URL."
          : "Please enter Banner Image URL."
      );
      return;
    }

    if (Number(form.displayOrder) <= 0) {
      alert("Display Order must be greater than 0.");
      return;
    }

    if (
      form.adType === "VIDEO" &&
      form.skippable &&
      Number(form.skipAfterSeconds) <= 0
    ) {
      alert("Skip time must be greater than 0.");
      return;
    }

    try {
      setLoading(true);

      const data = {
        title: form.title.trim(),
        description: form.description.trim(),

        imageUrl:
          form.adType === "VIDEO"
            ? form.imageUrl.trim()
            : form.imageUrl.trim(),

        targetUrl: form.targetUrl.trim(),

        advertiserName:
          form.advertiserName.trim(),

        adType: form.adType,

        videoUrl:
          form.adType === "VIDEO"
            ? form.videoUrl.trim()
            : "",

        skippable:
          form.adType === "VIDEO"
            ? form.skippable
            : false,

        skipAfterSeconds:
          form.adType === "VIDEO"
            ? Number(form.skipAfterSeconds)
            : 10,

        displayOrder:
          Number(form.displayOrder),

        active: true,
      };

      await api.post("/ads", data);

      alert(
        "Advertisement created successfully."
      );

      setForm({
        title: "",
        description: "",
        imageUrl: "",
        targetUrl: "",
        advertiserName: "",
        adType: "BANNER",
        videoUrl: "",
        skippable: false,
        skipAfterSeconds: 10,
        displayOrder: 1,
      });

      await loadAds();
    } catch (error) {
      console.error(
        "Create Ad Error:",
        error
      );

      let message =
        "Failed to create advertisement.";

      if (error.response) {
        if (error.response.data) {
          if (
            typeof error.response.data ===
            "string"
          ) {
            message =
              error.response.data;
          } else if (
            error.response.data.message
          ) {
            message =
              error.response.data.message;
          }
        }
      }

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // ACTIVATE
  // =====================================================

  const activateAd = async (id) => {
    try {
      await api.put(
        `/ads/${id}/activate`
      );

      alert(
        "Advertisement activated successfully."
      );

      await loadAds();
    } catch (error) {
      console.error(
        "Activate Error:",
        error
      );

      alert(
        "Failed to activate advertisement."
      );
    }
  };

  // =====================================================
  // DEACTIVATE
  // =====================================================

  const deactivateAd = async (id) => {
    try {
      await api.put(
        `/ads/${id}/deactivate`
      );

      alert(
        "Advertisement deactivated successfully."
      );

      await loadAds();
    } catch (error) {
      console.error(
        "Deactivate Error:",
        error
      );

      alert(
        "Failed to deactivate advertisement."
      );
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const deleteAd = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this advertisement?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `/ads/${id}`
      );

      alert(
        "Advertisement deleted successfully."
      );

      await loadAds();
    } catch (error) {
      console.error(
        "Delete Ad Error:",
        error
      );

      alert(
        "Failed to delete advertisement."
      );
    }
  };

  // =====================================================
  // OPEN EDIT FORM
  // =====================================================

  const openEditForm = (ad) => {
    setEditingAd(ad);

    setEditForm({
      title: ad.title || "",
      description:
        ad.description || "",
      imageUrl:
        ad.imageUrl || "",
      targetUrl:
        ad.targetUrl || "",
      advertiserName:
        ad.advertiserName || "",

      adType:
        ad.adType || "BANNER",

      videoUrl:
        ad.videoUrl || "",

      skippable:
        ad.skippable === true,

      skipAfterSeconds:
        Number(ad.skipAfterSeconds) > 0
          ? Number(
              ad.skipAfterSeconds
            )
          : 10,

      displayOrder:
        Number(ad.displayOrder) > 0
          ? Number(ad.displayOrder)
          : 1,

      active:
        ad.active === true,
    });
  };

  // =====================================================
  // CLOSE EDIT
  // =====================================================

  const closeEditForm = () => {
    setEditingAd(null);
  };

  // =====================================================
  // UPDATE AD
  // =====================================================

  const updateAd = async (e) => {
    e.preventDefault();

    if (!editingAd) {
      return;
    }

    if (!editForm.title.trim()) {
      alert("Please enter Ad Title.");
      return;
    }

    if (!editForm.advertiserName.trim()) {
      alert(
        "Please enter Advertiser Name."
      );
      return;
    }

    if (
      editForm.adType === "VIDEO" &&
      !editForm.videoUrl.trim()
    ) {
      alert("Please enter Video URL.");
      return;
    }

    if (
      (editForm.adType === "BANNER" ||
        editForm.adType === "IMAGE") &&
      !editForm.imageUrl.trim()
    ) {
      alert(
        editForm.adType === "IMAGE"
          ? "Please enter Image URL."
          : "Please enter Banner Image URL."
      );
      return;
    }

    if (
      Number(editForm.displayOrder) <= 0
    ) {
      alert(
        "Display Order must be greater than 0."
      );
      return;
    }

    if (
      editForm.adType === "VIDEO" &&
      editForm.skippable &&
      Number(
        editForm.skipAfterSeconds
      ) <= 0
    ) {
      alert(
        "Skip time must be greater than 0."
      );
      return;
    }

    try {
      setLoading(true);

      const data = {
        title:
          editForm.title.trim(),

        description:
          editForm.description.trim(),

        imageUrl:
          editForm.imageUrl.trim(),

        targetUrl:
          editForm.targetUrl.trim(),

        advertiserName:
          editForm.advertiserName.trim(),

        adType:
          editForm.adType,

        videoUrl:
          editForm.adType === "VIDEO"
            ? editForm.videoUrl.trim()
            : "",

        skippable:
          editForm.adType === "VIDEO"
            ? editForm.skippable
            : false,

        skipAfterSeconds:
          editForm.adType === "VIDEO"
            ? Number(
                editForm.skipAfterSeconds
              )
            : 10,

        displayOrder:
          Number(
            editForm.displayOrder
          ),

        active:
          editForm.active,
      };

      await api.put(
        `/ads/${editingAd.id}`,
        data
      );

      alert(
        "Advertisement updated successfully."
      );

      setEditingAd(null);

      await loadAds();
    } catch (error) {
      console.error(
        "Update Ad Error:",
        error
      );

      let message =
        "Failed to update advertisement.";

      if (error.response) {
        if (error.response.data) {
          if (
            typeof error.response.data ===
            "string"
          ) {
            message =
              error.response.data;
          } else if (
            error.response.data.message
          ) {
            message =
              error.response.data.message;
          }
        }
      }

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div style={pageStyle}>

      {/* HEADER */}

      <div style={headerStyle}>

        <div>
          <h1 style={pageTitle}>
            Advertisement Management
          </h1>

          <p style={pageSubtitle}>
            Create, manage and monitor
            advertisements.
          </p>
        </div>

        <div style={totalBadge}>
          Total Ads: {ads.length}
        </div>

      </div>


      {/* =================================================
          CREATE AD
      ================================================= */}

      <div style={cardStyle}>

        <h2 style={sectionTitle}>
          Create Advertisement
        </h2>

        <form onSubmit={createAd}>

          <div style={formGrid}>

            {/* TITLE */}

            <div style={fieldStyle}>

              <label style={labelStyle}>
                Ad Title *
              </label>

              <input
                type="text"
                name="title"
                placeholder="Enter advertisement title"
                value={form.title}
                onChange={handleChange}
                style={inputStyle}
              />

            </div>


            {/* ADVERTISER */}

            <div style={fieldStyle}>

              <label style={labelStyle}>
                Advertiser Name *
              </label>

              <input
                type="text"
                name="advertiserName"
                placeholder="Enter advertiser name"
                value={
                  form.advertiserName
                }
                onChange={handleChange}
                style={inputStyle}
              />

            </div>

          </div>


          {/* DESCRIPTION */}

          <div style={fieldStyle}>

            <label style={labelStyle}>
              Description
            </label>

            <textarea
              name="description"
              placeholder="Enter advertisement description"
              value={
                form.description
              }
              onChange={handleChange}
              style={textareaStyle}
            />

          </div>


          {/* TARGET URL */}

          <div style={fieldStyle}>

            <label style={labelStyle}>
              Target Website URL
            </label>

            <input
              type="text"
              name="targetUrl"
              placeholder="https://example.com"
              value={
                form.targetUrl
              }
              onChange={handleChange}
              style={inputStyle}
            />

          </div>


          {/* TYPE + ORDER */}

          <div style={formGrid}>

            <div style={fieldStyle}>

              <label style={labelStyle}>
                Advertisement Type
              </label>

              <select
                name="adType"
                value={
                  form.adType
                }
                onChange={handleChange}
                style={inputStyle}
              >

                {/* EXISTING BANNER */}

                <option value="BANNER">
                  Banner Advertisement
                </option>

                {/* NEW IMAGE */}

                <option value="IMAGE">
                  Image Advertisement
                </option>

                {/* EXISTING VIDEO */}

                <option value="VIDEO">
                  Video Advertisement
                </option>

              </select>

            </div>


            <div style={fieldStyle}>

              <label style={labelStyle}>
                Display Order
              </label>

              <input
                type="number"
                name="displayOrder"
                min="1"
                value={
                  form.displayOrder
                }
                onChange={handleChange}
                style={inputStyle}
              />

              <small style={helpText}>
                1 = First, 2 = Second,
                3 = Third...
              </small>

            </div>

          </div>


          {/* =================================================
              BANNER SETTINGS
          ================================================= */}

          {form.adType === "BANNER" && (

            <div style={settingsBox}>

              <h3 style={settingsTitle}>
                Banner Settings
              </h3>

              <label style={labelStyle}>
                Banner Image URL
              </label>

              <input
                type="text"
                name="imageUrl"
                placeholder="https://example.com/banner.jpg"
                value={
                  form.imageUrl
                }
                onChange={handleChange}
                style={inputStyle}
              />

            </div>

          )}


          {/* =================================================
              IMAGE SETTINGS - NEW
          ================================================= */}

          {form.adType === "IMAGE" && (

            <div style={imageSettingsStyle}>

              <h3 style={settingsTitle}>
                Image Advertisement Settings
              </h3>

              <label style={labelStyle}>
                Image URL *
              </label>

              <input
                type="text"
                name="imageUrl"
                placeholder="https://example.com/ad-image.jpg"
                value={
                  form.imageUrl
                }
                onChange={handleChange}
                style={inputStyle}
              />

              <small style={helpText}>
                This image will be displayed
                as an advertisement.
              </small>

            </div>

          )}


          {/* =================================================
              VIDEO SETTINGS
          ================================================= */}

          {form.adType === "VIDEO" && (

            <div style={videoSettingsStyle}>

              <h3 style={settingsTitle}>
                Video Advertisement Settings
              </h3>

              <label style={labelStyle}>
                Video URL *
              </label>

              <input
                type="text"
                name="videoUrl"
                placeholder="https://example.com/video.mp4"
                value={
                  form.videoUrl
                }
                onChange={handleChange}
                style={inputStyle}
              />

              <label style={checkboxLabel}>

                <input
                  type="checkbox"
                  name="skippable"
                  checked={
                    form.skippable
                  }
                  onChange={handleChange}
                />

                <span>
                  Allow user to skip video
                </span>

              </label>

              {form.skippable && (

                <div style={fieldStyle}>

                  <label style={labelStyle}>
                    Skip After Seconds
                  </label>

                  <input
                    type="number"
                    name="skipAfterSeconds"
                    min="1"
                    value={
                      form.skipAfterSeconds
                    }
                    onChange={handleChange}
                    style={inputStyle}
                  />

                </div>

              )}

            </div>

          )}


          <button
            type="submit"
            disabled={loading}
            style={{
              ...primaryButton,
              opacity:
                loading ? 0.6 : 1,
            }}
          >
            {loading
              ? "Creating..."
              : "Create Advertisement"}
          </button>

        </form>

      </div>


      {/* =================================================
          EXISTING ADS
      ================================================= */}

      <div style={existingSection}>

        <div style={existingHeader}>

          <div>

            <h2 style={sectionTitle}>
              Existing Advertisements
            </h2>

            <p style={pageSubtitle}>
              Manage all advertisements
              from here.
            </p>

          </div>

        </div>


        {loading &&
        ads.length === 0 ? (

          <div style={emptyBox}>
            Loading advertisements...
          </div>

        ) : ads.length === 0 ? (

          <div style={emptyBox}>
            No advertisements found.
          </div>

        ) : (

          <div>

            {ads.map((ad, index) => (

              <div
                key={ad.id}
                style={adCardStyle}
              >

                {/* TOP */}

                <div style={adTopRow}>

                  <div>

                    <span
                      style={orderBadge}
                    >
                      Order{" "}
                      {ad.displayOrder ||
                        index + 1}
                    </span>


                    <span
                      style={
                        ad.adType ===
                        "VIDEO"
                          ? videoBadge
                          : ad.adType ===
                            "IMAGE"
                          ? imageBadge
                          : bannerBadge
                      }
                    >

                      {ad.adType ===
                      "VIDEO"
                        ? "VIDEO"
                        : ad.adType ===
                          "IMAGE"
                        ? "IMAGE"
                        : "BANNER"}

                    </span>


                    <span
                      style={
                        ad.active
                          ? activeBadge
                          : inactiveBadge
                      }
                    >
                      {ad.active
                        ? "ACTIVE"
                        : "INACTIVE"}
                    </span>

                  </div>

                </div>


                {/* TITLE */}

                <h3 style={adTitle}>

                  {ad.adType ===
                  "VIDEO"
                    ? "🎬"
                    : ad.adType ===
                      "IMAGE"
                    ? "🖼️"
                    : "📢"}{" "}

                  {ad.title}

                </h3>


                {/* DESCRIPTION */}

                {ad.description && (

                  <p style={descriptionStyle}>
                    {ad.description}
                  </p>

                )}


                {/* DETAILS */}

                <div style={detailsGrid}>

                  <div>
                    <strong>
                      Advertiser
                    </strong>

                    <span>
                      {ad.advertiserName ||
                        "-"}
                    </span>
                  </div>


                  <div>
                    <strong>
                      Display Order
                    </strong>

                    <span>
                      {ad.displayOrder ||
                        index + 1}
                    </span>
                  </div>


                  <div>
                    <strong>
                      Impressions
                    </strong>

                    <span>
                      {ad.impressions ||
                        0}
                    </span>
                  </div>


                  <div>
                    <strong>
                      Clicks
                    </strong>

                    <span>
                      {ad.clicks ||
                        0}
                    </span>
                  </div>

                </div>


                {/* IMAGE DETAILS */}

                {ad.adType ===
                  "IMAGE" && (

                  <div
                    style={
                      imageInfoBox
                    }
                  >

                    <div
                      style={imagePreviewWrapper}
                    >

                      {ad.imageUrl && (

                        <img
                          src={
                            ad.imageUrl
                          }
                          alt={
                            ad.title
                          }
                          style={
                            imagePreview
                          }
                        />

                      )}

                    </div>


                    <div
                      style={urlText}
                    >
                      <strong>
                        Image:
                      </strong>{" "}
                      {ad.imageUrl ||
                        "Not available"}
                    </div>

                  </div>

                )}


                {/* VIDEO DETAILS */}

                {ad.adType ===
                  "VIDEO" && (

                  <div
                    style={
                      videoInfoBox
                    }
                  >

                    <div>
                      <strong>
                        Completed Views:
                      </strong>{" "}
                      {ad.videoViews ||
                        0}
                    </div>


                    <div>
                      <strong>
                        Skip:
                      </strong>{" "}

                      {ad.skippable
                        ? `After ${ad.skipAfterSeconds}s`
                        : "Not Skippable"}

                    </div>


                    <div
                      style={urlText}
                    >
                      <strong>
                        Video:
                      </strong>{" "}
                      {ad.videoUrl ||
                        "Not available"}
                    </div>

                  </div>

                )}


                {/* TARGET URL */}

                {ad.targetUrl && (

                  <div
                    style={urlText}
                  >
                    <strong>
                      Target URL:
                    </strong>{" "}
                    {ad.targetUrl}
                  </div>

                )}


                {/* ACTIONS */}

                <div
                  style={actionsStyle}
                >

                  {ad.active ? (

                    <button
                      onClick={() =>
                        deactivateAd(
                          ad.id
                        )
                      }
                      style={{
                        ...actionButton,
                        backgroundColor:
                          "#f59e0b",
                      }}
                    >
                      Deactivate
                    </button>

                  ) : (

                    <button
                      onClick={() =>
                        activateAd(
                          ad.id
                        )
                      }
                      style={{
                        ...actionButton,
                        backgroundColor:
                          "#16a34a",
                      }}
                    >
                      Activate
                    </button>

                  )}


                  <button
                    onClick={() =>
                      openEditForm(ad)
                    }
                    style={{
                      ...actionButton,
                      backgroundColor:
                        "#2563eb",
                    }}
                  >
                    Edit
                  </button>


                  <button
                    onClick={() =>
                      deleteAd(
                        ad.id
                      )
                    }
                    style={{
                      ...actionButton,
                      backgroundColor:
                        "#dc2626",
                    }}
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>


      {/* =================================================
          EDIT MODAL
      ================================================= */}

      {editingAd && (

        <div
          style={modalOverlay}
        >

          <div
            style={modalStyle}
          >

            <div
              style={modalHeader}
            >

              <div>

                <h2
                  style={modalTitle}
                >
                  Edit Advertisement
                </h2>

                <p
                  style={pageSubtitle}
                >
                  Update advertisement
                  information.
                </p>

              </div>


              <button
                type="button"
                onClick={
                  closeEditForm
                }
                style={
                  closeIconButton
                }
              >
                ×
              </button>

            </div>


            <form
              onSubmit={
                updateAd
              }
            >

              {/* TITLE */}

              <div
                style={fieldStyle}
              >

                <label
                  style={labelStyle}
                >
                  Ad Title *
                </label>

                <input
                  type="text"
                  name="title"
                  value={
                    editForm.title
                  }
                  onChange={
                    handleEditChange
                  }
                  style={
                    inputStyle
                  }
                />

              </div>


              {/* DESCRIPTION */}

              <div
                style={fieldStyle}
              >

                <label
                  style={labelStyle}
                >
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    editForm.description
                  }
                  onChange={
                    handleEditChange
                  }
                  style={
                    textareaStyle
                  }
                />

              </div>


              {/* ADVERTISER */}

              <div
                style={fieldStyle}
              >

                <label
                  style={labelStyle}
                >
                  Advertiser Name *
                </label>

                <input
                  type="text"
                  name="advertiserName"
                  value={
                    editForm.advertiserName
                  }
                  onChange={
                    handleEditChange
                  }
                  style={
                    inputStyle
                  }
                />

              </div>


              {/* TARGET */}

              <div
                style={fieldStyle}
              >

                <label
                  style={labelStyle}
                >
                  Target Website URL
                </label>

                <input
                  type="text"
                  name="targetUrl"
                  value={
                    editForm.targetUrl
                  }
                  onChange={
                    handleEditChange
                  }
                  style={
                    inputStyle
                  }
                />

              </div>


              {/* TYPE + ORDER */}

              <div
                style={formGrid}
              >

                <div
                  style={fieldStyle}
                >

                  <label
                    style={labelStyle}
                  >
                    Advertisement Type
                  </label>

                  <select
                    name="adType"
                    value={
                      editForm.adType
                    }
                    onChange={
                      handleEditChange
                    }
                    style={
                      inputStyle
                    }
                  >

                    <option value="BANNER">
                      Banner Advertisement
                    </option>

                    <option value="IMAGE">
                      Image Advertisement
                    </option>

                    <option value="VIDEO">
                      Video Advertisement
                    </option>

                  </select>

                </div>


                <div
                  style={fieldStyle}
                >

                  <label
                    style={labelStyle}
                  >
                    Display Order
                  </label>

                  <input
                    type="number"
                    name="displayOrder"
                    min="1"
                    value={
                      editForm.displayOrder
                    }
                    onChange={
                      handleEditChange
                    }
                    style={
                      inputStyle
                    }
                  />

                </div>

              </div>


              {/* BANNER EDIT */}

              {editForm.adType ===
                "BANNER" && (

                <div
                  style={
                    settingsBox
                  }
                >

                  <h3
                    style={
                      settingsTitle
                    }
                  >
                    Banner Settings
                  </h3>

                  <label
                    style={
                      labelStyle
                    }
                  >
                    Banner Image URL
                  </label>

                  <input
                    type="text"
                    name="imageUrl"
                    value={
                      editForm.imageUrl
                    }
                    onChange={
                      handleEditChange
                    }
                    style={
                      inputStyle
                    }
                  />

                </div>

              )}


              {/* IMAGE EDIT */}

              {editForm.adType ===
                "IMAGE" && (

                <div
                  style={
                    imageSettingsStyle
                  }
                >

                  <h3
                    style={
                      settingsTitle
                    }
                  >
                    Image Advertisement
                    Settings
                  </h3>

                  <label
                    style={
                      labelStyle
                    }
                  >
                    Image URL *
                  </label>

                  <input
                    type="text"
                    name="imageUrl"
                    value={
                      editForm.imageUrl
                    }
                    onChange={
                      handleEditChange
                    }
                    style={
                      inputStyle
                    }
                  />

                </div>

              )}


              {/* VIDEO EDIT */}

              {editForm.adType ===
                "VIDEO" && (

                <div
                  style={
                    videoSettingsStyle
                  }
                >

                  <h3
                    style={
                      settingsTitle
                    }
                  >
                    Video Settings
                  </h3>

                  <label
                    style={
                      labelStyle
                    }
                  >
                    Video URL *
                  </label>

                  <input
                    type="text"
                    name="videoUrl"
                    value={
                      editForm.videoUrl
                    }
                    onChange={
                      handleEditChange
                    }
                    style={
                      inputStyle
                    }
                  />

                  <label
                    style={
                      checkboxLabel
                    }
                  >

                    <input
                      type="checkbox"
                      name="skippable"
                      checked={
                        editForm.skippable
                      }
                      onChange={
                        handleEditChange
                      }
                    />

                    <span>
                      Allow user to skip
                      video
                    </span>

                  </label>


                  {editForm.skippable && (

                    <div
                      style={
                        fieldStyle
                      }
                    >

                      <label
                        style={
                          labelStyle
                        }
                      >
                        Skip After Seconds
                      </label>

                      <input
                        type="number"
                        name="skipAfterSeconds"
                        min="1"
                        value={
                          editForm.skipAfterSeconds
                        }
                        onChange={
                          handleEditChange
                        }
                        style={
                          inputStyle
                        }
                      />

                    </div>

                  )}

                </div>

              )}


              {/* ACTIVE */}

              <label
                style={
                  checkboxLabel
                }
              >

                <input
                  type="checkbox"
                  name="active"
                  checked={
                    editForm.active
                  }
                  onChange={
                    handleEditChange
                  }
                />

                <span>
                  Advertisement is Active
                </span>

              </label>


              {/* BUTTONS */}

              <div
                style={
                  modalActions
                }
              >

                <button
                  type="button"
                  onClick={
                    closeEditForm
                  }
                  style={{
                    ...actionButton,
                    backgroundColor:
                      "#6b7280",
                  }}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  disabled={
                    loading
                  }
                  style={{
                    ...primaryButton,
                    marginTop: 0,
                    opacity:
                      loading
                        ? 0.6
                        : 1,
                  }}
                >

                  {loading
                    ? "Updating..."
                    : "Update Advertisement"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}


// =====================================================
// STYLES
// =====================================================

const pageStyle = {
  minHeight: "100vh",
  padding: "30px",
  backgroundColor: "#f4f6f9",
  boxSizing: "border-box",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  flexWrap: "wrap",
};

const pageTitle = {
  margin: 0,
  fontSize: "28px",
  color: "#1f2937",
};

const pageSubtitle = {
  margin: "6px 0 0",
  color: "#6b7280",
  fontSize: "14px",
};

const totalBadge = {
  backgroundColor: "#2563eb",
  color: "#ffffff",
  padding: "10px 18px",
  borderRadius: "20px",
  fontWeight: "600",
};

const cardStyle = {
  backgroundColor: "#ffffff",
  marginTop: "25px",
  padding: "25px",
  borderRadius: "14px",
  boxShadow:
    "0 3px 15px rgba(0,0,0,0.08)",
};

const sectionTitle = {
  margin: "0 0 20px",
  color: "#1f2937",
  fontSize: "21px",
};

const formGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "18px",
};

const fieldStyle = {
  marginBottom: "15px",
};

const labelStyle = {
  display: "block",
  marginBottom: "7px",
  fontSize: "14px",
  fontWeight: "600",
  color: "#374151",
};

const inputStyle = {
  width: "100%",
  padding: "12px 13px",
  border:
    "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "14px",
  boxSizing: "border-box",
  outline: "none",
};

const textareaStyle = {
  ...inputStyle,
  minHeight: "100px",
  resize: "vertical",
};

const helpText = {
  display: "block",
  marginTop: "5px",
  color: "#6b7280",
  fontSize: "12px",
};

const settingsBox = {
  marginTop: "10px",
  padding: "18px",
  borderRadius: "10px",
  backgroundColor: "#f8fafc",
  border:
    "1px solid #e5e7eb",
};

const imageSettingsStyle = {
  ...settingsBox,
  backgroundColor: "#f0fdf4",
  border:
    "1px solid #bbf7d0",
};

const videoSettingsStyle = {
  ...settingsBox,
  backgroundColor: "#eff6ff",
  border:
    "1px solid #bfdbfe",
};

const settingsTitle = {
  margin: "0 0 15px",
  fontSize: "17px",
  color: "#1f2937",
};

const checkboxLabel = {
  display: "flex",
  alignItems: "center",
  gap: "9px",
  marginTop: "15px",
  fontSize: "14px",
  color: "#374151",
};

const primaryButton = {
  marginTop: "20px",
  padding: "12px 22px",
  border: "none",
  borderRadius: "8px",
  backgroundColor: "#2563eb",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
};

const existingSection = {
  marginTop: "35px",
};

const existingHeader = {
  marginBottom: "18px",
};

const adCardStyle = {
  backgroundColor: "#ffffff",
  padding: "22px",
  marginBottom: "18px",
  borderRadius: "14px",
  boxShadow:
    "0 3px 12px rgba(0,0,0,0.07)",
  border:
    "1px solid #e5e7eb",
};

const adTopRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const orderBadge = {
  display: "inline-block",
  padding: "5px 10px",
  marginRight: "8px",
  borderRadius: "15px",
  backgroundColor: "#dbeafe",
  color: "#1d4ed8",
  fontSize: "12px",
  fontWeight: "600",
};

const videoBadge = {
  display: "inline-block",
  padding: "5px 10px",
  marginRight: "8px",
  borderRadius: "15px",
  backgroundColor: "#ede9fe",
  color: "#6d28d9",
  fontSize: "12px",
  fontWeight: "600",
};

const bannerBadge = {
  display: "inline-block",
  padding: "5px 10px",
  marginRight: "8px",
  borderRadius: "15px",
  backgroundColor: "#fef3c7",
  color: "#92400e",
  fontSize: "12px",
  fontWeight: "600",
};

const imageBadge = {
  display: "inline-block",
  padding: "5px 10px",
  marginRight: "8px",
  borderRadius: "15px",
  backgroundColor: "#dcfce7",
  color: "#166534",
  fontSize: "12px",
  fontWeight: "600",
};

const activeBadge = {
  display: "inline-block",
  padding: "5px 10px",
  borderRadius: "15px",
  backgroundColor: "#dcfce7",
  color: "#166534",
  fontSize: "12px",
  fontWeight: "600",
};

const inactiveBadge = {
  display: "inline-block",
  padding: "5px 10px",
  borderRadius: "15px",
  backgroundColor: "#fee2e2",
  color: "#991b1b",
  fontSize: "12px",
  fontWeight: "600",
};

const adTitle = {
  margin: "18px 0 8px",
  color: "#111827",
  fontSize: "19px",
};

const descriptionStyle = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "1.5",
};

const detailsGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(140px, 1fr))",
  gap: "12px",
  marginTop: "18px",
};

const videoInfoBox = {
  marginTop: "18px",
  padding: "14px",
  backgroundColor: "#f5f3ff",
  borderRadius: "8px",
  color: "#374151",
  fontSize: "14px",
  lineHeight: "1.8",
};

const imageInfoBox = {
  marginTop: "18px",
  padding: "14px",
  backgroundColor: "#f0fdf4",
  borderRadius: "8px",
  color: "#374151",
  fontSize: "14px",
  lineHeight: "1.8",
};

const imagePreviewWrapper = {
  width: "100%",
  maxHeight: "220px",
  overflow: "hidden",
  borderRadius: "8px",
  backgroundColor: "#ffffff",
  marginBottom: "10px",
};

const imagePreview = {
  width: "100%",
  maxHeight: "220px",
  objectFit: "contain",
  display: "block",
};

const urlText = {
  marginTop: "12px",
  fontSize: "13px",
  color: "#6b7280",
  wordBreak: "break-all",
};

const actionsStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  marginTop: "20px",
};

const actionButton = {
  padding: "9px 15px",
  border: "none",
  borderRadius: "7px",
  color: "#ffffff",
  fontSize: "13px",
  fontWeight: "600",
  cursor: "pointer",
};

const emptyBox = {
  padding: "35px",
  textAlign: "center",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  color: "#6b7280",
};

const modalOverlay = {
  position: "fixed",
  inset: 0,
  backgroundColor:
    "rgba(0,0,0,0.65)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
  zIndex: 99999,
  boxSizing: "border-box",
};

const modalStyle = {
  width: "100%",
  maxWidth: "700px",
  maxHeight: "92vh",
  overflowY: "auto",
  backgroundColor: "#ffffff",
  borderRadius: "15px",
  padding: "25px",
  boxSizing: "border-box",
  boxShadow:
    "0 10px 40px rgba(0,0,0,0.3)",
};

const modalHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "20px",
};

const modalTitle = {
  margin: 0,
  color: "#111827",
  fontSize: "22px",
};

const closeIconButton = {
  width: "36px",
  height: "36px",
  border: "none",
  borderRadius: "50%",
  backgroundColor: "#f3f4f6",
  color: "#374151",
  fontSize: "25px",
  lineHeight: "30px",
  cursor: "pointer",
};

const modalActions = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
  marginTop: "25px",
};

export default AdminAds;