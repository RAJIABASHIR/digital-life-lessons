import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function AdminDashboardHome() {
  const axiosInstance = useAxiosSecure();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/stats");
    
      return res.data?.data || res.data;
    },
  });

  if (isLoading) {
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
          <StatCard label="Total Users" value={stats.totalUsers ?? 6} />
          <StatCard label="Total Public Lessons" value={stats.totalPublicLessons ?? 6} />
          <StatCard label="Reported Lessons" value={stats.totalReportedLessons } />
          <StatCard label="Today’s New Lessons" value={stats.todaysNewLessons } />
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