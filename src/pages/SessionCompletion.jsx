import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SessionCompletion = ({ userData, selectedSession, onGoBack, onSessionCompleted }) => {
  const [sessionDetails, setSessionDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [rating, setRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState('');

  // Create an axios instance with default headers
  const api = axios.create({
    baseURL: 'http://localhost:4000/api/dashboard',
    withCredentials: true,
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  useEffect(() => {
    const fetchSessionDetails = async () => {
      if (!selectedSession) return;

      try {
        setLoading(true);

        // Fetch session details
        const sessionRes = await api.get(
          `/courses/${selectedSession.courseId}/sessions/${selectedSession.sessionId}`
        );
        setSessionDetails(sessionRes.data);

        // Fetch dashboard data to check completion
        const dashboardRes = await api.get(`/student/${userData.id}`);
        const courseData = dashboardRes.data.courses?.find(
          item => item.courseId === selectedSession.courseId
        );

        if (courseData) {
          const completed = courseData.completedSessions.some(
            id => id === selectedSession.sessionId
          );
          setIsCompleted(completed);
        }

        // Fetch rating status directly from backend
        const ratingRes = await api.get(`/sessions/${selectedSession.sessionId}/rating-status`);
        setHasRated(ratingRes.data.hasRated);

      } catch (error) {
        console.error('Error fetching session details:', error);
        toast.error('Failed to load session details. Please try again.');
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSessionDetails();
  }, [selectedSession, userData.id]);

  const handleMarkComplete = async () => {
    if (!selectedSession || !userData?.id) return;

    try {
      const response = await api.post(
        `/student/${userData.id}/courses/${selectedSession.courseId}/sessions/${selectedSession.sessionId}/complete`
      );

      if (response.data) {
        setIsCompleted(true);
        toast.success('Session marked as completed!');
        if (onSessionCompleted) {
          onSessionCompleted();
        }
      }
    } catch (error) {
      console.error('Error marking session complete:', error);
      toast.error('Failed to mark session as completed');
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleRatingSubmit = async () => {
    if (!selectedSession || !userData?.id) return;
    if (!rating) {
      toast.warn('Please select a rating before submitting.');
      return;
    }

    try {
      setSubmissionStatus('Submitting rating...');
      const response = await api.post(
        `/sessions/${selectedSession.sessionId}/rate`,
        { rating }
      );

      if (response.data) {
        setHasRated(true);
        toast.success('Rating submitted successfully!');
      } else {
        toast.error('Failed to submit rating.');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Failed to submit rating.');
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else if (error.response?.status === 409) {
        toast.warn('You have already rated this session.');
        setHasRated(true);
      }
    } finally {
      setSubmissionStatus('');
    }
  };

  const getYouTubeEmbedURL = (url) => {
    if (!url) return '';
    const videoIdMatch = url.match(/(?:v=|youtu\.be\/|\/embed\/|\/v\/|watch\?v=|&v=)([0-9A-Za-z_-]{11})/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  };

  const handleVideoLoad = () => {
    setVideoLoaded(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-purple-600">Loading session details...</div>
      </div>
    );
  }

  if (!sessionDetails) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-gray-600">Session details not found.</p>
        <button
          onClick={onGoBack}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          Back to My Courses
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-purple-800">{sessionDetails.title}</h2>
          <p className="text-gray-600 mt-1">From Course: {selectedSession.courseId}</p>
        </div>
        <button
          onClick={onGoBack}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
        >
          Back to Courses
        </button>
      </div>

      {sessionDetails.videoLink && (
        <div className="mb-6">
          <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden">
            <iframe
              src={getYouTubeEmbedURL(sessionDetails.videoLink)}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={sessionDetails.title}
              className="w-full h-96"
              onLoad={handleVideoLoad}
            ></iframe>
          </div>
          {!videoLoaded && (
            <div className="flex justify-center items-center h-96 bg-gray-100 rounded-lg">
              <p className="text-gray-500">Loading video...</p>
            </div>
          )}
        </div>
      )}

      <div className="prose max-w-none mb-6">
        <h3 className="text-xl font-semibold text-purple-700 mb-3">Session Content</h3>
        <p className="text-gray-700 whitespace-pre-line">{sessionDetails.explanation}</p>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-purple-700 mb-3">Rate this Session</h3>
        {hasRated ? (
          <p className="text-gray-600">You have already rated this session.</p>
        ) : (
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => handleRatingChange(value)}
                className={`mr-2 px-3 py-2 rounded-md text-gray-700 ${
                  rating >= value ? 'bg-yellow-400 text-yellow-900' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {value}
              </button>
            ))}
            {rating > 0 && (
              <button
                onClick={handleRatingSubmit}
                className="ml-4 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={submissionStatus !== ''}
              >
                {submissionStatus || 'Submit Rating'}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-end">
        {isCompleted ? (
          <div className="px-4 py-2 bg-green-100 text-green-800 rounded-md inline-flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            You've completed this session
          </div>
        ) : (
          <button
            onClick={handleMarkComplete}
            className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Mark as Completed
          </button>
        )}
      </div>
    </div>
  );
};

export default SessionCompletion;