import axios from "axios";


// =====================================================
// AXIOS INSTANCE
// =====================================================

const api = axios.create({

  baseURL: "http://localhost:8085",

  headers: {
    "Content-Type": "application/json"
  }

});


// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

api.interceptors.request.use(

  (config) => {

    const token =
      localStorage.getItem("token");


    // =================================================
    // DO NOT SEND TOKEN FOR LOGIN / REGISTER
    // =================================================

    const publicEndpoints = [
      "/users/login",
      "/users/register"
    ];


    const isPublicEndpoint =
      publicEndpoints.some(
        (endpoint) =>
          config.url === endpoint
      );


    // =================================================
    // ADD JWT ONLY TO PROTECTED REQUESTS
    // =================================================

    if (
      token &&
      !isPublicEndpoint
    ) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }


    return config;

  },

  (error) => {

    return Promise.reject(error);

  }

);


// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

api.interceptors.response.use(

  (response) => {

    return response;

  },

  (error) => {

    // Server response vachindi
    if (error.response) {

      console.error(
        "API ERROR:",
        error.response.status,
        error.response.data
      );

    }

    // Server response assalu raledu
    else if (error.request) {

      console.error(
        "SERVER CONNECTION ERROR:",
        error.request
      );

    }

    // Request create avvaledu
    else {

      console.error(
        "AXIOS ERROR:",
        error.message
      );

    }


    return Promise.reject(error);

  }

);


export default api;