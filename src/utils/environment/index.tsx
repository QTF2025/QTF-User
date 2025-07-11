import axios from "axios";
import localStorageContent from "../localstorage";

const URL = axios.create({
  //baseURL: process.env.REACT_APP_API_BASE_URL,
  // baseURL: "http://134.209.150.58:8080/v1",
  baseURL: "https://api.quesstaxfiling.com/v1/",
});

URL.interceptors.request.use(
  async (config: any) => {
    config.headers = {
      Authorization: `Bearer ${localStorageContent.getAccessToken()}`,
    };
    return config;
  },
  (error: any) => {
    Promise.reject(error);
  }
);

URL.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: any) => {
    if (error.response) {
      // If the server responded with an error status code
      const errorMessage = error.response.data.message || "An error occurred";
      if (errorMessage === "Please authenticate") {
        localStorage.clear();
        window.location.href = "/";
      }
      return Promise.reject(errorMessage);
    } else if (error.request) {
      // If the request was made but no response was received
      return Promise.reject("No response received");
    } else {
      // Something happened in setting up the request
      return Promise.reject("Request setup error");
    }
  }
);
export default URL;
