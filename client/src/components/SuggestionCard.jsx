import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge.jsx';
import UpvoteButton from './UpvoteButton.jsx';

export default function SuggestionCard({ suggestion }) {
  const truncateDescription = (text, maxLength = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-3">
        <Link
          to={`/suggestions/${suggestion._id}`}
          className="flex-1 hover:text-primary transition-colors"
        >
          <h3 className="text-xl font-semibold mb-2">{suggestion.title}</h3>
        </Link>
        <StatusBadge status={suggestion.status} />
      </div>

      <p className="text-gray-600 mb-4 line-clamp-3">
        {truncateDescription(suggestion.description)}
      </p>

      {suggestion.tags && suggestion.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {suggestion.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>
            by {suggestion.author?.name || 'Unknown'}
          </span>
          <span>•</span>
          <span>{formatDate(suggestion.createdAt)}</span>
        </div>
        <UpvoteButton suggestion={suggestion} />
      </div>
    </div>
  );
}

