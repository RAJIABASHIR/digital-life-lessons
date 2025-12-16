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

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Reported Lessons</h1>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-10 w-10 rounded-full border-4 border-slate-200 border-t-primary" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left">Lesson Title</th>
                <th className="px-4 py-2 text-left">Report Count</th>
                <th className="px-4 py-2 text-left">Last Reported</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reported.map((item) => (
                <tr key={item.lessonId} className="border-t">
                  <td className="px-4 py-2 max-w-xs truncate">
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
                      className="text-xs text-primary"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
              {reported.length === 0 && !loading && (
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
      )}
    </div>
  );
}