import axios from "axios";
import { serverDetails } from "@/config/env";
import { toast } from "react-hot-toast";
import {
  clearStoredAuth,
  resolveAuthorizationBearer,
} from "@/utils/authStorage";

const axiosInstance = axios.create({
  baseURL: serverDetails.serverProxyURL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const bearer = resolveAuthorizationBearer(config);
    if (bearer) {
      config.headers.Authorization = `Bearer ${bearer}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response.data,

  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;

    if (process.env.NODE_ENV === "development") {
      console.warn("[http]", status ?? "network", data?.message ?? error.message);
    }

    if (
      status === 401 &&
      data?.code === "unauthorized"
    ) {
      const redirectUrl = encodeURIComponent(
        `${window.location.pathname}${window.location.search}${window.location.hash}`
      );
      location.href = `/login?redirect_url=${redirectUrl}`;
      clearStoredAuth();
    }

    if (status === 403) {
      toast.error("You are not allowed to access this resource");
      return Promise.reject({
        code: "forbidden",
        message: "You are not authorized to access this resource",
      });
    }

    if (status === 500) {
      toast.error("Internal server error");
    }

    return Promise.reject(data ?? error);
  }
);

export default axiosInstance;
