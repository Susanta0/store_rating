import axios from "axios"

const isProduction = window.location.hostname !== "localhost";
const baseUrl= isProduction? "":"https://store-rating-n3o2.onrender.com"

const api= axios.create({
    baseURL: baseUrl,
    withCredentials:false
})

// Add a request interceptor to always use the latest token
api.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api