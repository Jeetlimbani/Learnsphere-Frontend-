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

export const fetchAnalyticsData = async (instructorId, timeframe = 'month') => {
  try {
    return await api.get(`/analytics/instructor/${instructorId}`, {
      params: { timeframe },
    });
  } catch (error) {
    // If the API endpoint doesn't exist yet, return mock data
    console.warn('Analytics API not available, using mock data');
    
    // Mock data based on timeframe
    const mockData = {
      enrollmentsByMonth: generateEnrollmentData(timeframe),
      courseDistribution: [
        { name: 'Web Development', students: 120, value: 120 },
        { name: 'Data Science', students: 85, value: 85 },
        { name: 'UI/UX Design', students: 65, value: 65 },
        { name: 'Mobile App Dev', students: 48, value: 48 },
      ],
      studentEngagement: generateEngagementData(timeframe),
      courseCompletionRates: [
        { name: 'Completed', value: 68 },
        { name: 'In Progress', value: 22 },
        { name: 'Not Started', value: 10 },
      ],
      revenueData: generateRevenueData(timeframe),
    };
    
    // Return mock data in the same format as the API would
    return { data: mockData };
  }
};

// Helper functions to generate mock data based on timeframe
function generateEnrollmentData(timeframe) {
  if (timeframe === 'week') {
    return [
      { name: 'Mon', enrollments: 3 },
      { name: 'Tue', enrollments: 5 },
      { name: 'Wed', enrollments: 7 },
      { name: 'Thu', enrollments: 4 },
      { name: 'Fri', enrollments: 6 },
      { name: 'Sat', enrollments: 8 },
      { name: 'Sun', enrollments: 4 },
    ];
  } else if (timeframe === 'year') {
    return [
      { name: 'Jan', enrollments: 10 },
      { name: 'Feb', enrollments: 15 },
      { name: 'Mar', enrollments: 25 },
      { name: 'Apr', enrollments: 22 },
      { name: 'May', enrollments: 30 },
      { name: 'Jun', enrollments: 28 },
      { name: 'Jul', enrollments: 32 },
      { name: 'Aug', enrollments: 37 },
      { name: 'Sep', enrollments: 41 },
      { name: 'Oct', enrollments: 35 },
      { name: 'Nov', enrollments: 45 },
      { name: 'Dec', enrollments: 50 },
    ];
  } else { // month
    return [
      { name: 'Week 1', enrollments: 10 },
      { name: 'Week 2', enrollments: 15 },
      { name: 'Week 3', enrollments: 25 },
      { name: 'Week 4', enrollments: 22 },
    ];
  }
}

function generateEngagementData(timeframe) {
  if (timeframe === 'week') {
    return [
      { name: 'Day 1', engagement: 95 },
      { name: 'Day 2', engagement: 90 },
      { name: 'Day 3', engagement: 85 },
      { name: 'Day 4', engagement: 80 },
      { name: 'Day 5', engagement: 75 },
      { name: 'Day 6', engagement: 78 },
      { name: 'Day 7', engagement: 70 },
    ];
  } else if (timeframe === 'year') {
    return [
      { name: 'Jan', engagement: 95 },
      { name: 'Feb', engagement: 92 },
      { name: 'Mar', engagement: 88 },
      { name: 'Apr', engagement: 85 },
      { name: 'May', engagement: 82 },
      { name: 'Jun', engagement: 80 },
      { name: 'Jul', engagement: 78 },
      { name: 'Aug', engagement: 75 },
      { name: 'Sep', engagement: 73 },
      { name: 'Oct', engagement: 70 },
      { name: 'Nov', engagement: 68 },
      { name: 'Dec', engagement: 65 },
    ];
  } else { // month
    return [
      { name: 'Week 1', engagement: 95 },
      { name: 'Week 2', engagement: 85 },
      { name: 'Week 3', engagement: 75 },
      { name: 'Week 4', engagement: 70 },
    ];
  }
}

function generateRevenueData(timeframe) {
  if (timeframe === 'week') {
    return [
      { name: 'Mon', revenue: 300 },
      { name: 'Tue', revenue: 500 },
      { name: 'Wed', revenue: 700 },
      { name: 'Thu', revenue: 400 },
      { name: 'Fri', revenue: 600 },
      { name: 'Sat', revenue: 800 },
      { name: 'Sun', revenue: 400 },
    ];
  } else if (timeframe === 'year') {
    return [
      { name: 'Jan', revenue: 1200 },
      { name: 'Feb', revenue: 1800 },
      { name: 'Mar', revenue: 2400 },
      { name: 'Apr', revenue: 2200 },
      { name: 'May', revenue: 3100 },
      { name: 'Jun', revenue: 2800 },
      { name: 'Jul', revenue: 3200 },
      { name: 'Aug', revenue: 3700 },
      { name: 'Sep', revenue: 4100 },
      { name: 'Oct', revenue: 3500 },
      { name: 'Nov', revenue: 4500 },
      { name: 'Dec', revenue: 5000 },
    ];
  } else { // month
    return [
      { name: 'Week 1', revenue: 1000 },
      { name: 'Week 2', revenue: 1500 },
      { name: 'Week 3', revenue: 2500 },
      { name: 'Week 4', revenue: 2200 },
    ];
  }
}