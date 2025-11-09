import { useState } from 'react';
import { suggestionStore } from '../store/suggestionStore.js';
import { authStore } from '../store/authStore.js';

export default function UpvoteButton({ suggestion }) {
  const { upvoteSuggestion } = suggestionStore();
  const { isAuthenticated } = authStore();
  const [isUpvoting, setIsUpvoting] = useState(false);

  const isUpvoted = suggestion.upvoters?.some(
    (u) => (typeof u === 'object' ? u._id : u) === authStore.getState().user?._id
  ) || false;

  const handleUpvote = async () => {
    if (!isAuthenticated) {
      alert('Please login to upvote');
      return;
    }

    setIsUpvoting(true);
    await upvoteSuggestion(suggestion._id, true);
    setIsUpvoting(false);
  };

  return (
    <button
      onClick={handleUpvote}
      disabled={isUpvoting || !isAuthenticated}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
        isUpvoted
          ? 'bg-primary text-white'
          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
      } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
      aria-label={isUpvoted ? 'Remove upvote' : 'Upvote'}
    >
      <svg
        className={`w-5 h-5 ${isUpvoted ? 'fill-current' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v3m7 10h.01M7 20H5a2 2 0 01-2-2v-5a2 2 0 012-2h2m7 10v-5a2 2 0 00-2-2H9m5 4h.01"
        />
      </svg>
      <span className="font-semibold">{suggestion.upvotesCount || 0}</span>
    </button>
  );
}

