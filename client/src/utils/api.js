import axios from "axios"

const isProduction = window.location.hostname !== "localhost";
const baseURL= isProduction? "https://store-rating-n3o2.onrender.com":"http://localhost:8000"
console.log(window.location.hostname);
console.log(baseURL);
const token = localStorage.getItem("token");
const api = axios.create({
    baseURL,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    withCredentials: true,
  });
  

export default api