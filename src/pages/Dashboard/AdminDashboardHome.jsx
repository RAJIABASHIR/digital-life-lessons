import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

export default function AdminDashboardHome() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/admin/stats");
        const payload = res.data;
        const normalized =
          payload?.data && typeof payload.data === "object" ? payload.data : payload;

        setStats(normalized);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to load admin stats");
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-6">
            Admin Overview
          </h1>
          <div className="grid md:grid-cols-4 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
            Admin Overview
          </h1>
          <p className="text-slate-600">No stats found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-6">
          Admin Overview
        </h1>

        <div className="grid md:grid-cols-4 gap-6">
          <StatCard label="Total Users" value={stats.totalUsers} />
          <StatCard label="Total Public Lessons" value={stats.totalPublicLessons} />
          <StatCard label="Reported Lessons" value={stats.totalReportedLessons} />
          <StatCard label="Today’s New Lessons" value={stats.todaysNewLessons} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl p-[1px] bg-gradient-to-r from-slate-900 to-slate-800 shadow">
      <div className="rounded-2xl p-6 bg-gradient-to-br from-slate-950 to-slate-900">
        <p className="text-sm text-slate-300">{label}</p>
        <p className="text-4xl font-extrabold text-white mt-2">
          {value ?? 0}
        </p>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl p-[1px] bg-gradient-to-r from-slate-200 to-slate-100">
      <div className="rounded-2xl p-6 bg-white">
        <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
        <div className="h-8 w-16 bg-slate-100 rounded mt-4 animate-pulse" />
      </div>
    </div>
  );
}