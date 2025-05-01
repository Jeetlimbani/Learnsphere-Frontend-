import React, { useState, useEffect } from 'react';
import { fetchUserData } from '../services/authService';
// Import the InstructorDashboard component
     // Import the StudentDashboard component
import { useNavigate } from 'react-router-dom';
import StudentLayout from './StudentLayout';
import InstructorLayout from './InstructorLayout';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await fetchUserData();
        setUserData(user);
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Handle error appropriately, e.g., redirect to login
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
        <div className="bg-white p-6 rounded shadow-md text-center">
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded shadow-md text-center">
          <p>Failed to load user data. Please log in again.</p>
        </div>
      </div>
    );
  }

  // Render the appropriate dashboard based on the user's role
  if (userData.role === 'instructor') {
    return <InstructorLayout userData={userData} />;
  } else if (userData.role === 'student') {
    return <StudentLayout userData={userData} />;
  } else {
    // Handle the case where the user has an unexpected role
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h2>
          <p>
            Welcome, {userData.email}!
          </p>
          <p>
            Your role ({userData.role}) is not recognized. Please contact
            support.
          </p>
        </div>
      </div>
    );
  }
};

export default Dashboard;
