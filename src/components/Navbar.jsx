import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../axiosConfig";

function Navbar({
  isLoggedIn,
  setIsLoggedIn,
  isAdminLoggedIn,
  setIsAdminLoggedIn
}) {

  const navigate = useNavigate();

  // ==================================================
  // GET USER SAFELY
  // ==================================================

  const getStoredUser = () => {
    try {
      return JSON.parse(
        localStorage.getItem("user") || "null"
      );
    } catch (error) {
      console.log("User parse error:", error);
      return null;
    }
  };

  const user = getStoredUser();

  // ==================================================
  // NOTIFICATION COUNT
  // ==================================================

  const [notificationCount, setNotificationCount] =
    useState(0);


  // ==================================================
  // NOTIFICATION COUNT
  // ==================================================

  const loadNotificationCount = async () => {

    // ------------------------------------------------
    // DO NOT CALL API WITHOUT LOGIN
    // ------------------------------------------------

    if (!isLoggedIn) {
      setNotificationCount(0);
      return;
    }

    // ------------------------------------------------
    // USER NOT AVAILABLE
    // ------------------------------------------------

    if (!user || !user.id) {
      setNotificationCount(0);
      return;
    }

    // ------------------------------------------------
    // RECRUITER / ADMIN DOES NOT NEED USER COUNT
    // ------------------------------------------------

    if (
      user.role === "RECRUITER" ||
      user.role === "ADMIN"
    ) {
      setNotificationCount(0);
      return;
    }

    // ------------------------------------------------
    // TOKEN CHECK
    // ------------------------------------------------

    const token =
      localStorage.getItem("token");

    if (!token) {
      setNotificationCount(0);
      return;
    }

    // ------------------------------------------------
    // API CALL
    // ------------------------------------------------

    try {

      const response =
        await api.get(
          "/notifications/count"
        );

      setNotificationCount(
        Number(response.data) || 0
      );

    } catch (error) {

      console.log(
        "Notification count error:",
        `error.response?.status` ||
        error.message
      );

    }
  };


  // ==================================================
  // USER NOTIFICATION INTERVAL
  // ==================================================

  useEffect(() => {

    // ------------------------------------------------
    // NOT LOGGED IN
    // ------------------------------------------------

    if (!isLoggedIn) {

      setNotificationCount(0);

      return;
    }

    // ------------------------------------------------
    // NO USER
    // ------------------------------------------------

    if (!user || !user.id) {

      setNotificationCount(0);

      return;
    }

    // ------------------------------------------------
    // RECRUITER / ADMIN
    // ------------------------------------------------

    if (
      user.role === "RECRUITER" ||
      user.role === "ADMIN"
    ) {

      setNotificationCount(0);

      return;
    }

    // ------------------------------------------------
    // TOKEN
    // ------------------------------------------------

    const token =
      localStorage.getItem("token");

    if (!token) {

      setNotificationCount(0);

      return;
    }

    // ------------------------------------------------
    // FIRST LOAD
    // ------------------------------------------------

    loadNotificationCount();


    // ------------------------------------------------
    // EVERY 3 SECONDS
    // ------------------------------------------------

    const interval =
      setInterval(() => {

        loadNotificationCount();

      }, 3000);


    // ------------------------------------------------
    // CLEANUP
    // ------------------------------------------------

    return () => {

      clearInterval(interval);

    };

  }, [isLoggedIn]);


  // ==================================================
  // RECRUITER ACTIVITY
  // ==================================================

  useEffect(() => {

    if (
      !isLoggedIn ||
      !user ||
      !user.id ||
      user.role !== "RECRUITER"
    ) {
      return;
    }


    // ------------------------------------------------
    // UPDATE ACTIVITY
    // ------------------------------------------------

    const updateActivity = async () => {

      try {

        await api.put(
          `/users/activity/${user.id}`
        );

      } catch (error) {

        console.log(
          "Recruiter activity update failed:",
          error
        );

      }

    };


    // ------------------------------------------------
    // FIRST CALL
    // ------------------------------------------------

    updateActivity();


    // ------------------------------------------------
    // EVERY 30 SECONDS
    // ------------------------------------------------

    const interval =
      setInterval(() => {

        updateActivity();

      }, 30000);


    // ------------------------------------------------
    // CLEANUP
    // ------------------------------------------------

    return () => {

      clearInterval(interval);

    };

  }, [isLoggedIn]);


  // ==================================================
  // LOGOUT
  // ==================================================

  const handleLogout = async () => {

    try {

      // =================================================
      // RECRUITER LOGOUT
      // =================================================

      if (
        user &&
        user.role === "RECRUITER"
      ) {

        try {

          await api.put(
            `/users/logout/${user.id}`
          );

        } catch (error) {

          console.log(
            "Recruiter logout status update failed:",
            error
          );

        }

      }


      // =================================================
      // REMOVE LOCAL STORAGE
      // =================================================

      localStorage.removeItem("token");

      localStorage.removeItem("user");

      localStorage.removeItem("isLoggedIn");

      localStorage.removeItem("adminLoggedIn");


      // =================================================
      // RESET STATES
      // =================================================

      setNotificationCount(0);

      setIsLoggedIn(false);

      setIsAdminLoggedIn(false);


      // =================================================
      // MESSAGE
      // =================================================

      alert(
        "Logged Out Successfully"
      );


      // =================================================
      // NAVIGATE
      // =================================================

      navigate("/login");


    } catch (error) {

      console.error(
        "Logout Error:",
        error
      );


      // ------------------------------------------------
      // FORCE LOCAL LOGOUT
      // ------------------------------------------------

      localStorage.removeItem("token");

      localStorage.removeItem("user");

      localStorage.removeItem("isLoggedIn");

      localStorage.removeItem("adminLoggedIn");


      setNotificationCount(0);

      setIsLoggedIn(false);

      setIsAdminLoggedIn(false);

      navigate("/login");

    }

  };


  // ==================================================
  // ADMIN NAVBAR
  // ==================================================

  if (isAdminLoggedIn) {

    return (

      <nav
        style={{
          backgroundColor: "#212121",
          color: "white",
          padding: "15px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >

        <h2 style={{ margin: 0 }}>
          HariHire Admin
        </h2>


        <div
          style={{
            display: "flex",
            alignItems: "center"
          }}
        >

          <Link
            to="/admin/dashboard"
            style={{
              color: "white",
              textDecoration: "none",
              marginRight: "25px"
            }}
          >
            Dashboard
          </Link>


          <Link
            to="/admin/users"
            style={{
              color: "white",
              textDecoration: "none",
              marginRight: "25px"
            }}
          >
            Users
          </Link>


          <Link
            to="/admin/recruiters"
            style={{
              color: "white",
              textDecoration: "none",
              marginRight: "25px"
            }}
          >
            Recruiters
          </Link>


          <Link
            to="/admin/jobs"
            style={{
              color: "white",
              textDecoration: "none",
              marginRight: "25px"
            }}
          >
            Jobs
          </Link>


          <Link
            to="/admin/applications"
            style={{
              color: "white",
              textDecoration: "none",
              marginRight: "25px"
            }}
          >
            Applications
          </Link>


          <Link
            to="/admin/reviews"
            style={{
              color: "white",
              textDecoration: "none",
              marginRight: "25px"
            }}
          >
            ⭐ Reviews
          </Link>


          <button
            type="button"
            onClick={handleLogout}
            style={{
              backgroundColor: "red",
              color: "white",
              border: "none",
              padding: "8px 18px",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            Logout
          </button>

        </div>

      </nav>

    );

  }


  // ==================================================
  // NORMAL USER / RECRUITER NAVBAR
  // ==================================================

  return (

    <nav
      style={{
        backgroundColor: "#1976d2",
        color: "white",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >

      <h2 style={{ margin: 0 }}>
        HariHire
      </h2>


      <div>

        {/* ==================================================
            NOT LOGGED IN
        ================================================== */}

        {!isLoggedIn ? (

          <>

            <Link
              to="/"
              style={{
                color: "white",
                textDecoration: "none",
                marginRight: "20px"
              }}
            >
              Home
            </Link>


            <Link
              to="/register"
              style={{
                color: "white",
                textDecoration: "none",
                marginRight: "20px"
              }}
            >
              Register
            </Link>


            <Link
              to="/login"
              style={{
                color: "white",
                textDecoration: "none"
              }}
            >
              Login
            </Link>

          </>

        ) : (

          <>

            {/* ==================================================
                RECRUITER NAVBAR
            ================================================== */}

            {user &&
            user.role === "RECRUITER" ? (

              <>

                <Link
                  to="/recruiter-dashboard"
                  style={{
                    color: "white",
                    textDecoration: "none",
                    marginRight: "20px"
                  }}
                >
                  Dashboard
                </Link>


                <Link
                  to="/my-posted-jobs"
                  style={{
                    color: "white",
                    textDecoration: "none",
                    marginRight: "20px"
                  }}
                >
                  My Posted Jobs
                </Link>


                <Link
                  to="/post-job"
                  style={{
                    color: "white",
                    textDecoration: "none",
                    marginRight: "20px"
                  }}
                >
                  Post Job
                </Link>


                <Link
                  to="/profile"
                  style={{
                    color: "white",
                    textDecoration: "none",
                    marginRight: "20px"
                  }}
                >
                  My Profile
                </Link>

              </>

            ) : (

              /* ==================================================
                 JOB SEEKER NAVBAR
              ================================================== */

              <>

                <Link
                  to="/dashboard"
                  style={{
                    color: "white",
                    textDecoration: "none",
                    marginRight: "20px"
                  }}
                >
                  Dashboard
                </Link>


                <Link
                  to="/jobs"
                  style={{
                    color: "white",
                    textDecoration: "none",
                    marginRight: "20px"
                  }}
                >
                  Jobs
                </Link>


                <Link
                  to="/my-applications"
                  style={{
                    color: "white",
                    textDecoration: "none",
                    marginRight: "20px"
                  }}
                >
                  My Applications
                </Link>


                {/* ==================================================
                    NOTIFICATIONS
                ================================================== */}

                <Link
                  to="/notifications"
                  style={{
                    color: "white",
                    textDecoration: "none",
                    marginRight: "20px"
                  }}
                >

                  🔔 Notifications

                  {notificationCount > 0 && (

                    <span
                      style={{
                        backgroundColor: "red",
                        borderRadius: "50%",
                        padding: "2px 8px",
                        marginLeft: "5px"
                      }}
                    >
                      {notificationCount}
                    </span>

                  )}

                </Link>


                <Link
                  to="/messages"
                  style={{
                    color: "white",
                    textDecoration: "none",
                    marginRight: "20px"
                  }}
                >
                  💬 Messages
                </Link>


                {/* ==================================================
                    REVIEWS
                ================================================== */}

                <Link
                  to="/reviews"
                  style={{
                    color: "white",
                    textDecoration: "none",
                    marginRight: "20px"
                  }}
                >
                  ⭐ Reviews
                </Link>


                {/* ==================================================
                    PROFILE
                ================================================== */}

                <Link
                  to="/profile"
                  style={{
                    color: "white",
                    textDecoration: "none",
                    marginRight: "20px"
                  }}
                >
                  My Profile
                </Link>


                {/* ==================================================
                    SAVED JOBS
                ================================================== */}

                <Link
                  to="/saved-jobs"
                  style={{
                    color: "white",
                    textDecoration: "none",
                    marginRight: "20px"
                  }}
                >
                  ⭐ Saved Jobs
                </Link>

              </>

            )}


            {/* ==================================================
                LOGOUT
            ================================================== */}

            <button
              type="button"
              onClick={handleLogout}
              style={{
                backgroundColor: "red",
                color: "white",
                border: "none",
                padding: "8px 15px",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Logout
            </button>

          </>

        )}

      </div>

    </nav>

  );
}

export default Navbar;