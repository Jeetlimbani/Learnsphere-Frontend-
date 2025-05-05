// import React, { useState } from 'react';
// import { login } from '../services/authService';
// import { useNavigate } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const Login = () => {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const response = await login(formData);
//       console.log("Login response:", response);

//       if (response.data && response.data.token) {
//         localStorage.setItem('token', response.data.token);
//         toast.success('Login successful!');
//         navigate('/dashboard');
//       } else {
//         toast.error('Login successful, but no token received.');
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || 'Login failed! Please check your credentials.';
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center px-4">
//       <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
//         <h2 className="text-2xl font-bold text-purple-700 mb-1">Welcome Back 👋</h2>
//         <p className="text-gray-600 mb-6">Login to access your Instructor Hub</p>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Email</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
//               placeholder="Enter your email"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Password</label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
//               placeholder="••••••••"
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition duration-200"
//             disabled={loading}
//           >
//             {loading ? 'Logging in...' : 'Login'}
//           </button>
//         </form>

//         <div className="mt-4 text-center text-sm text-gray-500">
//           Don’t have an account? <a href="/register" className="text-purple-600 font-medium hover:underline">Sign up</a>
//         </div>
//       </div>

//       <ToastContainer />
//     </div>
//   );
// };

// export default Login;
import React, { useState, useEffect } from 'react';
import { login, googleLogin, completeGoogleSignup } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [googleUser, setGoogleUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login(formData);
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', response.data.role);
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        toast.error('Login successful, but no token received.');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed! Please check your credentials.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      toast.error('Google authentication failed. Missing credential.');
      return;
    }
    
    try {
      setLoading(true);
      const response = await googleLogin(credentialResponse.credential);
      
      if (response.data?.isNewUser) {
        setGoogleUser(response.data.googleUser);
        setShowRoleSelection(true);
        return; // Prevent further execution for new users
      }

      // If it's not a new user, proceed with login
      if (response.data?.token && response.data?.role) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', response.data.role);
        toast.success('Google login successful!');
        navigate('/dashboard');
      } else {
        toast.error('Unexpected response during Google login.');
      }
    } catch (error) {
      console.error('Google login error:', error);
      const errorMessage = error.response?.data?.message || 'Google login failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleFailure = () => {
    toast.error('Google login failed. Please try again later.');
  };
  
  const handleRoleSelection = async () => {
    if (!selectedRole) {
      toast.error('Please select a role to continue');
      return;
    }

    try {
      setLoading(true);
      const response = await completeGoogleSignup(googleUser, selectedRole);

      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', selectedRole);
        toast.success('Account created successfully!');
        navigate('/dashboard');
      } else {
        toast.error('Account creation failed.');
      }
    } catch (error) {
      console.error('Role selection error:', error);
      const errorMessage = error.response?.data?.message || 'Account creation failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  if (showRoleSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center px-4">
        <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-purple-700 mb-1">Welcome to LearnHub!</h2>
          <p className="text-gray-600 mb-6">Please select your role to continue</p>

          <div className="space-y-5">
            <div className="flex flex-col space-y-3">
              <div 
                className={`p-4 border rounded-lg cursor-pointer ${selectedRole === 'student' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}
                onClick={() => setSelectedRole('student')}
              >
                <div className="font-medium text-lg">Student</div>
                <div className="text-gray-500 text-sm">Take courses and learn new skills</div>
              </div>
              
              <div 
                className={`p-4 border rounded-lg cursor-pointer ${selectedRole === 'instructor' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}
                onClick={() => setSelectedRole('instructor')}
              >
                <div className="font-medium text-lg">Instructor</div>
                <div className="text-gray-500 text-sm">Create courses and teach others</div>
              </div>
            </div>

            <button
              onClick={handleRoleSelection}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition duration-200"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Continue'}
            </button>
            
            <button
              onClick={() => setShowRoleSelection(false)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-lg transition duration-200"
            >
              Go Back
            </button>
          </div>
        </div>
        
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-purple-700 mb-1">Welcome Back 👋</h2>
        <p className="text-gray-600 mb-6">Login to access your Learning Hub</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition duration-200"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="my-5 flex items-center justify-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <p className="mx-4 text-gray-500">OR</p>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
            text="signin_with"
            shape="rectangular"
            logo_alignment="center"
            width="300"
          />
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          Don't have an account? <a href="/register" className="text-purple-600 font-medium hover:underline">Sign up</a>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;