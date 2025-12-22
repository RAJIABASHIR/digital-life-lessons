import axios from "axios";
import { getAuth } from "firebase/auth";
import app from "../firebase/firebase.config";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL
  //"http://localhost:5001/api" 
  //"https://digital-life-lessons-server-beta.vercel.app/api" 
});

axiosInstance.interceptors.request.use(async (config) => {
  const auth = getAuth(app);
  const user = auth.currentUser;

  if (user) {
    const token = await user.getIdToken();
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;

