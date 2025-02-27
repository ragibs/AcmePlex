import axios from "axios";

const api = axios.create({
  baseURL: "https://acme-backend.houseofmubina.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
