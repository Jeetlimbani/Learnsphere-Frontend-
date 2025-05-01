// import React, { useState } from 'react';
// import { register } from '../services/authService'; // Import the register function
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useNavigate } from 'react-router-dom';

// const Register = () => {
//   const [formData, setFormData] = useState({ email: '', password: '', role: '' });
//   const [loading, setLoading] = useState(false); // Add loading state
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true); // Start loading state
//     try {
//       const response = await register(formData); // Call the register function
//       toast.success(response.data.message || 'Registration successful!'); // Success message
//       navigate('/login'); // Redirect to login page
//       setFormData({ email: '', password: '', role: '' }); // Reset form fields
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || 'Registration failed! Please try again.';
//       console.error('Registration error:', error.message || error); // Log error for debugging
//       toast.error(errorMessage); // Display error message
//     } finally {
//       setLoading(false); // Stop loading state
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
//         <h2 className="text-xl font-bold mb-4">Register</h2>
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
//           className="border p-2 w-full mb-4"
//           required
//         />
//         <select
//           name="role"
//           value={formData.role}
//           onChange={handleChange}
//           className="border p-2 w-full mb-4"
//           required
//         >
//           <option value="">Select Role</option>
//           <option value="student">Student</option>
//           <option value="instructor">Instructor</option>
//         </select>
//         <button
//           type="submit"
//           className={`bg-blue-500 text-white px-4 py-2 rounded w-full ${
//             loading ? 'opacity-50 cursor-not-allowed' : ''
//           }`}
//           disabled={loading}
//         >
//           {loading ? 'Registering...' : 'Register'}
//         </button>
//       </form>
//       <ToastContainer />
//     </div>
//   );
// };

// export default Register;

import React, { useState } from 'react';
import { register } from '../services/authService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ email: '', password: '', role: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await register(formData);
      toast.success(response.data.message || 'Registration successful!');
      navigate('/login');
      setFormData({ email: '', password: '', role: '' });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed! Please try again.';
      console.error('Registration error:', error.message || error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-purple-700 mb-1">Join Us 🚀</h2>
        <p className="text-gray-600 mb-6">Register to create your Instructor Hub account</p>

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

          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition duration-200"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          Already have an account? <a href="/login" className="text-purple-600 font-medium hover:underline">Login</a>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Register;
