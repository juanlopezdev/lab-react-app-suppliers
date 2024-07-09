import axios from 'axios';

const apiClient = axios.create({ 
  baseURL: 'http://127.0.0.1:8000/',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  config => {
    const nonSecurePaths = ['/api-token-auth/', '/logout/'];
    if (!nonSecurePaths.includes(config.url)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers['Authorization'] = `Token ${token}`;
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export const login = async (username, password) => {
  try {
    const response = await apiClient.post('api-token-auth/', {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('apiClient.js > login', error);
    throw error;
  }	
};

export default apiClient;
