import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api"; // Adjust this to match your backend URL

console.log(API_URL);

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable sending cookies
});

export const teacherPositionService = {
  // Get all teacher positions
  getAllPositions: async () => {
    try {
      const response = await axiosInstance.get("/teacher-positions");
      return response.data;
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        console.error(
          "Không thể kết nối đến server. Vui lòng kiểm tra lại server của bạn.",
        );
      } else {
        console.error("Error fetching teacher positions:", error);
      }
      throw error;
    }
  },

  // Create new teacher position
  createPosition: async (positionData) => {
    try {
      const response = await axiosInstance.post(
        "/teacher-positions",
        positionData,
      );
      console.log(positionData);
      return response.data;
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        console.error(
          "Không thể kết nối đến server. Vui lòng kiểm tra lại server của bạn.",
        );
      } else {
        console.error("Error creating teacher position:", error);
        // Log more detailed error information
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
