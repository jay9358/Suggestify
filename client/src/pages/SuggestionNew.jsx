import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { suggestionStore } from '../store/suggestionStore.js';
import { authStore } from '../store/authStore.js';
import SuggestionForm from '../components/SuggestionForm.jsx';
import Toast from '../components/Toast.jsx';

export default function SuggestionNew() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const { createSuggestion, isLoading } = suggestionStore();
  const { isAuthenticated } = authStore();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (data) => {
    const result = await createSuggestion(data);
    if (result.success) {
      setToastMessage('Suggestion created successfully!');
      setToastType('success');
      setShowToast(true);
      setTimeout(() => navigate(`/suggestions/${result.suggestion._id}`), 1500);
    } else {
      setToastMessage(result.message || 'Failed to create suggestion');
      setToastType('error');
      setShowToast(true);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Suggestion</h1>
        <p className="text-gray-600 mt-2">Share your ideas and suggestions with the team</p>
      </div>
      <div className="card">
        <SuggestionForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}

