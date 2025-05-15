import axios from "axios"

const isProduction = window.location.hostname !== "localhost";
const baseURL= isProduction? "https://store-rating-n3o2.onrender.com":"http://localhost:8000"
console.log(window.location.hostname);
console.log(baseURL);

const api = axios.create({
    baseURL,
    withCredentials: true,
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default api