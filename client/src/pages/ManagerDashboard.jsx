import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authStore } from '../store/authStore.js';
import { suggestionStore } from '../store/suggestionStore.js';
import SuggestionCard from '../components/SuggestionCard.jsx';

export default function ManagerDashboard() {
  const { user, isAuthenticated } = authStore();
  const { suggestions, fetchSuggestions, statusCounts, fetchStatusCounts, isLoading } = suggestionStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || (user?.role !== 'manager' && user?.role !== 'admin')) {
      navigate('/');
      return;
    }
    fetchSuggestions();
    fetchStatusCounts();
  }, [isAuthenticated, user, navigate, fetchSuggestions, fetchStatusCounts]);

  if (!isAuthenticated || (user?.role !== 'manager' && user?.role !== 'admin')) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Manager Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <div className="text-sm text-gray-600">New</div>
          <div className="text-2xl font-bold text-blue-600">{statusCounts.New || 0}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600">Under Review</div>
          <div className="text-2xl font-bold text-yellow-600">{statusCounts['Under Review'] || 0}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600">Approved</div>
          <div className="text-2xl font-bold text-green-600">{statusCounts.Approved || 0}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600">Implemented</div>
          <div className="text-2xl font-bold text-purple-600">{statusCounts.Implemented || 0}</div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">All Suggestions</h2>
        {isLoading && suggestions.length === 0 ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              </div>
            ))}
          </div>
        ) : suggestions.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">No suggestions found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {suggestions.map((suggestion) => (
              <SuggestionCard key={suggestion._id} suggestion={suggestion} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

