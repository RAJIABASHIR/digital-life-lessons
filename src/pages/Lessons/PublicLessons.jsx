import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance.js";
import LessonCard from "../../components/LessonCard.jsx";
import { CATEGORIES, EMOTIONAL_TONES } from "../../utils/constants.js";
import Pagination from "../../components/Pagination.jsx";
import useAuth from "../../context/useAuth";
import { useNavigate } from "react-router-dom";

export default function PublicLessons() {
  const [lessons, setLessons] = useState([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [tone, setTone] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const { isPremium } = useAuth();
  const navigate = useNavigate();

  const loadLessons = async () => {
    try {
      const res = await axiosInstance.get("/lessons/public", {
        params: {
          page,
          limit,
          search: query,
          category,
          emotionalTone: tone,
          sort,
        },
      });

      setLessons(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadLessons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sort]);

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            
            <div>
              <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <span className="text-lg leading-none">←</span>
            </button>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Public Life Lessons
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Browse reflections shared by the community.
              </p>
            </div>
          </div>
        </div>

        
        <div className="mb-6 rounded-2xl bg-white px-4 py-3 shadow-sm md:px-5 md:py-4">
          <div className="flex flex-wrap items-center gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or keyword..."
              className="flex-1 min-w-[200px] rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">All Emotional Tones</option>
              {EMOTIONAL_TONES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="newest">Newest</option>
              <option value="most-saved">Most Saved</option>
            </select>

<button
  type="button"
  onClick={() => {
    setPage(1);
    loadLessons();
  }}
  className="ml-auto inline-flex items-center rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500"
>
  Apply Filters
</button>

          </div>
        </div>

        
        {lessons.length === 0 ? (
          <p className="text-sm text-slate-500">No lessons found.</p>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              {lessons.map((lesson) => {
                const isBlurred =
                  lesson.accessLevel === "premium" && !isPremium;
                return (
                  <LessonCard
                    key={lesson._id}
                    lesson={lesson}
                    isBlurred={isBlurred}
                    onClickPricing={() => navigate("/pricing")}
                    onClickDetails={() => navigate(`/lessons/${lesson._id}`)}
                  />
                );
              })}
            </div>
            <div className="mt-6">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
