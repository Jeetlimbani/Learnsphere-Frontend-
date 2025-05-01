// src/api/studentAPI.js
import axios from "axios";

export const getPublishedCourses = async () => {
  const response = await axios.get(
    "http://localhost:4000/api/courses/published",
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const getSessions = async (courseId) => {
  const response = await axios.get(
    `http://localhost:4000/api/courses/${courseId}/sessions`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const getEnrolledCourses = async (studentId) => {
  const response = await axios.get(
    `http://localhost:4000/api/enrollments/student/${studentId}`,
    { withCredentials: true }
  );
  return response.data.map((enrollment) => enrollment.course);
};

export const enrollInCourse = async (courseId, studentId) => {
  await axios.post(
    "http://localhost:4000/api/enrollments",
    { courseId, studentId }, // ✅ Include studentId in the request body
    { withCredentials: true }
  );
};
