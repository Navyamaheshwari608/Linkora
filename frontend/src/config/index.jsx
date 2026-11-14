import axios from "axios";

//putting server url here for request to backend
export const BASE_URL = "https://linkora2.onrender.com";

export const clientServer = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
