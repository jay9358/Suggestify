import { useEffect } from 'react';
import { suggestionStore } from '../store/suggestionStore.js';
import SuggestionCard from './SuggestionCard.jsx';

export default function SuggestionList() {
  const { suggestions, isLoading, pagination, filters, fetchSuggestions } = suggestionStore();

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  const handlePageChange = (newPage) => {
    fetchSuggestions({ ...filters, page: newPage });
  };

  if (isLoading && suggestions.length === 0) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        ))}
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500 text-lg">No suggestions found</p>
        <p className="text-gray-400 mt-2">Be the first to create one!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-4">
        {suggestions.map((suggestion) => (
          <SuggestionCard key={suggestion._id} suggestion={suggestion} />
        ))}
      </div>

      {pagination.pages > 1 && (
        <div className="mt-6 flex justify-center items-center space-x-2">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-600">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

