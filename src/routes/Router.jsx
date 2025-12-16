import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminRoute from "../components/AdminRoute";
import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import PublicLessons from "../pages/Lessons/PublicLessons";
import LessonDetails from "../pages/Lessons/LessonDetails";
import Pricing from "../pages/Pricing/Pricing";
import PaymentSuccess from "../pages/Pricing/PaymentSuccess";
import PaymentCancel from "../pages/Pricing/PaymentCancel";
import LoadingPage from "../pages/Loading/LoadingPage";
import NotFound from "../pages/NotFound/NotFound";

import DashboardHome from "../pages/Dashboard/DashboardHome";
import AddLesson from "../pages/Dashboard/AddLesson";
import MyLessons from "../pages/Dashboard/MyLessons";
import UpdateLesson from "../pages/Dashboard/UpdateLesson";
import MyFavorites from "../pages/Dashboard/MyFavorites";
import Profile from "../pages/Dashboard/Profile";

import AdminDashboardHome from "../pages/Dashboard/AdminDashboardHome";
import ManageUsers from "../pages/Dashboard/ManageUsers";
import ManageLessons from "../pages/Dashboard/ManageLessons";
import ReportedLessons from "../pages/Dashboard/ReportedLessons";
import AdminProfile from "../pages/Dashboard/AdminProfile";

const Router = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/public-lessons" element={<PublicLessons />} />
        <Route
          path="/lessons/:id"
          element={
            <ProtectedRoute>
              <LessonDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pricing"
          element={
            <ProtectedRoute>
              <Pricing />
            </ProtectedRoute>
          }
        />
        <Route path="/pricing/success" element={<PaymentSuccess />} />
        <Route path="/pricing/cancel" element={<PaymentCancel />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="add-lesson" element={<AddLesson />} />
        <Route path="my-lessons" element={<MyLessons />} />
        <Route path="update-lesson/:id" element={<UpdateLesson />} /> 
        <Route path="my-favorites" element={<MyFavorites />} />
        <Route path="profile" element={<Profile />} />

        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminDashboardHome />
            </AdminRoute>
          }
        />
        <Route
          path="admin/manage-users"
          element={
            <AdminRoute>
              <ManageUsers />
            </AdminRoute>
          }
        />
        <Route
          path="admin/manage-lessons"
          element={
            <AdminRoute>
              <ManageLessons />
            </AdminRoute>
          }
        />
        <Route
          path="admin/reported-lessons"
          element={
            <AdminRoute>
              <ReportedLessons />
            </AdminRoute>
          }
        />
        <Route
          path="admin/profile"
          element={
            <AdminRoute>
              <AdminProfile />
            </AdminRoute>
          }
        />
      </Route>

      <Route path="/loading" element={<LoadingPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
