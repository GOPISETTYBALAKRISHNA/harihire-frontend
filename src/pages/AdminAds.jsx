import { useEffect, useState } from "react";
import api from "../axiosConfig";

function AdminAds() {

  // =====================================================
  // ADS STATE
  // =====================================================

  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);

  // =====================================================
  // EDIT STATE
  // ==================================================

  const [editingAd, setEditingAd] = useState(null);

  // =====================================================
  // PLACEMENT OPTIONS
  // =====================================================

  const placementOptions = [
    {
      value: "HOME_TOP",
      label: "Home Top",
    },
    {
      value: "HOME_MIDDLE",
      label: "Home Middle",
    },
    {
      value: "JOBS_LIST",
      label: "Jobs List",
    },
    {
      value: "JOB_DETAILS",
      label: "Job Details",
    },
    {
      value: "JOB_DETAILS_SIDEBAR",
      label: "Job Details Sidebar",
    },
    {
      value: "STICKY_BOTTOM",
      label: "Sticky Bottom",
    },
  ];

  // =====================================================
  // PAGE TARGET OPTIONS
  // =====================================================

  const pageTargetOptions = [
    { value: "HOME",             label: "Home" },
    { value: "JOBS",             label: "Jobs" },
    { value: "JOB_DETAILS",      label: "Job Details" },
    { value: "DASHBOARD",        label: "User Dashboard" },
    { value: "COMPANIES",        label: "Companies" },
    { value: "CATEGORY_JOBS",    label: "Category Jobs" },
    { value: "MY_APPLICATIONS",  label: "My Applications" },
    { value: "SAVED_JOBS",       label: "Saved Jobs" },
    { value: "NOTIFICATIONS",    label: "Notifications" },
    { value: "PROFILE",          label: "Profile" },
    { value: "RESUME_BUILDER",   label: "Resume Builder" },
    { value: "HELP",             label: "Help" },
  ];

  // =====================================================
  // CREATE FORM
  // =====================================================

  const [form, setForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    imageFile:null,
    bannerFile:null,
    targetUrl: "",
    advertiserName: "",
    adType: "BANNER",
    videoUrl: "",
    videoFile: null,
    skippable: false,
    skipAfterSeconds: 10,
    displayOrder: 1,
    placements: [],
    targetPages: [],
  });

  // =====================================================
  // EDIT FORM
  // =====================================================

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    imageFile:null,
    bannerFile:null,
    targetUrl: "",
    advertiserName: "",
    adType: "BANNER",
    videoUrl: "",
    videoFile: null,
    skippable: false,
    skipAfterSeconds: 10,
    displayOrder: 1,
    active: true,
    placements: [],
    targetPages: [],
  });

  // =====================================================
  // LOAD ADS WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {
    loadAds();
  }, []);

  // =====================================================
  // LOAD ADS
  // =====================================================

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

      let message = "Failed to load advertisements.";

      if (error.response) {
        if (typeof error.response.data === "string") {
          message = error.response.data;
        } else if (
          error.response.data &&
          error.response.data.message
        ) {
          message = error.response.data.message;
        } else if (error.response.status === 403) {
          message =
            "You are not authorized to view advertisements.";
        } else if (error.response.status === 500) {
          message = "Server error. Please try again.";
        }
      } else if (error.request) {
        message =
          "Cannot connect to server. Please make sure Spring Boot backend is running on port 8085.";
      }

      alert(message);

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CREATE FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // =====================================================
  // EDIT FORM CHANGE
  // =====================================================

  const handleEditChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setEditForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // =====================================================
  // CREATE PLACEMENT CHANGE
  // =====================================================

  const handlePlacementChange = (placement) => {
    setForm((previous) => {
      const currentPlacements =
        previous.placements || [];

      const alreadySelected =
        currentPlacements.includes(placement);

      if (alreadySelected) {
        return {
          ...previous,
          placements:
            currentPlacements.filter(
              (item) => item !== placement
            ),
        };
      }

      return {
        ...previous,
        placements: [
          ...currentPlacements,
          placement,
        ],
      };
    });
  };

  // =====================================================
  // EDIT PLACEMENT CHANGE
  // =====================================================

  const handleEditPlacementChange = (placement) => {
    setEditForm((previous) => {
      const currentPlacements =
        previous.placements || [];

      const alreadySelected =
        currentPlacements.includes(placement);

      if (alreadySelected) {
        return {
          ...previous,
          placements:
            currentPlacements.filter(
              (item) => item !== placement
            ),
        };
      }

      return {
        ...previous,
        placements: [
          ...currentPlacements,
          placement,
        ],
      };
    });
  };

  // =====================================================
  // CREATE PAGE TARGET CHANGE
  // =====================================================

  const handlePageTargetChange = (page) => {
    setForm((previous) => {
      const current =
        previous.targetPages || [];

      const alreadySelected =
        current.includes(page);

      if (alreadySelected) {
        return {
          ...previous,
          targetPages:
            current.filter(
              (item) => item !== page
            ),
        };
      }

      return {
        ...previous,
        targetPages: [
          ...current,
          page,
        ],
      };
    });
  };

  // =====================================================
  // EDIT PAGE TARGET CHANGE
  // =====================================================

  const handleEditPageTargetChange = (page) => {
    setEditForm((previous) => {
      const current =
        previous.targetPages || [];

      const alreadySelected =
        current.includes(page);

      if (alreadySelected) {
        return {
          ...previous,
          targetPages:
            current.filter(
              (item) => item !== page
            ),
        };
      }

      return {
        ...previous,
        targetPages: [
          ...current,
          page,
        ],
      };
    });
  };

  // =====================================================
  // CREATE AD
  // =====================================================

  const createAd = async (e) => {
    e.preventDefault();

    // TITLE
    if (!form.title.trim()) {
      alert("Please enter Ad Title.");
      return;
    }

    // ADVERTISER
    if (!form.advertiserName.trim()) {
      alert("Please enter Advertiser Name.");
      return;
    }

    // PLACEMENT
    if (form.placements.length === 0) {
      alert(
        "Please select at least one Ad Placement."
      );
      return;
    }

    // VIDEO
    if (
      form.adType === "VIDEO" &&
      !form.videoFile
    ) {
      alert("Please select Video.");
      return;
    }

    // IMAGE / BANNER
    if (
      form.adType === "BANNER" &&
      !form.bannerFile
    ) {
      alert("Please select Banner Image.");
      return;
    }
    // DISPLAY ORDER
    if (Number(form.displayOrder) <= 0) {
      alert(
        "Display Order must be greater than 0."
      );
      return;
    }

    // SKIP TIME
    if (
      form.adType === "VIDEO" &&
      form.skippable &&
      Number(form.skipAfterSeconds) <= 0
    ) {
      alert(
        "Skip time must be greater than 0."
      );
      return;
    }

    try {
      setLoading(true);
      let uploadedBannerUrl = "";

if (
  form.adType === "BANNER" &&
  form.bannerFile
) {
  const uploadFormData = new FormData();

  uploadFormData.append(
    "file",
    form.bannerFile
  );

  const uploadResponse =
    await api.post(
      "/ads/upload",
      uploadFormData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

  uploadedBannerUrl =
    uploadResponse.data;
}
let uploadedVideoUrl = "";

if (
  form.adType === "VIDEO" &&
  form.videoFile
) {
  const uploadFormData = new FormData();

  uploadFormData.append(
    "file",
    form.videoFile
  );

  const uploadResponse =
    await api.post(
      "/ads/upload",
      uploadFormData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

  uploadedVideoUrl =
    uploadResponse.data;
}
let uploadedImageUrl = "";

if (
  form.adType === "IMAGE" &&
  form.imageFile
) {
  const uploadFormData = new FormData();

  uploadFormData.append(
    "file",
    form.imageFile
  );

  const uploadResponse =
    await api.post(
      "/ads/upload",
      uploadFormData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

  uploadedImageUrl =
    uploadResponse.data;
}

      const data = {
        title: form.title.trim(),

        description:
          form.description.trim(),

          imageUrl:
          form.adType === "BANNER"
            ? uploadedBannerUrl
            : form.imageUrl.trim(),
        targetUrl:
          form.targetUrl.trim(),

        advertiserName:
          form.advertiserName.trim(),

        adType:
          form.adType,
          
        videoUrl:
          form.adType === "VIDEO"
            ? uploadedVideoUrl
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

        placements:
          form.placements.join(","),

        targetPages:
          form.targetPages.join(","),

        active: true,
      };

      await api.post("/ads", data);

      alert(
        "Advertisement created successfully."
      );

      // RESET FORM
      setForm({
        title: "",
        description: "",
        imageUrl: "",
        imageFile: null,
        bannerFile: null,
        targetUrl: "",
        advertiserName: "",
        adType: "BANNER",
        videoUrl: "",
        videoFile: null,
        skippable: false,
        skipAfterSeconds: 10,
        displayOrder: 1,
        placements: [],
        targetPages: [],
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
        if (
          typeof error.response.data ===
          "string"
        ) {
          message =
            error.response.data;
        } else if (
          error.response.data &&
          error.response.data.message
        ) {
          message =
            error.response.data.message;
        } else if (
          error.response.status === 403
        ) {
          message =
            "You are not authorized to create advertisements.";
        } else if (
          error.response.status === 400
        ) {
          message =
            "Invalid advertisement data.";
        } else if (
          error.response.status === 500
        ) {
          message =
            "Server error. Please try again.";
        }
      } else if (error.request) {
        message =
          "Cannot connect to server. Please make sure Spring Boot backend is running.";
      }

      alert(message);

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // ACTIVATE AD
  // =====================================================

  const activateAd = async (id) => {
    try {
      setLoading(true);

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

      let message =
        "Failed to activate advertisement.";

      if (error.response) {
        if (
          typeof error.response.data ===
          "string"
        ) {
          message =
            error.response.data;
        } else if (
          error.response.data &&
          error.response.data.message
        ) {
          message =
            error.response.data.message;
        } else if (
          error.response.status === 403
        ) {
          message =
            "You are not authorized to activate advertisements.";
        }
      } else if (error.request) {
        message =
          "Cannot connect to server. Please make sure Spring Boot backend is running.";
      }

      alert(message);

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // DEACTIVATE AD
  // =====================================================

  const deactivateAd = async (id) => {
    try {
      setLoading(true);

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

      let message =
        "Failed to deactivate advertisement.";

      if (error.response) {
        if (
          typeof error.response.data ===
          "string"
        ) {
          message =
            error.response.data;
        } else if (
          error.response.data &&
          error.response.data.message
        ) {
          message =
            error.response.data.message;
        } else if (
          error.response.status === 403
        ) {
          message =
            "You are not authorized to deactivate advertisements.";
        }
      } else if (error.request) {
        message =
          "Cannot connect to server. Please make sure Spring Boot backend is running.";
      }

      alert(message);

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // DELETE AD
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
      setLoading(true);

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

      let message =
        "Failed to delete advertisement.";

      if (error.response) {
        if (
          typeof error.response.data ===
          "string"
        ) {
          message =
            error.response.data;
        } else if (
          error.response.data &&
          error.response.data.message
        ) {
          message =
            error.response.data.message;
        } else if (
          error.response.status === 403
        ) {
          message =
            "You are not authorized to delete advertisements.";
        }
      } else if (error.request) {
        message =
          "Cannot connect to server. Please make sure Spring Boot backend is running.";
      }

      alert(message);

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // OPEN EDIT FORM
  // =====================================================

  const openEditForm = (ad) => {
    setEditingAd(ad);

    let selectedPlacements = [];

    if (Array.isArray(ad.placements)) {
      selectedPlacements =
        ad.placements;
    } else if (
      typeof ad.placements === "string" &&
      ad.placements.trim() !== ""
    ) {
      selectedPlacements =
        ad.placements
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
    }

    // ===================================================
    // PARSE targetPages (backward compatible)
    // Old ads without targetPages default to []
    // ===================================================

    let selectedTargetPages = [];

    if (Array.isArray(ad.targetPages)) {
      selectedTargetPages = ad.targetPages;
    } else if (
      typeof ad.targetPages === "string" &&
      ad.targetPages.trim() !== ""
    ) {
      selectedTargetPages =
        ad.targetPages
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
    }

    setEditForm({
      title:
        ad.title || "",

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
          ? Number(ad.skipAfterSeconds)
          : 10,

      displayOrder:
        Number(ad.displayOrder) > 0
          ? Number(ad.displayOrder)
          : 1,

      active:
        ad.active !== false,

      placements:
        selectedPlacements,

      targetPages:
        selectedTargetPages,
    });
  };

  // =====================================================
  // CLOSE EDIT FORM
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

    // TITLE
    if (!editForm.title.trim()) {
      alert("Please enter Ad Title.");
      return;
    }

    // ADVERTISER
    if (!editForm.advertiserName.trim()) {
      alert("Please enter Advertiser Name.");
      return;
    }

    // PLACEMENT
    if (
      editForm.placements.length === 0
    ) {
      alert(
        "Please select at least one Ad Placement."
      );
      return;
    }

    // VIDEO
    if (
      editForm.adType === "VIDEO" &&
      !editForm.videoUrl.trim()
    ) {
      alert("Please enter Video URL.");
      return;
    }

    // IMAGE / BANNER
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
      editForm.adType === "IMAGE" &&
      !editForm.imageUrl &&
      !editForm.imageFile
    ) {
      alert("Please select Image.");
      return;
    }
    // DISPLAY ORDER
    if (
      Number(editForm.displayOrder) <= 0
    ) {
      alert(
        "Display Order must be greater than 0."
      );
      return;
    }
    

    // SKIP TIME
    if (
      editForm.adType === "VIDEO" &&
      editForm.skippable &&
      Number(editForm.skipAfterSeconds) <= 0
    ) {
      alert(
        "Skip time must be greater than 0."
      );
      return;
    }

    try {
      setLoading(true);
      let uploadedImageUrl = "";
      let uploadedBannerUrl="";
      let uploadedVideoUrl="";
      if (
        editForm.adType === "VIDEO" &&
        editForm.videoFile
      ) {
        const uploadFormData = new FormData();
      
        uploadFormData.append(
          "file",
          editForm.videoFile
        );
      
        const uploadResponse =
          await api.post(
            "/ads/upload",
            uploadFormData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );
      
        uploadedVideoUrl =
          uploadResponse.data;
      }


      if (
        editForm.adType === "IMAGE" &&
        editForm.imageFile
      ){
  const uploadFormData = new FormData();

  uploadFormData.append(
    "file",
    editForm.imageFile
    );

  const uploadResponse =
    await api.post(
      "/ads/upload",
      uploadFormData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

  uploadedImageUrl =
    uploadResponse.data;
}
if (
  editForm.adType === "BANNER" &&
  editForm.bannerFile
) {
  const uploadFormData = new FormData();

  uploadFormData.append(
    "file",
    editForm.bannerFile
  );

  const uploadResponse =
    await api.post(
      "/ads/upload",
      uploadFormData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

  uploadedBannerUrl =
    uploadResponse.data;
}

      const data = {
        title:
          editForm.title.trim(),

        description:
          editForm.description.trim(),

          imageUrl:
  editForm.adType === "IMAGE"
    ? (
        uploadedImageUrl ||
        editForm.imageUrl
      )
    : editForm.adType === "BANNER"
    ? (
        uploadedBannerUrl ||
        editForm.imageUrl
      )
    : "",

        targetUrl:
          editForm.targetUrl.trim(),

        advertiserName:
          editForm.advertiserName.trim(),

        adType:
          editForm.adType,

          videoUrl:
          editForm.adType === "VIDEO"
            ? (
                uploadedVideoUrl ||
                editForm.videoUrl
              )
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

        placements:
          editForm.placements.join(","),

        targetPages:
          editForm.targetPages.join(","),

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
        if (
          typeof error.response.data ===
          "string"
        ) {
          message =
            error.response.data;
        } else if (
          error.response.data &&
          error.response.data.message
        ) {
          message =
            error.response.data.message;
        } else if (
          error.response.status === 403
        ) {
          message =
            "You are not authorized to update advertisements.";
        } else if (
          error.response.status === 400
        ) {
          message =
            "Invalid advertisement data.";
        } else if (
          error.response.status === 500
        ) {
          message =
            "Server error. Please try again.";
        }
      } else if (error.request) {
        message =
          "Cannot connect to server. Please make sure Spring Boot backend is running.";
      }

      alert(message);

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GET PLACEMENT LABEL
  // =====================================================

  const getPlacementLabel = (placement) => {
    const found =
      placementOptions.find(
        (item) =>
          item.value === placement
      );

    return found
      ? found.label
      : placement;
  };

  // =====================================================
  // STYLES
  // =====================================================

  const pageStyle = {
    padding: "30px",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    gap: "20px",
    flexWrap: "wrap",
  };

  const pageTitle = {
    margin: 0,
    fontSize: "30px",
    fontWeight: "700",
    color: "#111827",
  };

  const pageSubtitle = {
    marginTop: "8px",
    color: "#6b7280",
    fontSize: "15px",
  };

  const totalBadge = {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    padding: "12px 18px",
    borderRadius: "10px",
    fontWeight: "700",
  };

  const cardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    padding: "25px",
    marginBottom: "30px",
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.08)",
  };

  const sectionTitle = {
    marginTop: 0,
    marginBottom: "20px",
    fontSize: "22px",
    color: "#111827",
  };

  const formGrid = {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginBottom: "20px",
  };

  const fieldStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "20px",
  };

  const labelStyle = {
    fontWeight: "600",
    color: "#374151",
    fontSize: "14px",
  };

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    border:
      "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "#ffffff",
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: "100px",
    resize: "vertical",
  };

  const helpText = {
    color: "#6b7280",
    fontSize: "12px",
  };

  const placementBox = {
    backgroundColor: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "20px",
  };

  // ===================================================
  // PAGE TARGET STYLES
  // ===================================================

  const pageTargetBox = {
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "20px",
  };

  const pageTargetDescription = {
    color: "#6b7280",
    fontSize: "14px",
    marginBottom: "15px",
  };

  const pageTargetGrid = {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "10px",
  };

  const pageTargetOption = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#ffffff",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
  };

  const placementDescription = {
    color: "#6b7280",
    fontSize: "14px",
    marginBottom: "15px",
  };

  const placementGrid = {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "12px",
  };

  const placementOption = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#ffffff",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
  };

  const settingsBox = {
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "20px",
  };

  const imageSettingsStyle = {
    ...settingsBox,
    backgroundColor: "#f0fdf4",
    border:
      "1px solid #bbf7d0",
  };

  const videoSettingsStyle = {
    ...settingsBox,
    backgroundColor: "#fefce8",
    border:
      "1px solid #fde68a",
  };

  const settingsTitle = {
    marginTop: 0,
    marginBottom: "15px",
    color: "#374151",
    fontSize: "17px",
  };

  const checkboxLabel = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "15px",
    fontWeight: "600",
    color: "#374151",
  };

  const primaryButton = {
    border: "none",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    padding: "13px 22px",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  };

  const existingSection = {
    marginTop: "30px",
  };

  const existingHeader = {
    marginBottom: "20px",
  };

  const emptyBox = {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "35px",
    textAlign: "center",
    color: "#6b7280",
    boxShadow:
      "0 3px 12px rgba(0,0,0,0.06)",
  };

  const adCardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    padding: "24px",
    marginBottom: "20px",
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.08)",
  };

  const adTopRow = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  };

  const orderBadge = {
    display: "inline-block",
    backgroundColor: "#e5e7eb",
    color: "#374151",
    padding: "5px 9px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "700",
    marginRight: "8px",
  };

  const bannerBadge = {
    display: "inline-block",
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
    padding: "5px 9px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "700",
    marginRight: "8px",
  };

  const imageBadge = {
    display: "inline-block",
    backgroundColor: "#dcfce7",
    color: "#15803d",
    padding: "5px 9px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "700",
    marginRight: "8px",
  };

  const videoBadge = {
    display: "inline-block",
    backgroundColor: "#fef3c7",
    color: "#b45309",
    padding: "5px 9px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "700",
    marginRight: "8px",
  };

  const activeBadge = {
    display: "inline-block",
    backgroundColor: "#dcfce7",
    color: "#15803d",
    padding: "5px 9px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "700",
  };

  const inactiveBadge = {
    display: "inline-block",
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    padding: "5px 9px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "700",
  };

  const adTitle = {
    marginTop: "15px",
    marginBottom: "8px",
    fontSize: "20px",
    color: "#111827",
  };

  const descriptionStyle = {
    color: "#6b7280",
    lineHeight: "1.6",
    marginBottom: "18px",
  };

  const detailsGrid = {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "15px",
    marginBottom: "20px",
  };

  const savedPlacementBox = {
    backgroundColor: "#f9fafb",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
  };

  const savedPlacementList = {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "10px",
  };

  const placementBadge = {
    backgroundColor: "#e0e7ff",
    color: "#3730a3",
    padding: "6px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
  };

  const noPlacementText = {
    color: "#9ca3af",
    fontSize: "13px",
  };

  const imageInfoBox = {
    backgroundColor: "#f9fafb",
    borderRadius: "10px",
    padding: "15px",
    marginBottom: "20px",
  };

  const imagePreviewWrapper = {
    width: "100%",
    maxHeight: "250px",
    overflow: "hidden",
    borderRadius: "8px",
    backgroundColor: "#e5e7eb",
    marginBottom: "10px",
  };

  const imagePreview = {
    display: "block",
    width: "100%",
    maxHeight: "250px",
    objectFit: "contain",
  };

  const videoInfoBox = {
    backgroundColor: "#f9fafb",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  };

  const urlText = {
    wordBreak: "break-all",
    color: "#4b5563",
    fontSize: "13px",
    marginTop: "8px",
  };

  const actionsStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "20px",
  };

  const actionButton = {
    border: "none",
    color: "#ffffff",
    padding: "10px 16px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600",
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div style={pageStyle}>

      {/* =================================================
          HEADER
      ================================================= */}

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

          {/* TITLE + ADVERTISER */}

          <div style={formGrid}>

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
              value={form.description}
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
              value={form.targetUrl}
              onChange={handleChange}
              style={inputStyle}
            />

          </div>

          {/* TYPE + DISPLAY ORDER */}

          <div style={formGrid}>

            <div style={fieldStyle}>

              <label style={labelStyle}>
                Advertisement Type
              </label>

              <select
                name="adType"
                value={form.adType}
                onChange={handleChange}
                style={inputStyle}
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

          {/* PLACEMENTS */}

          <div style={placementBox}>

            <h3 style={settingsTitle}>
              Ad Placement
            </h3>

            <p style={placementDescription}>
              Select where this advertisement
              should appear on the website.
            </p>

            <div style={placementGrid}>

              {placementOptions.map(
                (option) => (
                  <label
                    key={option.value}
                    style={placementOption}
                  >

                    <input
                      type="checkbox"
                      checked={
                        form.placements.includes(
                          option.value
                        )
                      }
                      onChange={() =>
                        handlePlacementChange(
                          option.value
                        )
                      }
                    />

                    <span>
                      {option.label}
                    </span>

                  </label>
                )
              )}

            </div>

          </div>

          {/* =================================================
              PAGE TARGETING
          ================================================= */}

          <div style={pageTargetBox}>

            <h3 style={settingsTitle}>
              Show Advertisement On
            </h3>

            <p style={pageTargetDescription}>
              Select which pages this
              advertisement should appear on.
              Leaving all unchecked means no
              page restriction is stored.
            </p>

            <div style={pageTargetGrid}>

              {pageTargetOptions.map(
                (option) => (
                  <label
                    key={option.value}
                    style={pageTargetOption}
                  >

                    <input
                      type="checkbox"
                      checked={
                        (form.targetPages || []).includes(
                          option.value
                        )
                      }
                      onChange={() =>
                        handlePageTargetChange(
                          option.value
                        )
                      }
                    />

                    <span>
                      {option.label}
                    </span>

                  </label>
                )
              )}

            </div>

          </div>

          {/* BANNER */}

          {form.adType === "BANNER" && (
  <div style={settingsBox}>

    <h3 style={settingsTitle}>
      Banner Settings
    </h3>

    <label style={labelStyle}>
      Upload Banner Image *
    </label>

    <input
      type="file"
      accept="image/*"
      name="bannerFile"
      onChange={(e) =>
        setForm({
          ...form,
          bannerFile: e.target.files[0],
        })
      }
      style={inputStyle}
    />

  </div>
)}

          {/* IMAGE */}

          {form.adType === "IMAGE" && (
            <div style={imageSettingsStyle}>

              <h3 style={settingsTitle}>
                Image Advertisement Settings
              </h3>

              <label style={labelStyle}>
  Upload Image *
</label>

<input
  type="file"
  accept="image/*"
  onChange={(e) =>
    setForm({
      ...form,
      imageFile: e.target.files[0],
    })
  }
  style={inputStyle}
/>

            </div>
          )}

          {/* VIDEO */}

          {form.adType === "VIDEO" && (
            <div style={videoSettingsStyle}>

              <h3 style={settingsTitle}>
                Video Advertisement Settings
              </h3>

              <label style={labelStyle}>
                Video URL *
              </label>

              <input
  type="file"
  accept="video/*"
  onChange={(e) =>
    setForm({
      ...form,
      videoFile: e.target.files[0],
    })
  }
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

          {/* CREATE BUTTON */}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...primaryButton,
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading
              ? "Creating..."
              : "Create Advertisement"}
          </button>

        </form>

      </div>

      {/* =================================================
          EXISTING ADVERTISEMENTS
      ================================================= */}

      <div style={existingSection}>

        <div style={existingHeader}>

          <h2 style={sectionTitle}>
            Existing Advertisements
          </h2>

          <p style={pageSubtitle}>
            Manage all advertisements from here.
          </p>

        </div>

        {/* LOADING */}

        {loading && ads.length === 0 ? (

          <div style={emptyBox}>
            Loading advertisements...
          </div>

        ) : ads.length === 0 ? (

          <div style={emptyBox}>
            No advertisements found.
          </div>

        ) : (

          <div>

            {ads.map((ad, index) => {

              // -----------------------------------------
              // PLACEMENTS
              // -----------------------------------------

              let adPlacements = [];

              if (
                Array.isArray(ad.placements)
              ) {
                adPlacements =
                  ad.placements;
              } else if (
                typeof ad.placements === "string" &&
                ad.placements.trim() !== ""
              ) {
                adPlacements =
                  ad.placements
                    .split(",")
                    .map(
                      (item) =>
                        item.trim()
                    )
                    .filter(Boolean);
              }

              return (
                <div
                  key={ad.id}
                  style={adCardStyle}
                >

                  {/* TOP ROW */}

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
                          ad.adType === "VIDEO"
                            ? videoBadge
                            : ad.adType === "IMAGE"
                            ? imageBadge
                            : bannerBadge
                        }
                      >
                        {ad.adType === "VIDEO"
                          ? "VIDEO"
                          : ad.adType === "IMAGE"
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

                    {ad.adType === "VIDEO"
                      ? "🎬"
                      : ad.adType === "IMAGE"
                      ? "🖼️"
                      : "📢"}{" "}

                    {ad.title}

                  </h3>

                  {/* DESCRIPTION */}

                  {ad.description && (
                    <p
                      style={
                        descriptionStyle
                      }
                    >
                      {ad.description}
                    </p>
                  )}

                  {/* DETAILS */}

                  <div style={detailsGrid}>

                    <div>
                      <strong>
                        Advertiser
                      </strong>

                      <div>
                        {ad.advertiserName ||
                          "-"}
                      </div>
                    </div>

                    <div>
                      <strong>
                        Display Order
                      </strong>

                      <div>
                        {ad.displayOrder ||
                          index + 1}
                      </div>
                    </div>

                    <div>
                      <strong>
                        Impressions
                      </strong>

                      <div>
                        {ad.impressions ||
                          0}
                      </div>
                    </div>

                    <div>
                      <strong>
                        Clicks
                      </strong>

                      <div>
                        {ad.clicks ||
                          0}
                      </div>
                    </div>

                  </div>

                  {/* PLACEMENTS */}

                  <div
                    style={
                      savedPlacementBox
                    }
                  >

                    <strong>
                      Ad Placements
                    </strong>

                    <div
                      style={
                        savedPlacementList
                      }
                    >

                      {adPlacements.length >
                      0 ? (

                        adPlacements.map(
                          (placement) => (
                            <span
                              key={
                                placement
                              }
                              style={
                                placementBadge
                              }
                            >
                              {getPlacementLabel(
                                placement
                              )}
                            </span>
                          )
                        )

                      ) : (

                        <span
                          style={
                            noPlacementText
                          }
                        >
                          No placement selected
                        </span>

                      )}

                    </div>

                  </div>

                  {/* IMAGE */}

                  {ad.adType === "IMAGE" && (
                    <div
                      style={imageInfoBox}
                    >

                      <div
                        style={
                          imagePreviewWrapper
                        }
                      >

                        {ad.imageUrl ? (
                          <img
                            src={
                              ad.imageUrl
                            }
                            alt={
                              ad.title ||
                              "Advertisement"
                            }
                            style={
                              imagePreview
                            }
                            onError={(e) => {
                              e.currentTarget.style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              padding: "30px",
                              textAlign:
                                "center",
                              color:
                                "#6b7280",
                            }}
                          >
                            Image not available
                          </div>
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

                  {/* BANNER */}

                  {ad.adType === "BANNER" && (
                    <div
                      style={imageInfoBox}
                    >

                      <div
                        style={
                          imagePreviewWrapper
                        }
                      >

                        {ad.imageUrl ? (
                          <img
                            src={
                              ad.imageUrl
                            }
                            alt={
                              ad.title ||
                              "Banner Advertisement"
                            }
                            style={
                              imagePreview
                            }
                            onError={(e) => {
                              e.currentTarget.style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              padding: "30px",
                              textAlign:
                                "center",
                              color:
                                "#6b7280",
                            }}
                          >
                            Banner image not available
                          </div>
                        )}

                      </div>

                      <div
                        style={urlText}
                      >
                        <strong>
                          Banner Image:
                        </strong>{" "}
                        {ad.imageUrl ||
                          "Not available"}
                      </div>

                    </div>
                  )}

                  {/* VIDEO */}

                  {ad.adType === "VIDEO" && (
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

                  {/* ACTION BUTTONS */}

                  <div
                    style={actionsStyle}
                  >

                    {/* ACTIVATE / DEACTIVATE */}

                    {ad.active ? (

                      <button
                        type="button"
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
                        type="button"
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

                    {/* EDIT */}

                    <button
                      type="button"
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

                    {/* DELETE */}

                    <button
                      type="button"
                      onClick={() =>
                        deleteAd(ad.id)
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
              );
            })}

          </div>
        )}

      </div>

      {/* =================================================
          EDIT MODAL
      ================================================= */}

      {editingAd && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor:
              "rgba(0,0,0,0.55)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            zIndex: 9999,
            overflowY: "auto",
          }}
        >

          <div
            style={{
              backgroundColor: "#ffffff",
              width: "100%",
              maxWidth: "800px",
              maxHeight: "90vh",
              overflowY: "auto",
              borderRadius: "14px",
              padding: "25px",
              boxSizing: "border-box",
            }}
          >

            {/* MODAL HEADER */}

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >

              <h2
                style={{
                  margin: 0,
                  color: "#111827",
                }}
              >
                Edit Advertisement
              </h2>

              <button
                type="button"
                onClick={closeEditForm}
                style={{
                  border: "none",
                  backgroundColor:
                    "#e5e7eb",
                  width: "35px",
                  height: "35px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
              >
                ×
              </button>

            </div>

            {/* EDIT FORM */}

            <form onSubmit={updateAd}>

              {/* TITLE + ADVERTISER */}

              <div style={formGrid}>

                <div style={fieldStyle}>

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
                    style={inputStyle}
                  />

                </div>

                <div style={fieldStyle}>

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
                    style={inputStyle}
                  />

                </div>

              </div>

              {/* DESCRIPTION */}

              <div style={fieldStyle}>

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
                  style={textareaStyle}
                />

              </div>

              {/* TARGET URL */}

              <div style={fieldStyle}>

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
                  style={inputStyle}
                />

              </div>

              {/* TYPE + ORDER */}

              <div style={formGrid}>

                <div style={fieldStyle}>

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
                    style={inputStyle}
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

                <div style={fieldStyle}>

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
                    style={inputStyle}
                  />

                </div>

              </div>

              {/* ACTIVE */}

              <div
                style={{
                  marginBottom: "20px",
                }}
              >

                <label
                  style={checkboxLabel}
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
                    Advertisement Active
                  </span>

                </label>

              </div>

              {/* PLACEMENTS */}

              <div
                style={placementBox}
              >

                <h3
                  style={settingsTitle}
                >
                  Ad Placement
                </h3>

                <div
                  style={placementGrid}
                >

                  {placementOptions.map(
                    (option) => (
                      <label
                        key={
                          option.value
                        }
                        style={
                          placementOption
                        }
                      >

                        <input
                          type="checkbox"
                          checked={
                            editForm.placements.includes(
                              option.value
                            )
                          }
                          onChange={() =>
                            handleEditPlacementChange(
                              option.value
                            )
                          }
                        />

                        <span>
                          {option.label}
                        </span>

                      </label>
                    )
                  )}

                </div>

              </div>

              {/* BANNER EDIT */}

{editForm.adType === "BANNER" && (
  <div style={settingsBox}>

    <h3 style={settingsTitle}>
      Banner Settings
    </h3>

    <label style={labelStyle}>
      Upload New Banner Image
    </label>

    <input
      type="file"
      accept="image/*"
      onChange={(e) =>
        setEditForm({
          ...editForm,
          bannerFile: e.target.files[0],
        })
      }
      style={inputStyle}
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
                    Image Advertisement Settings
                  </h3>
                  
                  <label style={labelStyle}>
  Upload New Image
</label>

<input
  type="file"
  accept="image/*"
  onChange={(e) =>
    setEditForm({
      ...editForm,
      imageFile: e.target.files[0],
    })
  }
  style={inputStyle}
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
                    Video Advertisement Settings
                  </h3>

                  <label style={labelStyle}>
  Upload New Video
</label>

<input
  type="file"
  accept="video/*"
  onChange={(e) =>
    setEditForm({
      ...editForm,
      videoFile: e.target.files[0],
    })
  }
  style={inputStyle}
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
                      Allow user to skip video
                    </span>

                  </label>

                  {editForm.skippable && (
                    <div
                      style={fieldStyle}
                    >

                      <label
                        style={labelStyle}
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
                        style={inputStyle}
                      />

                    </div>
                  )}

                </div>
              )}

              {/* MODAL BUTTONS */}

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "flex-end",
                  gap: "10px",
                  marginTop: "20px",
                }}
              >

                <button
                  type="button"
                  onClick={
                    closeEditForm
                  }
                  style={{
                    border: "none",
                    backgroundColor:
                      "#6b7280",
                    color: "#ffffff",
                    padding:
                      "12px 20px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    ...primaryButton,
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

export default AdminAds;