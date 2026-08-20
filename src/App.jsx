import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from "react-router-dom";

import { useEffect, useState } from "react";

// =====================================================
// COMPONENTS
// =====================================================

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
SRC
import VideoAdManager from "./components/VideoAdManager";
import ImageAdManager from "./components/ImageAdManager";

// =====================================================
// GENERAL PAGES
// =====================================================

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import ApplyJob from "./pages/ApplyJob";

import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import SavedJobs from "./pages/SavedJobs";
import MyApplications from "./pages/MyApplications";

import Notifications from "./pages/Notifications";
import RecruiterNotifications from "./pages/RecruiterNotifications";

import Chat from "./pages/Chat";
import Messages from "./pages/Messages";

import VerifyOtp from "./pages/VerifyOtp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import PageReviews from "./pages/PageReviews";

// =====================================================
// JOB CATEGORY PAGES
// =====================================================

// All job categories are handled by CategoryJobs
import CategoryJobs from "./pages/CategoryJobs";

// =====================================================
// ADMIN PAGES
// =====================================================

import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminRecruiters from "./pages/AdminRecruiters";

import AdminJobs from "./pages/AdminJobs";
import AdminJobDetails from "./pages/AdminJobDetails";

import AdminApplications from "./pages/AdminApplications";
import AdminRevenue from "./pages/AdminRevenue";
import AdminAds from "./pages/AdminAds";
import AdminNotifications from "./pages/AdminNotifications";
import AdminReviews from "./pages/AdminReviews";

// =====================================================
// RECRUITER PAGES
// =====================================================

import RecruiterDashboard from "./pages/RecruiterDashboard";
import PostJob from "./pages/PostJob";
import MyJobs from "./pages/MyJobs";
import MyPostedJobs from "./pages/MyPostedJobs";
import Applicants from "./pages/Applicants";
import RecruiterApplications from "./pages/RecruiterApplications";
import EditJob from "./pages/EditJob";
import UserProfileView from "./pages/UserProfileView";

// =====================================================
// APP CONTENT
// =====================================================

function AppContent() {

  // ===================================================
  // LOGIN STATES
  // ===================================================

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  const [isAdminLoggedIn, setIsAdminLoggedIn] =
    useState(false);

  const location = useLocation();

  // ===================================================
  // CHECK LOGIN
  // ===================================================

  useEffect(() => {

    const userLoggedIn =
      localStorage.getItem("isLoggedIn") === "true";

    const adminLoggedIn =
      localStorage.getItem("adminLoggedIn") === "true";

    setIsLoggedIn(userLoggedIn);

    setIsAdminLoggedIn(adminLoggedIn);

  }, []);

  // ===================================================
  // IMAGE AD PAGES
  // ===================================================

  const imageAdPages = [
    "/jobs"
  ];

  // ===================================================
  // IMAGE AD CONDITION
  // ===================================================

  const shouldShowImageAd =
    isLoggedIn &&
    !isAdminLoggedIn &&
    (
      imageAdPages.includes(location.pathname) ||
      location.pathname.startsWith("/job/")
    );

  // ===================================================
  // RETURN
  // ===================================================

  return (
    <>
      {/* =================================================
          NAVBAR
      ================================================= */}

      <Navbar
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        isAdminLoggedIn={isAdminLoggedIn}
        setIsAdminLoggedIn={setIsAdminLoggedIn}
      />

      {/* =================================================
          VIDEO AD
      ================================================= */}

      {isLoggedIn && !isAdminLoggedIn && (
        <VideoAdManager
          isLoggedIn={isLoggedIn}
          isAdminLoggedIn={isAdminLoggedIn}
        />
      )}

      {/* =================================================
          IMAGE AD
      ================================================= */}

      {isLoggedIn && !isAdminLoggedIn && (
        <ImageAdManager
          isLoggedIn={isLoggedIn}
          isAdminLoggedIn={isAdminLoggedIn}
          trigger={shouldShowImageAd}
        />
      )}

      {/* =================================================
          ROUTES
      ================================================= */}

      <Routes>

        {/* =================================================
            PUBLIC PAGES
        ================================================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={
            <Login
              setIsLoggedIn={setIsLoggedIn}
              setIsAdminLoggedIn={
                setIsAdminLoggedIn
              }
            />
          }
        />

        {/* =================================================
            JOB MAIN PAGE
        ================================================= */}

        <Route
          path="/jobs"
          element={<Jobs />}
        />

        {/* =================================================
            ALL JOB CATEGORY PAGES
        ================================================= */}

        <Route
          path="/jobs/:category"
          element={<CategoryJobs />}
        />

        {/* =================================================
            JOB DETAILS
        ================================================= */}

        <Route
          path="/job/:id"
          element={<JobDetails />}
        />

        {/* =================================================
            JOB SEEKER
        ================================================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />


        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/saved-jobs"
          element={
            <ProtectedRoute>
              <SavedJobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-applications"
          element={
            <ProtectedRoute>
              <MyApplications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            RECRUITER DASHBOARD
        ================================================= */}

        <Route
          path="/recruiter-dashboard"
          element={
            <ProtectedRoute>
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            POST JOB
        ================================================= */}

        <Route
          path="/post-job"
          element={
            <ProtectedRoute>
              <PostJob />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            RECRUITER JOBS
        ================================================= */}

        <Route
          path="/my-jobs"
          element={
            <ProtectedRoute>
              <MyJobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-posted-jobs"
          element={
            <ProtectedRoute>
              <MyPostedJobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-job/:id"
          element={
            <ProtectedRoute>
              <EditJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/applicants/:jobId"
          element={
            <ProtectedRoute>
              <Applicants />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/job/:id/apply"
          element={
            <ProtectedRoute>
              <ApplyJob/>
              </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/applications"
          element={
            <ProtectedRoute>
              <RecruiterApplications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/notifications"
          element={
            <ProtectedRoute>
              <RecruiterNotifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-profile/:id"
          element={
            <ProtectedRoute>
              <UserProfileView />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            REVIEWS
        ================================================= */}

        <Route
          path="/reviews"
          element={<PageReviews />}
        />

        {/* =================================================
            ADMIN DASHBOARD
        ================================================= */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            ADMIN USERS
        ================================================= */}

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            ADMIN RECRUITERS
        ================================================= */}

        <Route
          path="/admin/recruiters"
          element={
            <ProtectedRoute>
              <AdminRecruiters />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            ADMIN JOBS
        ================================================= */}

        <Route
          path="/admin/jobs"
          element={
            <ProtectedRoute>
              <AdminJobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/jobs/:id"
          element={
            <ProtectedRoute>
              <AdminJobDetails />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            ADMIN APPLICATIONS
        ================================================= */}

        <Route
          path="/admin/applications"
          element={
            <ProtectedRoute>
              <AdminApplications />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            ADMIN REVENUE
        ================================================= */}

        <Route
          path="/admin/revenue"
          element={
            <ProtectedRoute>
              <AdminRevenue />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            ADMIN ADS
        ================================================= */}

        <Route
          path="/admin/ads"
          element={
            <ProtectedRoute>
              <AdminAds />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            ADMIN NOTIFICATIONS
        ================================================= */}

        <Route
          path="/admin/notifications"
          element={
            <ProtectedRoute>
              <AdminNotifications />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            ADMIN REVIEWS
        ================================================= */}

        <Route
          path="/admin/reviews"
          element={
            <ProtectedRoute>
              <AdminReviews />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            PASSWORD RESET
        ================================================= */}

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/verify-otp"
          element={<VerifyOtp />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

      </Routes>
    </>
  );
}

// =====================================================
// APP
// =====================================================

function App() {

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;