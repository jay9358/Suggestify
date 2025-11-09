import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { suggestionStore } from '../store/suggestionStore.js';
import { authStore } from '../store/authStore.js';
import StatusBadge from '../components/StatusBadge.jsx';
import UpvoteButton from '../components/UpvoteButton.jsx';
import Toast from '../components/Toast.jsx';

export default function SuggestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentSuggestion, fetchSuggestion, updateStatus, isLoading } = suggestionStore();
  const { user, isAuthenticated } = authStore();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchSuggestion(id);
  }, [id, fetchSuggestion]);

  const handleStatusChange = async (newStatus) => {
    const result = await updateStatus(id, newStatus);
    if (result.success) {
      setToastMessage('Status updated successfully!');
      setShowToast(true);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canEdit = isAuthenticated && (
    currentSuggestion?.author?._id === user?._id || user?.role === 'admin'
  );

  const canChangeStatus = isAuthenticated && (user?.role === 'manager' || user?.role === 'admin');

  if (isLoading && !currentSuggestion) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!currentSuggestion) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg">Suggestion not found</p>
          <Link to="/" className="text-primary mt-4 inline-block">
            Go back to suggestions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {showToast && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-primary hover:text-primary-dark flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </button>
      </div>

      <div className="card">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex-1">{currentSuggestion.title}</h1>
          <StatusBadge status={currentSuggestion.status} />
        </div>

        <div className="mb-6">
          <p className="text-gray-700 whitespace-pre-wrap">{currentSuggestion.description}</p>
        </div>

        {currentSuggestion.tags && currentSuggestion.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {currentSuggestion.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {currentSuggestion.attachments && currentSuggestion.attachments.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Attachments</h3>
            <div className="space-y-2">
              {currentSuggestion.attachments.map((url, index) => (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline block"
                >
                  {url}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-6 border-t">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>
              by <span className="font-medium">{currentSuggestion.author?.name || 'Unknown'}</span>
            </span>
            <span>•</span>
            <span>{formatDate(currentSuggestion.createdAt)}</span>
          </div>
          <UpvoteButton suggestion={currentSuggestion} />
        </div>

        {canChangeStatus && (
          <div className="mt-6 pt-6 border-t">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Update Status
            </label>
            <select
              id="status"
              value={currentSuggestion.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="input-field max-w-xs"
            >
              <option value="New">New</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Implemented">Implemented</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

