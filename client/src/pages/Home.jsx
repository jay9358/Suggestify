import { useEffect } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import SuggestionList from '../components/SuggestionList.jsx';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
          <Sidebar />
        </div>
        <div className="lg:w-3/4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Suggestions</h1>
            <p className="text-gray-600 mt-2">Browse and discover suggestions from the team</p>
          </div>
          <SuggestionList />
        </div>
      </div>
    </div>
  );
}

