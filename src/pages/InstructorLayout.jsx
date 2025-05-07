import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InstructorDashboard from './InstructorDashboard';
import InstructorSession from './InstructorSession';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InstructorLayout = ({ userData }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const navigate = useNavigate();
  const handleViewSessions = (course) => {
    setSelectedCourse(course);
    setActiveTab('sessions');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-purple-600 text-xl font-bold">LearnCraft</span>
            <span className="text-purple-800 text-xl font-bold">Instructor Hub</span>
          </div>
          <div className="flex items-center space-x-6">
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setSelectedCourse(null);
              }}
              className={`px-3 py-1 rounded ${activeTab === 'dashboard' ? 'bg-purple-100 text-purple-800' : 'text-gray-700'}`}
            >
              Courses
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              className={`px-3 py-1 rounded ${activeTab === 'sessions' ? 'bg-purple-100 text-purple-800' : 'text-gray-700'}`}
            >
              Sessions
            </button>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{userData.email}</span>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  navigate('/login');
                }}
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {activeTab === 'dashboard' ? (
          <InstructorDashboard
            userData={userData}
            onViewSessions={handleViewSessions}
          />
        ) : (
          selectedCourse ? (
            <InstructorSession
              userData={userData}
              currentCourse={selectedCourse}
              onBackToCourses={() => {
                setActiveTab('dashboard');
                setSelectedCourse(null);
              }}
            />
          ) : (
            <p className="text-gray-500">Please select a course to view sessions.</p>
          )
        )}
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default InstructorLayout;
