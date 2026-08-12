import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5001/api'),
    withCredentials: true
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const baseUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5001/api');
                const res = await axios.post(`${baseUrl}/auth/refresh`, {}, { withCredentials: true });
                localStorage.setItem('token', res.data.token);
                API.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
                return API(originalRequest);
            } catch (err) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default API;
