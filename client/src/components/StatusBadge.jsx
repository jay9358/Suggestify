export default function StatusBadge({ status }) {
  const statusColors = {
    'New': 'bg-blue-100 text-blue-800',
    'Under Review': 'bg-yellow-100 text-yellow-800',
    'Approved': 'bg-green-100 text-green-800',
    'Implemented': 'bg-purple-100 text-purple-800'
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        statusColors[status] || 'bg-gray-100 text-gray-800'
      }`}
    >
      {status}
    </span>
  );
}

