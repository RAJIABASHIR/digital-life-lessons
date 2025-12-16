import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { CATEGORIES, EMOTIONAL_TONES } from "../../utils/constants";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function MyFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [filters, setFilters] = useState({ category: "", tone: "" });

  useEffect(() => {
    let isMounted = true;
    const loadFavorites = async () => {
      try {
        const res = await axiosInstance.get("/favorites/my");
        if (isMounted) {
          setFavorites(res.data || []);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          toast.error("Failed to load favorites");
        }
      }
    };

    loadFavorites();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleRemove = async (fav) => {
    try {
      await axiosInstance.post(`/favorites/${fav.lesson._id}/toggle`);
      toast.success("Removed from favorites");
      setFavorites((prev) => prev.filter((f) => f._id !== fav._id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove favorite");
    }
  };

  const filtered = favorites.filter((f) => {
    const catOk = filters.category
      ? f.lesson?.category === filters.category
      : true;
    const toneOk = filters.tone
      ? f.lesson?.emotionalTone === filters.tone
      : true;
    return catOk && toneOk;
  });

  const isEmpty = favorites.length === 0;

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
              My Favorites
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              All the lessons you have saved for later reflection.
            </p>
          </div>

          
        </div>

        
        <div className="mb-4 flex flex-wrap gap-3">
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, category: e.target.value }))
            }
            className="px-3 py-2 rounded-md border border-slate-300 text-sm bg-white"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={filters.tone}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, tone: e.target.value }))
            }
            className="px-3 py-2 rounded-md border border-slate-300 text-sm bg-white"
          >
            <option value="">All Emotional Tones</option>
            {EMOTIONAL_TONES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          {(filters.category || filters.tone) && (
            <button
              type="button"
              onClick={() => setFilters({ category: "", tone: "" })}
              className="inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold text-slate-700 border border-slate-300 bg-white hover:bg-slate-100"
            >
              Clear filters
            </button>
          )}
        </div>

        
        {isEmpty && (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              You haven’t favorited any lessons yet
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Browse public lessons and save the ones that resonate with you.
            </p>
            <div className="mt-4">
              <Link
                to="/public-lessons"
                className="inline-flex w-full items-center justify-center rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-sky-500 disabled:opacity-60 disabled:hover:bg-sky-600 sm:w-auto sm:px-6 sm:py-3"
              >
                Explore public lessons
              </Link>
            </div>
          </div>
        )}

        
        {!isEmpty && (
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
                        Category
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Tone
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((f) => (
                      <tr
                        key={f._id}
                        className="border-t border-slate-100 align-top"
                      >
                        <td className="px-4 py-2">
                          <div className="max-w-xs truncate font-medium text-slate-900">
                            {f.lesson?.title}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-slate-700">
                          {f.lesson?.category}
                        </td>
                        <td className="px-4 py-2 text-slate-700">
                          {f.lesson?.emotionalTone}
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex flex-wrap gap-3 text-xs">
                            <Link
                              to={`/lessons/${f.lesson?._id}`}
                              className="text-primary hover:underline"
                            >
                              Details
                            </Link>
                            <button
                              onClick={() => handleRemove(f)}
                              className="text-red-600 hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-4 py-4 text-center text-slate-500"
                        >
                          No favorites found with current filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            
            <div className="mt-4 space-y-3 md:hidden">
              {filtered.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm text-slate-500">
                  No favorites found with current filters.
                </div>
              ) : (
                filtered.map((f) => (
                  <div
                    key={f._id}
                    className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100"
                  >
                    <h2 className="text-sm font-semibold text-slate-900">
                      {f.lesson?.title}
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      {f.lesson?.category} · {f.lesson?.emotionalTone}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-3 text-xs">
                      <Link
                        to={`/lessons/${f.lesson?._id}`}
                        className="font-medium text-primary"
                      >
                        Details
                      </Link>
                      <button
                        onClick={() => handleRemove(f)}
                        className="font-medium text-red-600"
                      >
                        Remove
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