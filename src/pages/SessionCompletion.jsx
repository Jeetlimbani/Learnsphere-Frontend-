import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const SessionCompletion = ({ userData, selectedSession, onGoBack, onSessionCompleted }) => {
  const [session, setSession] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const fetchSessionData = async () => {
      if (!selectedSession || !selectedSession.courseId || !selectedSession.sessionId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch session data
        const sessionResponse = await axios.get(
          `http://localhost:4000/api/dashboard/courses/${selectedSession.courseId}/sessions/${selectedSession.sessionId}`,
          {
            headers: {
              'Authorization': localStorage.getItem('token')
            }
          }
        );
        
        // Fetch course data to display the course title
        const courseResponse = await axios.get(
          `http://localhost:4000/api/courses/${selectedSession.courseId}`,
          {
            headers: {
              'Authorization': localStorage.getItem('token')
            }
          }
        );

        // Check if session is already completed
        const dashboardResponse = await axios.get(
          `http://localhost:4000/api/dashboard/student/${userData.id}`,
          {
            headers: {
              'Authorization': localStorage.getItem('token')
            }
          }
        );

        const courseData = dashboardResponse.data.find(item => 
          item.courseId === parseInt(selectedSession.courseId)
        );
        
        const sessionCompleted = courseData?.completedSessions?.includes(
          parseInt(selectedSession.sessionId)
        );

        setSession(sessionResponse.data);
        setCourse(courseResponse.data);
        setIsCompleted(sessionCompleted || false);
      } catch (error) {
        console.error('Error fetching session data:', error);
        toast.error('Failed to load session data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
  }, [selectedSession, userData]);

  const getYouTubeEmbedURL = (url) => {
    if (!url) return '';
    const videoIdMatch = url.match(/(?:v=|youtu\.be\/|\/embed\/|\/v\/|watch\?v=|&v=)([0-9A-Za-z_-]{11})/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  };

  const handleCompleteSession = async () => {
    if (!userData?.id || !selectedSession) return;

    setCompleting(true);
    try {
      const response = await axios.post(
        `http://localhost:4000/api/dashboard/student/${userData.id}/courses/${selectedSession.courseId}/sessions/${selectedSession.sessionId}/complete`,
        {},
        {
          headers: {
            'Authorization': localStorage.getItem('token')
          }
        }
      );

      setIsCompleted(true);
      toast.success('Session marked as completed!');
      
      // Notify parent component to refresh dashboard data
      if (onSessionCompleted) {
        onSessionCompleted();
      }
    } catch (error) {
      console.error('Error completing session:', error);
      toast.error('Failed to mark session as completed. Please try again.');
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-purple-600">Loading session content...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="bg-red-50 p-6 rounded-lg text-center">
        <p className="text-red-600">Session not found or could not be loaded.</p>
        <button
          onClick={onGoBack}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          Back to Enrolled Courses
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-purple-100">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-purple-800">{session.title}</h2>
          {course && (
            <p className="text-purple-600 text-sm mt-1">
              Course: {course.title}
            </p>
          )}
        </div>
        <button
          onClick={onGoBack}
          className="text-purple-600 hover:text-purple-800 text-sm font-medium"
        >
          Back to Courses
        </button>
      </div>

      {session.videoLink && (
        <div className="mb-6">
          <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
            <iframe
              src={getYouTubeEmbedURL(session.videoLink)}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={session.title}
              className="w-full h-64 md:h-96 rounded-lg"
            ></iframe>
          </div>
        </div>
      )}

      <div className="prose max-w-none">
        <h3 className="text-xl font-semibold text-purple-700 mb-3">Session Overview</h3>
        <p className="text-gray-700">{session.description}</p>

        {session.content && (
          <div className="mt-4">
            <h3 className="text-xl font-semibold text-purple-700 mb-3">Session Content</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="whitespace-pre-line text-gray-700">{session.content}</p>
            </div>
          </div>
        )}

        {session.resources && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-purple-700 mb-3">Additional Resources</h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="whitespace-pre-line text-gray-700">{session.resources}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleCompleteSession}
          disabled={isCompleted || completing}
          className={`py-2 px-6 rounded-md font-medium ${
            isCompleted
              ? 'bg-green-100 text-green-700 cursor-not-allowed'
              : completing
              ? 'bg-purple-300 text-purple-700 cursor-wait'
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          {isCompleted ? 'Completed' : completing ? 'Marking as Complete...' : 'Mark as Complete'}
        </button>
      </div>

      {isCompleted && (
        <div className="mt-4 bg-green-50 p-4 rounded-lg">
          <p className="text-green-700 font-medium">
            🎉 You've completed this session! Continue exploring other sessions in this course.
          </p>
        </div>
      )}
    </div>
  );
};

export default SessionCompletion;