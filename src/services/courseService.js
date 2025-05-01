// // courseService.js
// import axios from 'axios';

// const COURSE_API_URL = 'http://localhost:4000/api/courses';

// // Fetch courses created by instructor
// export const fetchCoursesByInstructor = (instructorId) => {
//   return axios.get(`${COURSE_API_URL}/instructor/${instructorId}`, { withCredentials: true });
// };

// // Add a new course
// export const addCourse = (courseData) => {
//   return axios.post(`${COURSE_API_URL}`, courseData, { withCredentials: true });
// };

// // Update an existing course
// export const updateCourse = (courseId, updatedData) => {
//   return axios.put(`${COURSE_API_URL}/${courseId}`, updatedData, { withCredentials: true });
// };

// // Delete a course
// export const deleteCourse = (courseId) => {
//   return axios.delete(`${COURSE_API_URL}/${courseId}`, { withCredentials: true });
// };
// // Function to add a session to a specific course
// courseService.js
import axios from 'axios';

const COURSE_API_URL = 'http://localhost:4000/api/courses';

// Fetch courses created by instructor
export const fetchCoursesByInstructor = (instructorId) => {
  return axios.get(`${COURSE_API_URL}/instructor/${instructorId}`, { withCredentials: true });
};

// Add a new course
export const addCourse = (courseData) => {
  return axios.post(COURSE_API_URL, courseData, { withCredentials: true });
};

// Update an existing course
export const updateCourse = (courseId, updatedData) => {
  return axios.put(`${COURSE_API_URL}/${courseId}`, updatedData, { withCredentials: true });
};

// Delete a course
export const deleteCourse = (courseId) => {
  return axios.delete(`${COURSE_API_URL}/${courseId}`, { withCredentials: true });
};

// Add a session to a specific course
export const addSession = (courseId, sessionData) => {
  return axios.post(`${COURSE_API_URL}/${courseId}/sessions`, sessionData, { withCredentials: true });
};

// Update a session for a specific course
export const updateSession = ( sessionId, updatedSessionData) => {
  return axios.put(
    `${COURSE_API_URL}/sessions/${sessionId}`,
    updatedSessionData,
    { withCredentials: true }
  );
};

export const deleteSession = ( sessionId) => {
  return axios.delete(`${COURSE_API_URL}/sessions/${sessionId}`, {
    withCredentials: true,
  });
};
