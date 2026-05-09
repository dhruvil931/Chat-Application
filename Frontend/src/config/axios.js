import axios from "axios";

export const baseURL = "http://localhost:8080";

export const httpClient = axios.create({
  baseURL,
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
});
