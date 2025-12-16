import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Link } from "react-router-dom";
import useAuth from "../../context/useAuth";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function MyLessons() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isPremium } = useAuth();

  const loadLessons = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/lessons/my/all");
      setLessons(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load your lessons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLessons();
  }, []);

  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: "Delete lesson?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosInstance.delete(`/lessons/${id}`);
      toast.success("Lesson deleted");
      setLessons((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete lesson");
    }
  };

  const handleToggleVisibility = async (lesson) => {
    try {
      const updated = {
        visibility: lesson.visibility === "public" ? "private" : "public",
      };
      const res = await axiosInstance.patch(`/lessons/${lesson._id}`, updated);
      toast.success("Visibility updated");
      setLessons((prev) =>
        prev.map((l) => (l._id === lesson._id ? res.data : l))
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update visibility");
    }
  };

  const handleToggleAccessLevel = async (lesson) => {
    if (!isPremium) {
      toast.error("Upgrade to Premium to change access level");
      return;
    }

    try {
      const updated = {
        accessLevel: lesson.accessLevel === "premium" ? "free" : "premium",
      };
        const res = await axiosInstance.patch(`/lessons/${lesson._id}`, updated);
      toast.success("Access level updated");
      setLessons((prev) =>
        prev.map((l) => (l._id === lesson._id ? res.data : l))
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update access level");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-4 border-slate-300 border-t-primary animate-spin" />
          <p className="text-sm text-slate-500">Loading your lessons...</p>
        </div>
      </div>
    );
  }

  const isEmpty = !lessons || lessons.length === 0;

  return (
    <div className="min-h-[70vh] bg-slate-50 px-4 py-6">
      <Link
            to="/dashboard"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100 self-start sm:self-auto"
          >
            <span className="mr-1 text-lg">←</span>
            
          </Link>
      <div className="mx-auto max-w-6xl">
          
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
         
          <div>
          
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              My Lessons
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage the lessons you have created, update their visibility, and
              track engagement.
            </p>
          </div>

          
        </div>

        
        {isEmpty && (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              You haven’t created any lessons yet
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Start by capturing your first life lesson. You can always edit or
              change visibility later.
            </p>
            <div className="mt-4">
              <Link
                to="/dashboard/add-lesson"
                className="inline-flex w-full items-center justify-center rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-sky-500 disabled:opacity-60 disabled:hover:bg-sky-600 sm:w-auto sm:px-6 sm:py-3"
              >
                Create your first lesson
              </Link>
            </div>
          </div>
        )}

        
        {!isEmpty && (
          <>
            
            <div className="hidden md:block mt-4">
              <div className="overflow-x-auto rounded-xl bg-white shadow-sm border border-slate-100">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Title
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Category
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Visibility
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Access Level
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Likes
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Favorites
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {lessons.map((lesson) => (
                      <tr key={lesson._id} className="border-t border-slate-100">
                        <td className="px-4 py-2 align-top">
                          <div className="max-w-xs truncate font-medium text-slate-900">
                            {lesson.title}
                          </div>
                        </td>
                        <td className="px-4 py-2 align-top text-slate-700">
                          {lesson.category}
                        </td>
                        <td className="px-4 py-2 align-top">
                          <button
                            onClick={() => handleToggleVisibility(lesson)}
                            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200"
                          >
                            {lesson.visibility}
                          </button>
                        </td>
                        <td className="px-4 py-2 align-top">
                          <button
                            onClick={() => handleToggleAccessLevel(lesson)}
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              lesson.accessLevel === "premium"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {lesson.accessLevel}
                          </button>
                        </td>
                        <td className="px-4 py-2 align-top text-slate-700">
                          {lesson.likesCount || 0}
                        </td>
                        <td className="px-4 py-2 align-top text-slate-700">
                          {lesson.favoritesCount || 0}
                        </td>
                        <td className="px-4 py-2 align-top">
                          <div className="flex flex-wrap gap-2 text-xs">
                            <Link
                              to={`/lessons/${lesson._id}`}
                              className="text-primary hover:underline"
                            >
                              Details
                            </Link>
                            <Link
                              to={`/dashboard/update-lesson/${lesson._id}`}
                              className="text-emerald-600 hover:underline"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(lesson._id)}
                              className="text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            
            <div className="mt-4 space-y-3 md:hidden">
              {lessons.map((lesson) => (
                <div
                  key={lesson._id}
                  className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-sm font-semibold text-slate-900">
                        {lesson.title}
                      </h2>
                      <p className="mt-1 text-xs text-slate-500">
                        {lesson.category}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <button
                        onClick={() => handleToggleVisibility(lesson)}
                        className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-700"
                      >
                        {lesson.visibility}
                      </button>
                      <button
                        onClick={() => handleToggleAccessLevel(lesson)}
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                          lesson.accessLevel === "premium"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {lesson.accessLevel}
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>❤️ {lesson.likesCount || 0} likes</span>
                    <span>🔖 {lesson.favoritesCount || 0} saves</span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-3 text-xs">
                    <Link
                      to={`/lessons/${lesson._id}`}
                      className="font-medium text-primary"
                    >
                      Details
                    </Link>
                    <Link
                      to={`/dashboard/update-lesson/${lesson._id}`}
                      className="font-medium text-emerald-600"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(lesson._id)}
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