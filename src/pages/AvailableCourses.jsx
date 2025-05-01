import React, { useState, useEffect } from 'react';
import { enrollInCourse, getPublishedCourses } from '../services/studentAPI';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AvailableCourses = ({ userData, enrolledCourses, onEnrollSuccess }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollingCourseId, setEnrollingCourseId] = useState(null);

  const fetchCourses = async () => {
    if (!userData?.id) return;
    
    try {
      setLoading(true);
      const response = await getPublishedCourses();
      setCourses(response || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to fetch available courses.');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [userData]);

  const isAlreadyEnrolled = (courseId) => {
    return enrolledCourses.some(course => course.id === courseId);
  };

  const handleEnroll = async (courseId) => {
    if (!userData?.id) {
      toast.error('Please log in to enroll in courses.');
      return;
    }

    // Check if already enrolled to prevent duplicate enrollments
    if (isAlreadyEnrolled(courseId)) {
      toast.info('You are already enrolled in this course.');
      return;
    }

    // Disable the button immediately
    setEnrollingCourseId(courseId);

    try {
      await enrollInCourse(courseId, userData.id);
      toast.success('Successfully enrolled in course!');
      
      // Notify parent to refresh enrolled courses
      if (typeof onEnrollSuccess === 'function') {
        await onEnrollSuccess();
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast.error('Failed to enroll in course. Please try again.');
    } finally {
      // Re-enable the button regardless of success or failure
      setEnrollingCourseId(null);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4 text-purple-800">Available Courses</h2>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-pulse text-purple-600">Loading courses...</div>
        </div>
      ) : courses.length === 0 ? (
        <p className="text-gray-600 bg-purple-50 p-6 rounded-lg text-center">
          No courses available at the moment. Please check back later.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => {
            const alreadyEnrolled = isAlreadyEnrolled(course.id);
            const isEnrolling = enrollingCourseId === course.id;
            
            return (
              <div
                key={course.id}
                className="bg-white p-4 rounded-lg shadow-sm border border-purple-50 hover:border-purple-100 transition-colors"
              >
                <h3 className="font-bold text-lg mb-2 text-purple-800">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3">{course.description}</p>
                <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full mb-3">
                  {course.category}
                </span>
                {course.imageUrl && (
                  <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-3">
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {course.imageDescription && (
                  <p className="text-gray-500 text-xs italic mb-2">
                    {course.imageDescription}
                  </p>
                )}
                
                <button
                  className={`w-full py-2 rounded-md text-sm font-medium transition-colors ${
                    alreadyEnrolled
                      ? 'bg-green-100 text-green-700 cursor-not-allowed'
                      : isEnrolling
                      ? 'bg-purple-300 text-purple-500 cursor-not-allowed'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                  onClick={() => !alreadyEnrolled && !isEnrolling && handleEnroll(course.id)}
                  disabled={alreadyEnrolled || isEnrolling}
                >
                  {alreadyEnrolled 
                    ? 'Already Enrolled' 
                    : isEnrolling 
                    ? 'Enrolling...' 
                    : 'Enroll Now'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AvailableCourses;