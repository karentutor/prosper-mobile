import axios from "axios";

export const API_BASE_URL = "http://10.0.0.84:8000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});