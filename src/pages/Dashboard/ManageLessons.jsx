import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

export default function ManageLessons() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLessons = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/admin/lessons");
      setLessons(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load lessons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLessons();
  }, []);

  const handleDelete = async (lessonId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this lesson? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/admin/lessons/${lessonId}`);
      toast.success("Lesson deleted");
      setLessons((prev) => prev.filter((l) => l._id !== lessonId));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete lesson");
    }
  };

  const isEmpty = !lessons || lessons.length === 0;

  return (
    <div className="min-h-[70vh] bg-slate-50 px-4 py-6">
      <div className="mx-auto max-w-6xl">
       
        {/* Header */}
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
           
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Manage Lessons
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Review, manage, and moderate all lessons created by users.
            </p>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="mt-10 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 rounded-full border-4 border-slate-200 border-t-primary animate-spin" />
              <p className="text-sm text-slate-500">Loading lessons...</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && isEmpty && (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              No lessons found
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              When users start creating lessons, they will appear here for
              moderation and management.
            </p>
          </div>
        )}

        {/* Desktop table */}
        {!loading && !isEmpty && (
          <>
            <div className="mt-4 hidden md:block">
              <div className="overflow-x-auto rounded-xl bg-white shadow-sm border border-slate-100">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Title
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Author
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Visibility
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Access
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Featured
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Reviewed
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Created
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {lessons.map((l) => (
                      <tr key={l._id} className="border-t border-slate-100">
                        <td className="px-4 py-2 max-w-xs truncate font-medium text-slate-900">
                          {l.title}
                        </td>
                        <td className="px-4 py-2 text-slate-700">
                          {l.creatorName || "Unknown"}
                        </td>
                        <td className="px-4 py-2 capitalize text-slate-700">
                          {l.visibility}
                        </td>
                        <td className="px-4 py-2 capitalize text-slate-700">
                          {l.accessLevel}
                        </td>
                        <td className="px-4 py-2">
                          {l.isFeatured ? (
                            <span className="inline-flex px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800">
                              Featured
                            </span>
                          ) : (
                            <span className="inline-flex px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-600">
                              Normal
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {l.isReviewed ? (
                            <span className="text-xs font-medium text-emerald-600">
                              Reviewed
                            </span>
                          ) : (
                            <span className="text-xs text-slate-500">
                              Not reviewed
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-xs text-slate-500">
                          {l.createdAt
                            ? new Date(l.createdAt).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => handleDelete(l._id)}
                            className="text-xs font-medium text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile cards */}
            <div className="mt-4 space-y-3 md:hidden">
              {lessons.map((l) => (
                <div
                  key={l._id}
                  className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h2 className="text-sm font-semibold text-slate-900">
                        {l.title}
                      </h2>
                      <p className="mt-1 text-xs text-slate-500">
                        By {l.creatorName || "Unknown"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                    <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 capitalize text-slate-700">
                      {l.visibility}
                    </span>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 capitalize ${
                        l.accessLevel === "premium"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {l.accessLevel}
                    </span>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 ${
                        l.isFeatured
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {l.isFeatured ? "Featured" : "Normal"}
                    </span>
                    <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
                      {l.isReviewed ? "Reviewed" : "Not reviewed"}
                    </span>
                  </div>

                  <div className="mt-3 text-xs text-slate-500">
                    Created:{" "}
                    {l.createdAt
                      ? new Date(l.createdAt).toLocaleDateString()
                      : "-"}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-3 text-xs">
                    <button
                      onClick={() => handleDelete(l._id)}
                      className="font-medium text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
