// API.js
import axios from 'axios';
import { BE_URL } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';


const API = axios.create({
  baseURL: BE_URL,
});

let isRefreshing = false;
let refreshSubscribers = [];

// Hàm để thông báo cho các request đợi refresh xong
const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
};

// Kiểm tra token sắp hết hạn chưa
const isTokenExpiring = (token) => {
  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) return true;
    const now = Date.now() / 1000;
    return decoded.exp - now < 60; // Còn dưới 60s thì coi như hết hạn
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

// Hàm refresh token
const refreshAccessToken = async () => {
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  if (!refreshToken) throw new Error('No refresh token');

  const response = await axios.post(`${BE_URL}/refresh`, {
    refresh_token: refreshToken,
  });

  const newToken = response.data.token;
  await AsyncStorage.setItem('userToken', newToken);

  return newToken;
};

// Request Interceptor
API.interceptors.request.use(
  async (config) => {
    let token = await AsyncStorage.getItem('userToken');

    if (token) {
      const willExpireSoon = isTokenExpiring(token);

      if (willExpireSoon) {
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const newToken = await refreshAccessToken();
            token = newToken;
            onRefreshed(newToken);
          } catch (error) {
            console.error('Refresh token failed:', error);
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('refreshToken');
          } finally {
            isRefreshing = false;
          }
        }

        // Nếu đang refresh, đợi token mới
        const retryOriginalRequest = new Promise((resolve) => {
          subscribeTokenRefresh((newToken) => {
            config.headers.Authorization = newToken;
            resolve(config);
          });
        });

        return retryOriginalRequest;
      }

      config.headers.Authorization = token;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (phòng trường hợp lỗi token invalid)
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data.message === 'token is invalid' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = newToken;
        return axios(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed in response:', refreshError);
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('refreshToken');
      }
    }

    return Promise.reject(error);
  }
);

export default API;
