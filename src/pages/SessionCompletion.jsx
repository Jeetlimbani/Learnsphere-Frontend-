import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const SessionCompletion = ({ userData }) => {
  const { courseId, sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completingSession, setCompletingSession] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Validate parameters
        if (!courseId || !sessionId || !userData?.studentId) {
          throw new Error('Missing required parameters');
        }

        setLoading(true);
        setError(null);

        // Fetch course and sessions in parallel
        const [courseResponse, sessionsResponse] = await Promise.all([
          axios.get(`/api/courses/${courseId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get(`/api/courses/${courseId}/sessions`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
        ]);

        // Validate responses
        if (!courseResponse.data || !sessionsResponse.data) {
          throw new Error('Invalid server response');
        }

        // Find the specific session
        const foundSession = sessionsResponse.data.find(s => 
          s.id === parseInt(sessionId)
        );

        if (!foundSession) {
          throw new Error('Session not found in this course');
        }

        setCourse(courseResponse.data);
        setSession(foundSession);
        
      } catch (err) {
        console.error('Session load error:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load session');
        toast.error('Failed to load session details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, sessionId, userData?.studentId]);

  // ... rest of your component ...

  if (error) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center">
        <div className="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Unable to Load Session</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Go Back
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!session || !course) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Session not found</h3>
        <p className="text-gray-600 mb-6">The requested session could not be found in this course.</p>
        <button
          onClick={() => navigate(`/course/${courseId}`)}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          Return to Course
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(`/course/${courseId}`)}
          className="flex items-center text-purple-600 hover:text-purple-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Course
        </button>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{course.title}</h1>
        <h2 className="text-xl font-semibold text-purple-700">{session.title}</h2>
      </div>
      
      <div className="mb-8 rounded-lg overflow-hidden shadow-md bg-gray-50">
        {session.videoLink ? (
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src={getYouTubeEmbedURL(session.videoLink)}
              className="w-full h-96"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={`${course.title} - ${session.title}`}
            />
          </div>
        ) : (
          <div className="p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="mt-4 text-gray-500">No video content available for this session</p>
          </div>
        )}
      </div>
      
      {session.explanation && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Session Explanation</h3>
          <div className="prose max-w-none text-gray-700">
            {session.explanation.split('\n').map((paragraph, i) => (
              <p key={i} className="mb-4 last:mb-0">{paragraph}</p>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex justify-end mt-8">
        <button
          onClick={markSessionAsCompleted}
          disabled={completingSession}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
        >
          {completingSession ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Mark as Completed
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SessionCompletion;