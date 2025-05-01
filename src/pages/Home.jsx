import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-50 flex items-center justify-center px-6 py-10">
      <div className="relative bg-white shadow-2xl rounded-3xl p-10 w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden">

        {/* Decorative background blur circle */}
        <div className="absolute top-[-50px] right-[-50px] w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse"></div>

        {/* Left Side - Text */}
        <div className="text-center md:text-left md:w-1/2 z-10">
          <h1 className="text-5xl font-extrabold text-purple-700 mb-4 leading-tight">
            Welcome to <br /> Instructor Hub 👨‍🏫
          </h1>
          <p className="text-gray-600 mb-6 text-lg">
            Simplify your teaching life — manage classes, resources, and student interactions effortlessly.
          </p>

          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
            <button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition duration-300"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="border-2 border-purple-600 text-purple-600 hover:bg-purple-100 font-semibold py-2 px-6 rounded-xl transition duration-300"
            >
              Register
            </button>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="md:w-1/2 flex justify-center z-10 animate-fade-in-up">
          <img
            src="/profile.png"
            alt="Instructor Illustration"
            className="w-64 h-64 object-cover rounded-full border-4 border-purple-300 shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;


