import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

export default function AdminProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/admin/profile");
      const { profile, moderation } = res.data.data || {};

      if (!profile) {
        setProfile(null);
        return;
      }

      setProfile({
        ...profile,
        displayName: profile.displayName || profile.name || "Admin User",
        moderatedLessons: moderation?.moderatedLessons ?? 0,
        totalReportsReviewed: moderation?.totalActions ?? 0,
        deletedLessons: moderation?.deletedLessons ?? 0,
        ignoredReports: moderation?.ignoredReports ?? 0,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load admin profile");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-slate-200 border-t-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center text-slate-500">
        Unable to load admin profile.
      </div>
    );
  }

  const {
    displayName,
    email,
    photoURL,
    role,
    moderatedLessons = 0,
    deletedLessons = 0,
    ignoredReports = 0,
    totalReportsReviewed = 0,
  } = profile;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Admin Profile</h1>
      <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col sm:flex-row items-center gap-6 mb-8">
        <img
          src={
            photoURL ||
            "https://ui-avatars.com/api/?name=Admin&background=0f172a&color=fff"
          }
          alt={displayName || "Admin"}
          className="w-24 h-24 rounded-full object-cover border-2 border-primary"
        />
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">
              {displayName || "Admin User"}
            </h2>
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
              Admin ⭐
            </span>
          </div>
          <p className="text-sm text-slate-600">{email}</p>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Role: {role || "admin"}
          </p>
        </div>
      </div>
      <h2 className="text-lg font-semibold mb-4">Moderation Activity</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs text-slate-500 mb-1">Lessons Moderated</p>
          <p className="text-2xl font-semibold">{moderatedLessons}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs text-slate-500 mb-1">Lessons Deleted</p>
          <p className="text-2xl font-semibold">{deletedLessons}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs text-slate-500 mb-1">Reports Ignored</p>
          <p className="text-2xl font-semibold">{ignoredReports}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs text-slate-500 mb-1">Total Reports Reviewed</p>
          <p className="text-2xl font-semibold">{totalReportsReviewed}</p>
        </div>
      </div>
    </div>
  );
}