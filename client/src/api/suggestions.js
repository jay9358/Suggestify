import api from './api.js';

export const suggestionsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/suggestions', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/suggestions/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/suggestions', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.patch(`/suggestions/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/suggestions/${id}`);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.patch(`/suggestions/${id}/status`, { status });
    return response.data;
  },

  upvote: async (id) => {
    const response = await api.post(`/suggestions/${id}/upvote`);
    return response.data;
  }
};

export const statsAPI = {
  getTop: async (limit = 10) => {
    const response = await api.get('/stats/top', { params: { limit } });
    return response.data;
  },

  getStatusCounts: async () => {
    const response = await api.get('/stats/status-counts');
    return response.data;
  }
};

