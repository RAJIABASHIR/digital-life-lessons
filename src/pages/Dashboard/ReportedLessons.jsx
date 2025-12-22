import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function ReportedLessons() {
  const [reported, setReported] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReportedLessons = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/admin/reports");
      setReported(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load reported lessons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportedLessons();
  }, []);

  const openReportDetails = async (lessonId) => {
    try {
      const res = await axiosInstance.get(`/admin/reports/${lessonId}`);
      const { lesson, reports } = res.data.data;

      const html = `
        <div style="text-align:left">
          <p><strong>Lesson:</strong> ${lesson?.title || "Unknown"}</p>
          <hr style="margin:8px 0" />
          ${reports
            .map(
              (r, idx) => `
            <div style="margin-bottom:8px">
              <p style="margin:0;font-size:12px;"><strong>#${idx + 1}</strong></p>
              <p style="margin:0;font-size:12px;"><strong>Reason:</strong> ${
                r.reason
              }</p>
              <p style="margin:0;font-size:11px;color:#64748b">
                Reporter: ${r.reporterEmail || r.reporterUserId || "Unknown"}
              </p>
              <p style="margin:0;font-size:11px;color:#94a3b8">
                ${new Date(r.createdAt).toLocaleString()}
              </p>
            </div>
          `
            )
            .join("")}
        </div>
      `;

      const result = await Swal.fire({
        title: "Reported Lesson",
        html,
        width: 600,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Delete Lesson",
        denyButtonText: "Ignore Reports",
        cancelButtonText: "Close",
      });

      if (result.isConfirmed) {
        await axiosInstance.delete(`/admin/lessons/${lessonId}`);
        toast.success("Lesson deleted");
        loadReportedLessons();
      } else if (result.isDenied) {
        await axiosInstance.patch(`/admin/reports/${lessonId}/resolve`, {
          status: "ignored",
        });
        toast.success("Reports marked as resolved");
        loadReportedLessons();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load report details");
    }
  };

  const isEmpty = !reported || reported.length === 0;

  return (
    <div className="min-h-[70vh] bg-slate-50 px-4 py-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-4 text-2xl font-extrabold tracking-tight text-slate-900">
          Reported Lessons
        </h1>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-primary" />
              <p className="text-sm text-slate-500">
                Loading reported lessons...
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block">
              <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Lesson Title
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Report Count
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Last Reported
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reported.map((item) => (
                      <tr key={item.lessonId} className="border-t border-slate-100">
                        <td className="max-w-xs truncate px-4 py-2">
                          {item.lessonTitle || "Untitled"}
                        </td>
                        <td className="px-4 py-2">{item.reportCount}</td>
                        <td className="px-4 py-2 text-xs text-slate-500">
                          {item.lastReportedAt
                            ? new Date(item.lastReportedAt).toLocaleString()
                            : "-"}
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => openReportDetails(item.lessonId)}
                            className="text-xs text-primary hover:underline"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                    {isEmpty && (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-4 py-4 text-center text-slate-500"
                        >
                          No reported lessons. 🎉
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile cards */}
            <div className="mt-4 space-y-3 md:hidden">
              {isEmpty ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm text-slate-500">
                  No reported lessons. 🎉
                </div>
              ) : (
                reported.map((item) => (
                  <div
                    key={item.lessonId}
                    className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
                  >
                    <h2 className="text-sm font-semibold text-slate-900">
                      {item.lessonTitle || "Untitled"}
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Reports:{" "}
                      <span className="font-medium text-slate-700">
                        {item.reportCount}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Last reported:{" "}
                      <span className="font-medium text-slate-700">
                        {item.lastReportedAt
                          ? new Date(item.lastReportedAt).toLocaleString()
                          : "-"}
                      </span>
                    </p>

                    <div className="mt-3 flex flex-wrap gap-3 text-xs">
                      <button
                        onClick={() => openReportDetails(item.lessonId)}
                        className="font-medium text-primary"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
