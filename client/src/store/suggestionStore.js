import { create } from 'zustand';
import { suggestionsAPI, statsAPI } from '../api/suggestions.js';

export const suggestionStore = create((set, get) => ({
  suggestions: [],
  currentSuggestion: null,
  statusCounts: {},
  topSuggestions: [],
  filters: {
    status: '',
    tag: '',
    search: '',
    sort: 'new',
    page: 1,
    limit: 10
  },
  pagination: {
    page: 1,
    pages: 1,
    total: 0
  },
  isLoading: false,
  error: null,

  fetchSuggestions: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const filters = { ...get().filters, ...params };
      const response = await suggestionsAPI.getAll(filters);
      set({
        suggestions: response.suggestions,
        pagination: {
          page: response.page,
          pages: response.pages,
          total: response.total
        },
        filters,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch suggestions',
        isLoading: false
      });
    }
  },

  fetchSuggestion: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await suggestionsAPI.getById(id);
      set({
        currentSuggestion: response.suggestion,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch suggestion',
        isLoading: false
      });
    }
  },

  createSuggestion: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await suggestionsAPI.create(data);
      set((state) => ({
        suggestions: [response.suggestion, ...state.suggestions],
        isLoading: false
      }));
      return { success: true, suggestion: response.suggestion };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to create suggestion';
      set({ error: errorMsg, isLoading: false });
      return { success: false, message: errorMsg };
    }
  },

  upvoteSuggestion: async (id, optimistic = true) => {
    const suggestion = get().suggestions.find(s => s._id === id) || get().currentSuggestion;
    if (!suggestion) return { success: false };

    const wasUpvoted = suggestion.upvoters?.some(
      u => u._id === suggestion.upvoters?.[0]?._id || typeof u === 'string'
    ) || false;

    // Optimistic update
    if (optimistic) {
      const optimisticCount = wasUpvoted ? suggestion.upvotesCount - 1 : suggestion.upvotesCount + 1;
      set((state) => ({
        suggestions: state.suggestions.map(s =>
          s._id === id ? { ...s, upvotesCount: optimisticCount } : s
        ),
        currentSuggestion: state.currentSuggestion?._id === id
          ? { ...state.currentSuggestion, upvotesCount: optimisticCount }
          : state.currentSuggestion
      }));
    }

    try {
      const response = await suggestionsAPI.upvote(id);
      set((state) => ({
        suggestions: state.suggestions.map(s =>
          s._id === id
            ? { ...s, upvotesCount: response.upvotesCount, upvoted: response.upvoted }
            : s
        ),
        currentSuggestion: state.currentSuggestion?._id === id
          ? { ...state.currentSuggestion, upvotesCount: response.upvotesCount, upvoted: response.upvoted }
          : state.currentSuggestion
      }));
      return { success: true, ...response };
    } catch (error) {
      // Revert optimistic update on error
      if (optimistic) {
        set((state) => ({
          suggestions: state.suggestions.map(s =>
            s._id === id ? { ...s, upvotesCount: suggestion.upvotesCount } : s
          ),
          currentSuggestion: state.currentSuggestion?._id === id
            ? { ...state.currentSuggestion, upvotesCount: suggestion.upvotesCount }
            : state.currentSuggestion
        }));
      }
      return { success: false, message: error.response?.data?.message || 'Failed to upvote' };
    }
  },

  updateStatus: async (id, status) => {
    set({ isLoading: true, error: null });
    try {
      const response = await suggestionsAPI.updateStatus(id, status);
      set((state) => ({
        suggestions: state.suggestions.map(s =>
          s._id === id ? response.suggestion : s
        ),
        currentSuggestion: state.currentSuggestion?._id === id
          ? response.suggestion
          : state.currentSuggestion,
        isLoading: false
      }));
      return { success: true };
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update status',
        isLoading: false
      });
      return { success: false };
    }
  },

  fetchStatusCounts: async () => {
    try {
      const response = await statsAPI.getStatusCounts();
      set({ statusCounts: response.statusCounts });
    } catch (error) {
      console.error('Failed to fetch status counts:', error);
    }
  },

  fetchTopSuggestions: async (limit = 10) => {
    try {
      const response = await statsAPI.getTop(limit);
      set({ topSuggestions: response.suggestions });
    } catch (error) {
      console.error('Failed to fetch top suggestions:', error);
    }
  },

  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters, page: 1 }
    }));
  },

  clearError: () => set({ error: null })
}));

