import axios from "axios";

const BASE_URL = "http://localhost:8080";

export const axiosPublic = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-type': 'application/json' },
  withCredentials: true,
});