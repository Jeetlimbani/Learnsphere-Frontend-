import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AvailableCourses from './AvailableCourses';
import StudentEnrollment from './StudentEnrollment';
import SessionCompletion from './SessionCompletion';

import { getEnrolledCourses } from '../services/studentAPI';
import axios from 'axios';

const StudentLayout = ({ userData }) => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('available'); // 'available', 'enrolled', 'sessionCompletion'
  const [loading, setLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [dashboardData, setDashboardData] = useState([]);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {  
    if (!userData?.id) return;

    try {
      const response = await axios.get(`http://localhost:4000/api/dashboard/student/${userData.id}`, {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      });

      if (response.data && Array.isArray(response.data)) {
        setDashboardData(response.data);
      } else {
        console.error('Invalid dashboard data format:', response.data);
        setDashboardData([]);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to fetch dashboard data');
      setDashboardData([]);
    }
  };

  // Fetch enrolled courses
  const fetchEnrolledCourses = async () => {
    if (!userData?.id) return;
    try {
      setLoading(true);
      const courses = await getEnrolledCourses(userData.id);
      setEnrolledCourses(courses || []);
    } catch (err) {
      console.error("Failed to fetch enrolled courses:", err);
      toast.error("Couldn't load your enrolled courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrolledCourses();
    fetchDashboardData();
  }, [userData?.id]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logout successful!');
    navigate('/login');
  };

  const handleEnrollSuccess = async () => {
    await fetchEnrolledCourses();
    setActiveTab('enrolled');
    toast.info('Showing your enrolled courses');
  };

  const handleSessionNavigate = (courseId, sessionId) => {
    setSelectedSession({ courseId, sessionId });
    setActiveTab('sessionCompletion');
  };

  const handleBackToEnrolled = () => {
    setActiveTab('enrolled');
    setSelectedSession(null);
  };

  const handleSessionCompleted = async () => {
    // Refresh dashboard data to update completion status
    await fetchDashboardData();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-800">LearnCraft Student Hub</h1>
          <p className="text-purple-600 mt-2">
            Welcome back, {userData?.email?.split('@')[0] || 'Student'}!
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="bg-white p-4 rounded-lg shadow-sm w-full sm:w-48 border border-purple-100">
              <p className="text-purple-600 text-sm font-medium">Your Courses</p>
              <p className="text-2xl font-bold text-purple-800">
                {loading ? '...' : enrolledCourses.length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm w-full sm:w-48 border border-purple-100">
              <p className="text-purple-600 text-sm font-medium">Total Sessions</p>
              <p className="text-2xl font-bold text-purple-800">
                {loading ? '...' : enrolledCourses.reduce((sum, course) => sum + (course.sessionCount || 0), 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-6 space-x-4">
          <button
            data-tab="available"
            className={`py-2 px-4 font-medium text-sm focus:outline-none ${
              activeTab === 'available'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-purple-500'
            }`}
            onClick={() => setActiveTab('available')}
          >
            Available Courses
          </button>
          <button
            data-tab="enrolled"
            className={`py-2 px-4 font-medium text-sm focus:outline-none ${
              activeTab === 'enrolled'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-purple-500'
            }`}
            onClick={() => setActiveTab('enrolled')}
          >
            My Enrolled Courses {enrolledCourses.length > 0 && `(${enrolledCourses.length})`}
          </button>
          {selectedSession && (
            <button
              data-tab="sessionCompletion"
              className={`py-2 px-4 font-medium text-sm focus:outline-none ${
                activeTab === 'sessionCompletion'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-purple-500'
              }`}
              onClick={() => setActiveTab('sessionCompletion')}
            >
              Session Review
            </button>
          )}
        </div>

        {/* Content based on active tab */}
        {activeTab === 'available' && (
          <AvailableCourses
            userData={userData}
            enrolledCourses={enrolledCourses}
            onEnrollSuccess={handleEnrollSuccess}
          />
        )}
        {activeTab === 'enrolled' && (
          <StudentEnrollment
            userData={userData}
            onSessionNavigate={handleSessionNavigate}
            dashboardData={dashboardData}
            onDashboardUpdate={fetchDashboardData}
          />
        )}
        {activeTab === 'sessionCompletion' && selectedSession && (
          <SessionCompletion
            userData={userData}
            selectedSession={selectedSession}
            onGoBack={handleBackToEnrolled}
            onSessionCompleted={handleSessionCompleted}
          />
        )}

        {/* Logout */}
        <div className="mt-8 text-right">
          <button
            className="text-purple-600 hover:text-purple-800 text-sm font-medium"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default StudentLayout;
