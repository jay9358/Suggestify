import { useEffect } from 'react';
import { suggestionStore } from '../store/suggestionStore.js';

export default function Sidebar() {
  const { statusCounts, filters, setFilters, fetchSuggestions, fetchStatusCounts } = suggestionStore();

  useEffect(() => {
    fetchStatusCounts();
  }, [fetchStatusCounts]);

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'New', label: 'New' },
    { value: 'Under Review', label: 'Under Review' },
    { value: 'Approved', label: 'Approved' },
    { value: 'Implemented', label: 'Implemented' }
  ];

  const handleStatusFilter = (status) => {
    setFilters({ status, page: 1 });
    fetchSuggestions({ status, page: 1 });
  };

  const handleSortChange = (sort) => {
    setFilters({ sort, page: 1 });
    fetchSuggestions({ sort, page: 1 });
  };

  return (
    <aside className="w-64 bg-white shadow-md p-6 rounded-lg h-fit sticky top-20">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sort By
        </label>
        <select
          value={filters.sort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="w-full input-field"
        >
          <option value="new">Newest First</option>
          <option value="top">Top Upvoted</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <div className="space-y-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleStatusFilter(option.value)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                filters.status === option.value
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {option.label}
              {option.value && statusCounts[option.value] !== undefined && (
                <span className="ml-2 text-xs opacity-75">
                  ({statusCounts[option.value]})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Quick Stats</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Total:</span>
            <span className="font-semibold">
              {Object.values(statusCounts).reduce((a, b) => a + b, 0)}
            </span>
          </div>
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="flex justify-between">
              <span className="text-gray-600">{status}:</span>
              <span className="font-semibold">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

