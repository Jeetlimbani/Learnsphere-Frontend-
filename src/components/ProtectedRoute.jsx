import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;


// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import Cookies from 'js-cookie';
// const ProtectedRoute = ({ children }) => {
//   const token = Cookies.get('authToken');
//   console.log("token",token)
//   return token ? children : <Navigate to="/login" />;
// };

// export default ProtectedRoute;