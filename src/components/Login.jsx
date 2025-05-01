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
  
//       // Assuming your backend sends the token in the response data (e.g., response.data.token)
//       if (response.data && response.data.token) {
//         localStorage.setItem('token', response.data.token); // You might want to remove this if you're solely relying on cookies
//         toast.success('Login successful!');
//         console.log('Navigating to /dashboard...');
//         navigate('/dashboard');
//       } else {
//         toast.error('Login successful, but no token received.');
//         console.error('No token received in login response:', response.data);
//         // Optionally, don't navigate if there's no token
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || 'Login failed! Please check your credentials.';
//       console.error('Login error:', error.message || error);
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
//         <h2 className="text-xl font-bold mb-4">Login</h2>
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={handleChange}
//           className="border p-2 w-full mb-4"
//           required
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleChange}
//           autoComplete="current-password"
//           className="border p-2 w-full mb-4"
//           required
//         />
//         <button
//           type="submit"
//           className={`bg-blue-500 text-white px-4 py-2 rounded w-full ${
//             loading ? 'opacity-50 cursor-not-allowed' : ''
//           }`}
//           disabled={loading}
//         >
//           {loading ? 'Logging in...' : 'Login'}
//         </button>
//       </form>
//       <ToastContainer />
//     </div>
//   );
// };

// export default Login;


import React, { useState } from 'react';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login(formData);
      console.log("Login response:", response);

      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        toast.error('Login successful, but no token received.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed! Please check your credentials.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-purple-700 mb-1">Welcome Back 👋</h2>
        <p className="text-gray-600 mb-6">Login to access your Instructor Hub</p>

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

        <div className="mt-4 text-center text-sm text-gray-500">
          Don’t have an account? <a href="/register" className="text-purple-600 font-medium hover:underline">Sign up</a>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;
