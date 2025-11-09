import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authStore } from '../store/authStore.js';
import { suggestionStore } from '../store/suggestionStore.js';
import SuggestionCard from '../components/SuggestionCard.jsx';

export default function Profile() {
  const { user, isAuthenticated } = authStore();
  const { suggestions, fetchSuggestions, isLoading } = suggestionStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchSuggestions({ author: user?._id });
  }, [isAuthenticated, navigate, user, fetchSuggestions]);

  if (!isAuthenticated) {
    return null;
  }

  const mySuggestions = suggestions.filter(
    s => s.author?._id === user?._id || s.author === user?._id
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <div className="mt-4 card">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-semibold">
              {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">My Suggestions</h2>
        {isLoading && mySuggestions.length === 0 ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              </div>
            ))}
          </div>
        ) : mySuggestions.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">You haven't created any suggestions yet</p>
            <button
              onClick={() => navigate('/suggestions/new')}
              className="btn-primary mt-4"
            >
              Create Your First Suggestion
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {mySuggestions.map((suggestion) => (
              <SuggestionCard key={suggestion._id} suggestion={suggestion} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

