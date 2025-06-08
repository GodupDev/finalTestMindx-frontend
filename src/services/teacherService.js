import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api"; // Adjust this to match your backend URL

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable sending cookies
});

export const teacherService = {
  // Get all teachers
  getAllTeachers: async () => {
    try {
      const response = await axiosInstance.get("/teachers");
      return response.data;
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        console.error(
          "Không thể kết nối đến server. Vui lòng kiểm tra lại server của bạn.",
        );
      } else {
        console.error("Error fetching teachers:", error);
      }
      throw error;
    }
  },

  // Create new teacher
  createTeacher: async (teacherData) => {
    try {
      const response = await axiosInstance.post("/teachers", teacherData);
      return response.data;
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        console.error(
          "Không thể kết nối đến server. Vui lòng kiểm tra lại server của bạn.",
        );
      } else {
        console.error("Error creating teacher:", error);
        if (error.response) {
          console.error("Error response data:", error.response.data);
          console.error("Error response status:", error.response.status);
          console.error("Error response headers:", error.response.headers);
        }
      }
      throw error;
    }
  },
};
