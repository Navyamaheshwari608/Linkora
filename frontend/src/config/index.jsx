import axios from "axios";

//putting server url here for request to backend
export const BASE_URL = "http://localhost:8080";

export const clientServer = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
