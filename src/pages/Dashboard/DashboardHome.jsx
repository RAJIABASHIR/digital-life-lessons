//import { useEffect } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../context/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function DashboardOverview() {
  const { appUser } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats', appUser?.email],
    enabled: !!appUser?.email,
    queryFn: async () => {
      const res = await axiosSecure.get('/users/stats/dashboard');
      return res.data;
    }
  });

  if (isLoading) return <LoadingSpinner />;

  const totalLessons = stats?.totalLessons ?? 6;
  const totalFavorites = stats?.totalFavorites ?? 6;
  const plan = appUser?.isPremium ? "Premium" : "Free";

 
  const recentLessons = stats?.recentLessons || [];
  const trend = recentLessons.length > 0
    ? recentLessons.map((l, i) => ({
      name: new Date(l.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      value: l.wordCount || (i + 5) * 10 
    })).reverse()
    : [
      { name: "No Data", value: 0 },
    ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

        <div className="mb-6 flex flex-col gap-3 sm:gap-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-slate-100 hover:bg-slate-800 transition w-full sm:w-auto justify-center sm:justify-start"
            >
              <span className="text-lg">←</span>
              <span>Back to Home</span>
            </Link>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-center sm:text-left">
            Dashboard Overview
          </h1>
        </div>


        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-3">

          <div className="rounded-2xl p-[1px] bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 shadow-lg">
            <div className="rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 p-4 sm:p-6">
              <p className="text-xs sm:text-sm text-slate-400">
                Total Lessons
              </p>
              <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-white">
                {totalLessons}
              </p>
            </div>
          </div>

          {/* Total Favorites */}
          <div className="rounded-2xl p-[1px] bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 shadow-lg">
            <div className="rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 p-4 sm:p-6">
              <p className="text-xs sm:text-sm text-slate-400">
                Total Favorites
              </p>
              <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-white">
                {totalFavorites}
              </p>
            </div>
          </div>


          <div className="rounded-2xl p-[1px] bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 shadow-lg">
            <div className="rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 p-4 sm:p-6">
              <p className="text-xs sm:text-sm text-slate-400">Plan</p>
              <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">
                {plan}
              </p>
            </div>
          </div>
        </div>


        <div className="mt-8 rounded-2xl p-[1px] bg-gradient-to-r from-indigo-500/60 via-fuchsia-500/40 to-sky-500/60 shadow-lg">
          <div className="rounded-2xl bg-slate-950 p-4 sm:p-6">
            <p className="mb-4 text-sm sm:text-base font-semibold text-slate-100">
              Recent Reflections (Lesson Length Trend)
            </p>

            <div className="h-56 sm:h-64 md:h-72 rounded-xl border border-slate-800 bg-slate-950">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="lenFill" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#a855f7"
                        stopOpacity={0.7}
                      />
                      <stop
                        offset="95%"
                        stopColor="#a855f7"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    tick={{ fontSize: 10, fill: "#cbd5f5" }}
                  />
                  <YAxis
                    stroke="#64748b"
                    tick={{ fontSize: 10, fill: "#cbd5f5" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#020617",
                      border: "1px solid #1e293b",
                      borderRadius: "0.75rem",
                      color: "#e5e7eb",
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#a855f7"
                    strokeWidth={2}
                    fill="url(#lenFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}