import axios from "axios";

const BASE_URL = "http://localhost:8080";

export const axiosPublicInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const axiosPrivateInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-type': 'application/json' },
  withCredentials: true,
});

export const axiosPrivateOAuthInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})