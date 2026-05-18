// serverHttpCall.ts — SSR axios instance (no auth from localStorage; token lives client-only).

import axios from "axios";
import { serverDetails } from "@/config/env";

const instance = axios.create({
  baseURL: serverDetails.serverProxyURL,
});

instance.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error.response?.data || error),
);

export default instance;
