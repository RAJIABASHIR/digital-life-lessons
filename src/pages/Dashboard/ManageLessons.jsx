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

  const handleToggleFeatured = async (lessonId, isFeatured) => {
    try {
      await axiosInstance.patch(`/admin/lessons/${lessonId}/feature`, {
        isFeatured: !isFeatured,
      });
      toast.success(
        !isFeatured ? "Marked as featured" : "Removed from featured"
      );
      loadLessons();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update featured status");
    }
  };

  const handleMarkReviewed = async (lessonId) => {
    try {
      await axiosInstance.patch(`/admin/lessons/${lessonId}/review`, {
        isReviewed: true,
      });
      toast.success("Marked as reviewed");
      loadLessons();
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark as reviewed");
    }
  };

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

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Manage Lessons</h1>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-10 w-10 rounded-full border-4 border-slate-200 border-t-primary" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Author</th>
                <th className="px-4 py-2 text-left">Visibility</th>
                <th className="px-4 py-2 text-left">Access</th>
                <th className="px-4 py-2 text-left">Featured</th>
                <th className="px-4 py-2 text-left">Reviewed</th>
                <th className="px-4 py-2 text-left">Created</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((l) => (
                <tr key={l._id} className="border-t">
                  <td className="px-4 py-2 max-w-xs truncate">{l.title}</td>
                  <td className="px-4 py-2">{l.creatorName || "Unknown"}</td>
                  <td className="px-4 py-2 capitalize">{l.visibility}</td>
                  <td className="px-4 py-2 capitalize">{l.accessLevel}</td>
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
                      <span className="text-xs text-emerald-600">Reviewed</span>
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
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() =>
                        handleToggleFeatured(l._id, l.isFeatured || false)
                      }
                      className="text-xs text-primary"
                    >
                      {l.isFeatured ? "Unfeature" : "Make Featured"}
                    </button>
                    {!l.isReviewed && (
                      <button
                        onClick={() => handleMarkReviewed(l._id)}
                        className="text-xs text-emerald-600"
                      >
                        Mark Reviewed
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(l._id)}
                      className="text-xs text-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {lessons.length === 0 && !loading && (
                <tr>
                  <td
                    colSpan="8"
                    className="px-4 py-4 text-center text-slate-500"
                  >
                    No lessons found.
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