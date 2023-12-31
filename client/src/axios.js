import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api/v1",
});

axiosInstance.interceptors.request.use(function (config) {
  const accessToken = localStorage.getItem("access_token");
  if (accessToken) {
    config.headers = {
      Authorization: accessToken,
    };
  }
  return config;
});

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (error.config.url !== "/auth/login" && error.response.status === 401) {
      try {
        const response = await axiosInstance.post("/auth/token", {
          accessToken: localStorage.getItem("access_token"),
          refreshToken: localStorage.getItem("refresh_token"),
        });

        const { accessToken, refreshToken } = response.data;
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", refreshToken);
        originalRequest.headers = {
          Authorization: accessToken,
        };
        return axiosInstance(originalRequest);
      } catch (error) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
