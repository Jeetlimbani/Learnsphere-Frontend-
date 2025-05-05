import React, { useState, useEffect } from 'react';
import { fetchUserData, getUserRole } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import StudentLayout from './StudentLayout';
import InstructorLayout from './InstructorLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const data = await fetchUserData();
        
        // Check if we have user data in the right format
        if (data && (data.user || data)) {
          // Handle both possible response formats
          const user = data.user || data;
          
          // If role isn't in the API response, use the one from localStorage
          if (!user.role) {
            user.role = getUserRole();
          }
          
          setUserData(user);
        } else {
          console.error('Invalid user data format:', data);
          toast.error('Error loading user data. Please log in again.');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Session expired. Please log in again.');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-red-500 mb-4">Failed to load user data</p>
          <button 
            onClick={() => navigate('/login')} 
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            Return to Login
          </button>
        </div>
        <ToastContainer />
      </div>
    );
  }

  // Get role either from user data or localStorage as fallback
  const userRole = userData.role || getUserRole();

  // Render the appropriate dashboard based on the user's role
  if (userRole === 'instructor') {
    return (
      <>
        <InstructorLayout userData={userData} />
        <ToastContainer />
      </>
    );
  } else if (userRole === 'student') {
    return (
      <>
        <StudentLayout userData={userData} />
        <ToastContainer />
      </>
    );
  } else {
    // Handle the case where the user has an unexpected role
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4 text-purple-700">Welcome to Your Dashboard</h2>
          <p className="mb-2">
            Welcome, {userData.email || userData.name || 'User'}!
          </p>
          <p className="text-red-500 mb-4">
            Your role ({userRole || 'undefined'}) is not recognized. Please contact
            support.
          </p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => navigate('/login')} 
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              Return to Login
            </button>
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  }
};

export default Dashboard;
