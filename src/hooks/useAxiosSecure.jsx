import axios from "axios";
import { useEffect } from "react";
import useAuth from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import app from "../firebase/firebase.config";

const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
});

const useAxiosSecure = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const auth = getAuth(app);

        const requestInterceptor = axiosSecure.interceptors.request.use(async function (config) {
            const user = auth.currentUser;
            if (user) {
                const token = await user.getIdToken();
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        }, function (error) {
            return Promise.reject(error);
        });

        const responseInterceptor = axiosSecure.interceptors.response.use(function (response) {
            return response;
        }, async (error) => {
            const status = error.response?.status;
            // 401: Unauthorized, 403: Forbidden
            if (status === 401 || status === 403) {
                await logout();
                navigate('/login');
            }
            return Promise.reject(error);
        });

        return () => {
            axiosSecure.interceptors.request.eject(requestInterceptor);
            axiosSecure.interceptors.response.eject(responseInterceptor);
        }
    }, [logout, navigate]);

    return axiosSecure;
};

export default useAxiosSecure;
