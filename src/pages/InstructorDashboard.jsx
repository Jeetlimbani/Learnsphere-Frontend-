// InstructorDashboard.js
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  fetchCoursesByInstructor,
  addCourse,
  updateCourse,
  deleteCourse,
} from '../services/courseService';

const InstructorDashboard = ({ userData, onViewSessions }) => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ title: '', description: '', category: '' });
  const [editingCourse, setEditingCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const response = await fetchCoursesByInstructor(userData.id);
      setCourses(response.data);
      toast.success('Courses fetched successfully!');
    } catch (error) {
      toast.error('Failed to fetch courses.');
      console.error('Error fetching courses:', error);
    }
  };

  // UseEffect to load courses on initial render
  useEffect(() => {
    fetchCourses();
  }, []);

  // Handle input change for new course
  const handleNewCourseChange = (e) => {
    setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
  };

  // Add new course
  const handleAddCourse = async (e) => {
    e.preventDefault();
    const { title, description, category } = newCourse;

    if (!title || !description || !category) {
      toast.error('All fields are required!');
      return;
    }

    try {
      setLoading(true);
      const response = await addCourse(newCourse);
      toast.success('Course added successfully! Now you can add sessions to it.');
      setCourses((prevCourses) => [...prevCourses, response.data]);
      setNewCourse({ title: '', description: '', category: '' });
    } catch (error) {
      toast.error('Failed to add course.');
      console.error('Add course error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Edit course
  const handleEditCourse = async () => {
    const { title, description, category } = editingCourse;

    if (!title || !description || !category) {
      toast.error('All fields are required for update!');
      return;
    }

    try {
      setLoading(true);
      const response = await updateCourse(editingCourse.id, editingCourse);
      toast.success('Course updated successfully!');
      setCourses((prevCourses) =>
        prevCourses.map((course) => (course.id === editingCourse.id ? response.data : course))
      );
      setEditingCourse(null);
    } catch (error) {
      toast.error('Failed to update course.');
      console.error('Edit course error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete course
  const handleDeleteCourse = async (courseId) => {
    try {
      setLoading(true);
      await deleteCourse(courseId);
      toast.success('Course deleted successfully!');
      setCourses((prevCourses) => prevCourses.filter((course) => course.id !== courseId));
    } catch (error) {
      toast.error('Failed to delete course.');
      console.error('Delete course error:', error);
    } finally {
      setLoading(false);
    }
  };

   // Handle search input change
   const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter courses based on search term
  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  // Calculate total sessions
  const totalSessions = courses.reduce((acc, course) => acc + (course.sessions?.length || 0), 0);

  return (
    <>
      <div className="container mx-auto p-6">
        <div className="bg-purple-50 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-purple-800 mb-2">Welcome back, {userData.email.split('@')[0]}!</h1>
              <p className="text-gray-600">Manage your courses and create engaging learning experiences for your students.</p>
            </div>
            <button onClick={fetchCourses} className="flex items-center text-purple-600 hover:text-purple-800">
              Refresh
            </button>
          </div>

          <div className="flex mt-6 space-x-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">📚</div>
              <div>
                <p className="text-sm text-gray-500">Your Courses</p>
                <p className="text-xl font-semibold">{courses.length}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">🎥</div>
              <div>
                <p className="text-sm text-gray-500">Total Sessions</p>
                <p className="text-xl font-semibold">{totalSessions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Course Section */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Add New Course</h2>
              <form onSubmit={handleAddCourse}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Course Title</label>
                  <input
                    type="text"
                    name="title"
                    value={newCourse.title}
                    onChange={handleNewCourseChange}
                    className="w-full border rounded px-3 py-2"
                    placeholder="e.g. Advanced JavaScript"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    name="description"
                    value={newCourse.description}
                    onChange={handleNewCourseChange}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Brief course description..."
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={newCourse.category}
                    onChange={handleNewCourseChange}
                    className="w-full border rounded px-3 py-2"
                    placeholder="e.g. Web Development"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add Course'}
                </button>
              </form>
            </div>
          </div>

                  {/* Courses List */}
                  <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Your Courses</h2>
                
                {/* Search Input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="border rounded-lg pl-8 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {filteredCourses.length === 0 ? (
                <p className="text-gray-500">
                  {searchTerm ? 'No courses match your search.' : 'No courses added yet.'}
                </p>
              ) : (
                <ul>
                  {filteredCourses.map((course) => (
                    <li key={course.id} className="border-b py-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{course.title}</p>
                        <p className="text-sm text-gray-600">{course.description}</p>
                        <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded mt-1">
                          {course.category}
                        </span>
                      </div>
                      <div className="space-x-2">
                        <button
                          className="text-blue-600"
                          onClick={() => setEditingCourse(course)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600"
                          onClick={() => handleDeleteCourse(course.id)}
                        >
                          Delete
                        </button>
                        <button
                          className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                          onClick={() => onViewSessions(course)}
                        >
                          View Sessions
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {/* Edit Course */}
              {editingCourse && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Edit Course</h3>
                  <input
                    type="text"
                    name="title"
                    value={editingCourse.title}
                    onChange={(e) =>
                      setEditingCourse({ ...editingCourse, title: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2 mb-2"
                  />
                  <textarea
                    name="description"
                    value={editingCourse.description}
                    onChange={(e) =>
                      setEditingCourse({ ...editingCourse, description: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2 mb-2"
                  />
                  <input
                    type="text"
                    name="category"
                    value={editingCourse.category}
                    onChange={(e) =>
                      setEditingCourse({ ...editingCourse, category: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2 mb-2"
                  />
                  <button
                    onClick={handleEditCourse}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mr-2"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditingCourse(null)}
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="bottom-right" />
    </>
  );
};

export default InstructorDashboard;