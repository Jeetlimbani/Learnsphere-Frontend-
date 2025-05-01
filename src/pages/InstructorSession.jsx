// import React, { useState, useEffect } from 'react';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useNavigate } from 'react-router-dom';

// import {
//   addSession,
//   updateSession,
//   deleteSession
// } from '../services/courseService';

// const InstructorSession = ({ userData, currentCourse, onBackToCourses }) => {
//   const [sessions, setSessions] = useState([]);
//   const [addingSession, setAddingSession] = useState(false);
//   const [newSession, setNewSession] = useState({ title: '', videoLink: '', explanation: '' });
//   const [editingSession, setEditingSession] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   // Setting sessions when currentCourse changes
//   useEffect(() => {
//     if (currentCourse && currentCourse.sessions) {
//       setSessions(currentCourse.sessions);
//     } else {
//       setSessions([]);
//     }
//   }, [currentCourse]);

//   // Add session click handler
//   const handleAddSessionClick = () => {
//     setAddingSession(true);
//     setNewSession({ title: '', videoLink: '', explanation: '' });
//   };

//   // Handle input changes when adding a new session
//   const handleNewSessionChange = (e) => {
//     setNewSession({ ...newSession, [e.target.name]: e.target.value });
//   };

//   // Handle form submission to add a new session
//   const handleAddSessionSubmit = async (e) => {
//     e.preventDefault();
//     if (!currentCourse) {
//       toast.error('No course selected to add session to.');
//       return;
//     }

//     const { title, videoLink, explanation } = newSession;
//     if (!title || !videoLink || !explanation) {
//       toast.error('All session fields are required!');
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await addSession(currentCourse.id, newSession);
//       toast.success(`Session added successfully to "${currentCourse.id}"!`);
//       setSessions([...sessions, response.data]);
//       setAddingSession(false);
//       setNewSession({ title: '', videoLink: '', explanation: '' });
//     } catch (error) {
//       toast.error('Failed to add session.');
//       console.error('Add session error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Cancel adding a new session
//   const handleCancelAddSession = () => {
//     setAddingSession(false);
//     setNewSession({ title: '', videoLink: '', explanation: '' });
//   };

//   // Edit session click handler
//   const handleEditSessionClick = (session) => {
//     setEditingSession(session);
//   };

//   // Handle input changes when editing a session
//   const handleEditSessionChange = (e) => {
//     setEditingSession({ ...editingSession, [e.target.name]: e.target.value });
//   };

//   // Handle update of session
//   const handleUpdateSession = async () => {
//     if (!editingSession) return;

//     const { id, title, videoLink, explanation } = editingSession;
//     if (!title || !videoLink || !explanation) {
//       toast.error('All session fields are required for update!');
//       return;
//     }

//     try {
//       setLoading(true);
//       await updateSession(id, { title, videoLink, explanation });
//       toast.success('Session updated successfully!');
//       setSessions(sessions.map(s => (s.id === id ? { ...s, title, videoLink, explanation } : s)));
//       setEditingSession(null);
//     } catch (error) {
//       toast.error('Failed to update session.');
//       console.error('Update session error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle deleting a session
//   const handleDeleteSession = async (sessionId) => {
//     try {
//       setLoading(true);
//       await deleteSession(sessionId);
//       toast.success('Session deleted successfully!');
//       setSessions(sessions.filter(s => s.id !== sessionId));
//     } catch (error) {
//       toast.error('Failed to delete session.');
//       console.error('Delete session error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Cancel editing a session
//   const handleCancelEditSession = () => {
//     setEditingSession(null);
//   };

//   // No course selected message
//   if (!currentCourse) {
//     return (
//       <div className="p-6">
//         <h2 className="text-xl font-semibold mb-4">No Course Selected</h2>
//         <button onClick={onBackToCourses} className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
//           Back to Courses
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <ToastContainer />
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl font-bold">Sessions for "{currentCourse.title}"</h2>
//         <button onClick={onBackToCourses} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
//           Back to Courses
//         </button>
//       </div>

//       <div className="border p-4 mb-6 rounded-md shadow-sm">
//         <div className="flex justify-between items-center mb-2">
//           <h4 className="font-medium text-gray-700">Sessions ({sessions.length})</h4>
//           <button
//             onClick={handleAddSessionClick}
//             className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 01-2 0v-5H4a1 1 0 010-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
//             </svg>
//             Add Session
//           </button>
//         </div>

//         {sessions.length > 0 ? (
//           <div className="border rounded-md overflow-hidden">
//             {sessions.map((session, index) => (
//               <div key={session.id} className={`flex justify-between items-center p-3 ${index !== sessions.length - 1 ? "border-b" : ""}`}>
//                 <div className="flex items-center">
//                   <div className="bg-purple-100 p-1 rounded-full mr-3">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664zM5 4v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H6a1 1 0 00-1 1z" />
//                     </svg>
//                   </div>
//                   <div className="text-sm font-medium">{session.title}</div>
//                 </div>
//                 <div className="flex items-center space-x-3">
//                   <button onClick={() => handleEditSessionClick(session)} className="text-sm text-blue-600 hover:text-blue-800">
//                     Edit
//                   </button>
//                   <button onClick={() => handleDeleteSession(session.id)} className="text-sm text-red-600 hover:text-red-800">
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-500">No sessions available for this course.</p>
//         )}
//       </div>

//       {/* Add Session Modal */}
//       {addingSession && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-6 rounded-md w-full max-w-md">
//             <h3 className="text-xl font-semibold mb-4">Add New Session</h3>
//             <form onSubmit={handleAddSessionSubmit}>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700" htmlFor="title">Session Title</label>
//                 <input
//                   type="text"
//                   name="title"
//                   value={newSession.title}
//                   onChange={handleNewSessionChange}
//                   id="title"
//                   className="mt-1 block w-full px-3 py-2 border rounded-md text-sm"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700" htmlFor="videoLink">Video Link</label>
//                 <input
//                   type="text"
//                   name="videoLink"
//                   value={newSession.videoLink}
//                   onChange={handleNewSessionChange}
//                   id="videoLink"
//                   className="mt-1 block w-full px-3 py-2 border rounded-md text-sm"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700" htmlFor="explanation">Explanation</label>
//                 <textarea
//                   name="explanation"
//                   value={newSession.explanation}
//                   onChange={handleNewSessionChange}
//                   id="explanation"
//                   className="mt-1 block w-full px-3 py-2 border rounded-md text-sm"
//                 />
//               </div>
//               <div className="flex justify-between">
//                 <button
//                   type="button"
//                   onClick={handleCancelAddSession}
//                   className="text-sm text-gray-500"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className={`text-sm py-2 px-4 rounded-md ${loading ? 'bg-gray-500' : 'bg-blue-600 text-white'}`}
//                 >
//                   {loading ? 'Saving...' : 'Save Session'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Edit Session Modal */}
//       {editingSession && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-6 rounded-md w-full max-w-md">
//             <h3 className="text-xl font-semibold mb-4">Edit Session</h3>
//             <form onSubmit={handleUpdateSession}>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700" htmlFor="title">Session Title</label>
//                 <input
//                   type="text"
//                   name="title"
//                   value={editingSession.title}
//                   onChange={handleEditSessionChange}
//                   id="title"
//                   className="mt-1 block w-full px-3 py-2 border rounded-md text-sm"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700" htmlFor="videoLink">Video Link</label>
//                 <input
//                   type="text"
//                   name="videoLink"
//                   value={editingSession.videoLink}
//                   onChange={handleEditSessionChange}
//                   id="videoLink"
//                   className="mt-1 block w-full px-3 py-2 border rounded-md text-sm"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700" htmlFor="explanation">Explanation</label>
//                 <textarea
//                   name="explanation"
//                   value={editingSession.explanation}
//                   onChange={handleEditSessionChange}
//                   id="explanation"
//                   className="mt-1 block w-full px-3 py-2 border rounded-md text-sm"
//                 />
//               </div>
//               <div className="flex justify-between">
//                 <button
//                   type="button"
//                   onClick={handleCancelEditSession}
//                   className="text-sm text-gray-500"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className={`text-sm py-2 px-4 rounded-md ${loading ? 'bg-gray-500' : 'bg-blue-600 text-white'}`}
//                 >
//                   {loading ? 'Saving...' : 'Save Changes'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default InstructorSession;
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { addSession, updateSession, deleteSession } from '../services/courseService';

const InstructorSession = ({ userData, currentCourse, onBackToCourses }) => {
  const [sessions, setSessions] = useState([]);
  const [addingSession, setAddingSession] = useState(false);
  const [newSession, setNewSession] = useState({ title: '', videoLink: '', explanation: '' });
  const [editingSession, setEditingSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentCourse && currentCourse.sessions) {
      setSessions(currentCourse.sessions);
    } else {
      setSessions([]);
    }
  }, [currentCourse]);

  const extractVideoId = (link) => {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = link.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleAddSessionClick = () => {
    setAddingSession(true);
    setNewSession({ title: '', videoLink: '', explanation: '' });
  };

  const handleNewSessionChange = (e) => {
    setNewSession({ ...newSession, [e.target.name]: e.target.value });
  };

  const handleAddSessionSubmit = async (e) => {
    e.preventDefault();
    const { title, videoLink, explanation } = newSession;

    if (!title || !videoLink || !explanation) {
      toast.error('All session fields are required!');
      return;
    }

    try {
      setLoading(true);
      const response = await addSession(currentCourse.id, newSession);
      toast.success(`Session "${response.data.title}" added successfully to "${currentCourse.title}"!`);
      setSessions([...sessions, response.data]);
      setAddingSession(false);
    } catch (error) {
      console.error('Add session error:', error);
      toast.error('Failed to add session.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAddSession = () => {
    setAddingSession(false);
  };

  const handleEditSessionClick = (session) => {
    setEditingSession({ ...session });
  };

  const handleEditSessionChange = (e) => {
    setEditingSession({ ...editingSession, [e.target.name]: e.target.value });
  };

  const handleUpdateSession = async () => {
    const { id, title, videoLink, explanation } = editingSession;
    if (!title || !videoLink || !explanation) {
      toast.error('All fields are required for update!');
      return;
    }

    try {
      setLoading(true);
      await updateSession(id, { title, videoLink, explanation });
      setSessions(sessions.map((s) => (s.id === id ? { ...s, title, videoLink, explanation } : s)));
      toast.success('Session updated successfully!');
      setEditingSession(null);
    } catch (error) {
      console.error('Update session error:', error);
      toast.error('Failed to update session.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (id) => {
    try {
      setLoading(true);
      await deleteSession(id);
      setSessions(sessions.filter((s) => s.id !== id));
      toast.success('Session deleted successfully!');
    } catch (error) {
      console.error('Delete session error:', error);
      toast.error('Failed to delete session.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Sessions for "{currentCourse?.title}"</h2>
        <button
          onClick={onBackToCourses}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition duration-200"
        >
          Back to Courses
        </button>
      </div>

      <div className="mb-6">
        <button
          onClick={handleAddSessionClick}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition duration-200"
        >
          + Add Session
        </button>
      </div>

      {addingSession && (
        <form onSubmit={handleAddSessionSubmit} className="mb-6 p-4 border rounded-lg bg-white shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Add New Session</h3>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newSession.title}
            onChange={handleNewSessionChange}
            className="block mb-3 w-full p-2 border rounded focus:ring-2 focus:ring-purple-300 focus:outline-none"
          />
          <input
            type="text"
            name="videoLink"
            placeholder="YouTube Link"
            value={newSession.videoLink}
            onChange={handleNewSessionChange}
            className="block mb-3 w-full p-2 border rounded focus:ring-2 focus:ring-purple-300 focus:outline-none"
          />
          <textarea
            name="explanation"
            placeholder="Explanation"
            value={newSession.explanation}
            onChange={handleNewSessionChange}
            rows="4"
            className="block mb-4 w-full p-2 border rounded focus:ring-2 focus:ring-purple-300 focus:outline-none"
          />
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200 disabled:opacity-70"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={handleCancelAddSession}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      <div className="space-y-6">
        {sessions.map((session) => {
          const videoId = extractVideoId(session.videoLink);
          return (
            <div key={session.id} className="border rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition duration-200">
              {editingSession?.id === session.id ? (
                <>
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">Edit Session</h3>
                  <input
                    type="text"
                    name="title"
                    value={editingSession.title}
                    onChange={handleEditSessionChange}
                    className="block mb-3 w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
                  />
                  <input
                    type="text"
                    name="videoLink"
                    value={editingSession.videoLink}
                    onChange={handleEditSessionChange}
                    className="block mb-3 w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
                  />
                  <textarea
                    name="explanation"
                    value={editingSession.explanation}
                    onChange={handleEditSessionChange}
                    rows="4"
                    className="block mb-4 w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={handleUpdateSession}
                      disabled={loading}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 disabled:opacity-70"
                    >
                      {loading ? 'Updating...' : 'Update'}
                    </button>
                    <button
                      onClick={() => setEditingSession(null)}
                      className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-800">{session.title}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditSessionClick(session)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition duration-200 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSession(session.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-200 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    {videoId && (
                      <div className="relative pt-[56.25%] rounded-lg overflow-hidden mb-4 bg-black w-full max-w-2xl mx-auto">
                        <iframe
                          className="absolute top-0 left-0 w-full h-full"
                          src={`https://www.youtube.com/embed/${videoId}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={session.title}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-4 mb-3">
                    <button className="text-gray-600 hover:text-gray-900 flex items-center">
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Watch later
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 flex items-center">
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Share
                    </button>
                    <a
                      href={session.videoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900 flex items-center"
                    >
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Watch on YouTube
                    </a>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-line">{session.explanation}</p>
                  </div>
                </>
              )
              }
            </div >
          );
        })}
      </div > </div >
  );
};

export default InstructorSession;