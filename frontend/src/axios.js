// Path: oodo\frontend\src\axios.js
import axios from "axios";

let isRefreshing = false;
let queue = [];

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url.includes("/refresh-token")) {
      window.dispatchEvent(new Event("auth:logout"));
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then(() => {
          return axiosInstance(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        await axiosInstance.post(
          "http://localhost:3000/oodo/refresh-token",
          {},
          {
            withCredentials: true,
          },
        );

        queue.forEach(({ resolve }) => resolve());

        queue = [];

        return axiosInstance(originalRequest);
      } catch (err) {
        queue.forEach(({ reject }) => reject(err));

        queue = [];

        window.dispatchEvent(new Event("auth:logout"));

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
