
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 p-6">
      <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-purple-100 max-w-md w-full">
        <h1 className="text-6xl font-bold text-purple-600 mb-2">404</h1>
        <div className="h-1 w-16 mx-auto bg-purple-500 rounded-full mb-6"></div>
        <p className="text-xl text-purple-800 mb-6">Oops! Page not found</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-medium rounded-lg transition-all duration-300"
        >
          Go Back
        </button>
      </div> 
    </div>
  );
};

export default NotFound;