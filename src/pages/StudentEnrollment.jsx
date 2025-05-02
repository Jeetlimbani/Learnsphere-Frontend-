import React, { useState, useEffect } from 'react';
import { getEnrolledCourses, getSessions } from '../services/studentAPI';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const StudentEnrollment = ({ userData, onSessionNavigate, dashboardData, onDashboardUpdate }) => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCourse, setExpandedCourse] = useState(null);

  const fetchEnrolledCoursesWithSessions = async () => {
    if (!userData?.id) return;

    try {
      setLoading(true);
      const enrolledCoursesData = await getEnrolledCourses(userData.id);

      if (enrolledCoursesData && enrolledCoursesData.length > 0) {
        const enrichedCourses = await Promise.all(
          enrolledCoursesData.map(async (course) => {
            try {
              const sessions = await getSessions(course.id);
              return {
                ...course,
                sessionCount: sessions?.length || 0,
                sessions: sessions || []
              };
            } catch (error) {
              console.error(`Error fetching sessions for course ${course.id}:`, error);
              return { ...course, sessionCount: 0, sessions: [] };
            }
          })
        );
        setEnrolledCourses(enrichedCourses);
      } else {
        setEnrolledCourses([]);
      }
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      toast.error('Failed to fetch enrolled courses.');
      setEnrolledCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrolledCoursesWithSessions();
  }, [userData, dashboardData]); // Added dashboardData dependency to refresh when sessions are completed

  const toggleCourseExpansion = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  const getYouTubeEmbedURL = (url) => {
    if (!url) return '';
    const videoIdMatch = url.match(/(?:v=|youtu\.be\/|\/embed\/|\/v\/|watch\?v=|&v=)([0-9A-Za-z_-]{11})/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : ''; // Fixed to use https
  };

  const handleSessionClick = (courseId, sessionId) => {
    if (onSessionNavigate) {
      onSessionNavigate(courseId, sessionId);
    }
  };

  const isSessionCompleted = (courseId, sessionId) => {
    if (!dashboardData || !Array.isArray(dashboardData)) {
      return false;
    }

    const courseData = dashboardData.find(item => item.courseId === courseId);
    if (!courseData || !courseData.completedSessions) {
      return false;
    }

    // Make sure we're comparing numbers with numbers
    const sessionIdNum = parseInt(sessionId, 10);
    return courseData.completedSessions.some(id => parseInt(id, 10) === sessionIdNum);
  };

  const getProgressForCourse = (courseId) => {
    if (!dashboardData || !Array.isArray(dashboardData)) {
      return '0/0';
    }

    const courseData = dashboardData.find(item => item.courseId === courseId);
    if (!courseData) {
      return '0/0';
    }

    const completedCount = courseData.completedSessions?.length || 0;
    const totalCount = courseData.totalSessions || 0;

    return `${completedCount}/${totalCount}`;
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-purple-800">Your Enrolled Courses</h2>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-pulse text-purple-600">Loading enrolled courses...</div>
        </div>
      ) : enrolledCourses.length === 0 ? (
        <div className="bg-purple-50 p-6 rounded-lg text-center">
          <p className="text-gray-600">You have not enrolled in any courses yet.</p>
          <button
            onClick={() => document.querySelector('button[data-tab="available"]')?.click()}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Browse Available Courses
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {enrolledCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white p-4 rounded-lg shadow-sm border border-purple-50 hover:border-purple-100 transition-colors"
            >
              <h3 className="font-bold text-lg mb-2 text-purple-800">{course.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{course.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                  {course.category}
                </span>
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  {course.sessionCount} {course.sessionCount === 1 ? 'Session' : 'Sessions'}
                </span>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  Progress: {getProgressForCourse(course.id)}
                </span>
              </div>

              {course.imageUrl && (
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-3">
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {expandedCourse === course.id && course.sessions && course.sessions.length > 0 ? (
                <div className="mt-4 space-y-3">
                  <h4 className="font-medium text-purple-700">Course Sessions</h4>
                  {course.sessions.map((session, index) => {
                    const completed = isSessionCompleted(course.id, session.id);
                    return (
                      <div key={session.id || index} className="border border-purple-100 p-3 rounded-md">
                        <div className="flex justify-between items-start">
                          <p className="font-medium text-purple-700">
                            Session {index + 1}: {session.title}
                            {completed && (
                              <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                                Completed
                              </span>
                            )}
                          </p>
                          <button
                            onClick={() => handleSessionClick(course.id, session.id)}
                            className={`px-3 py-1 rounded text-sm font-medium ${
                              completed
                                ? 'bg-green-100 text-green-800 hover:bg-green-200 cursor-not-allowed'
                                : 'bg-purple-600 text-white hover:bg-purple-700'
                            }`}
                            disabled={completed}
                          >
                            {completed ? 'Completed' : 'View Session'}
                          </button>
                        </div>

                        {session.description && (
                          <p className="text-gray-600 text-sm mt-1">{session.description}</p>
                        )}

                        {session.videoLink && (
                          <div className="mt-2">
                            <iframe
                              src={getYouTubeEmbedURL(session.videoLink)}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              title={`${course.title} - Session ${index + 1}`}
                              className="w-full h-40 rounded-lg"
                            ></iframe>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                course.sessions && course.sessions.length > 0 && course.sessions[0].videoLink && (
                  <div className="mt-4">
                    <iframe
                      src={getYouTubeEmbedURL(course.sessions[0].videoLink)}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={`${course.title} - Session 1`}
                      className="w-full h-40 rounded-lg"
                    ></iframe>
                  </div>
                )
              )}

              <div className="mt-4 flex justify-between items-center">
                <p className="text-gray-600 text-sm">
                  {course.sessionCount} {course.sessionCount === 1 ? 'Session' : 'Sessions'} available
                </p>
                {course.sessions && course.sessions.length > 0 && (
                  <button
                    onClick={() => toggleCourseExpansion(course.id)}
                    className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                  >
                    {expandedCourse === course.id ? 'Show Less' : 'View All Sessions'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentEnrollment;