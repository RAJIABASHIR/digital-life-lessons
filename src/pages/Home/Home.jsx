import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import HeroSlider from "../../components/HeroSlider";
import LessonCard from "../../components/LessonCard";

const DUMMY_TOP_CONTRIBUTORS = [
  {
    _id: "dummy-1",
    name: "Ada Lovelace",
    displayName: "Ada Lovelace",
    totalLessons: 18,
    photoURL: "/avatar-ali.png",
  },
  {
    _id: "dummy-2",
    name: "James Clear",
    displayName: "James Clear",
    totalLessons: 14,
    photoURL: "/avatar-anisha.png",
  },
  {
    _id: "dummy-3",
    name: "Brené Brown",
    displayName: "Brené Brown",
    totalLessons: 11,
    photoURL: "/avatar-richard.png",
  },
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [topContributors, setTopContributors] = useState([]);
  const [mostSaved, setMostSaved] = useState([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [f, c, s] = await Promise.all([
          axiosInstance.get("/lessons/public/featured"),
          axiosInstance.get("/lessons/public/top-contributors"),
          axiosInstance.get("/lessons/public", {
            params: { sort: "mostSaved", limit: 6 },
          }),
        ]);

        setFeatured(f.data?.data || []);
        setTopContributors(c.data?.data || []);
        setMostSaved(s.data?.data || []);
      } catch (err) {
        console.error("Failed to load home data", err);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen">
      <HeroSlider />

      
      <section className="bg-slate-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Featured Life Lessons
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-500">
                Handpicked reflections from the community to spark your own
                insights.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 sm:justify-end">
              <Link
                to="/public-lessons"
                className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Browse all public lessons
              </Link>
              <Link
                to="/dashboard/add-lesson"
                className="inline-flex items-center rounded-full bg-violet-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-violet-500"
              >
                + Add your lesson
              </Link>
            </div>
          </div>

          {featured && featured.length > 0 && (
            <div className="grid gap-6 md:grid-cols-3">
              {featured.map((lesson) => (
                <div
                  key={lesson._id}
                  className="group h-full rounded-2xl bg-white p-[1px] shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="h-full rounded-2xl bg-white p-4">
                    <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wide text-slate-400">
                      {lesson.category && (
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5">
                          {lesson.category}
                        </span>
                      )}
                      {lesson.accessLevel && (
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 ${
                            lesson.accessLevel === "premium"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {lesson.accessLevel === "premium" ? "Premium" : "Free"}
                        </span>
                      )}
                    </div>
                    <LessonCard lesson={lesson} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      
      <section className="bg-slate-100 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
              Why Learning From Life Matters
            </h2>
            <p className="mt-3 text-base md:text-lg text-slate-600">
              Transform your experiences into lasting wisdom.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Preserve Wisdom",
                text: "Never forget the valuable lessons you've learned throughout your journey.",
                icon: "💡",
                bg: "bg-sky-50",
                grad: "from-sky-500 to-sky-400",
              },
              {
                title: "Share & Inspire",
                text: "Help others by sharing your experiences and insights with the community.",
                icon: "👥",
                bg: "bg-fuchsia-50",
                grad: "from-fuchsia-500 to-pink-500",
              },
              {
                title: "Grow Together",
                text: "Learn from others' experiences and accelerate your personal growth.",
                icon: "❤️",
                bg: "bg-amber-50",
                grad: "from-orange-500 to-amber-500",
              },
              {
                title: "Track Progress",
                text: "Monitor your learning journey and see how far you've come.",
                icon: "🚀",
                bg: "bg-indigo-50",
                grad: "from-indigo-500 to-sky-500",
              },
            ].map((card) => (
              <div
                key={card.title}
                className={`flex flex-col items-center rounded-3xl ${card.bg} px-6 py-8 text-center shadow-sm`}
              >
                <div
                  className={`mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${card.grad} text-2xl text-white`}
                >
                  {card.icon}
                </div>
                <h3 className="mb-3 text-lg font-semibold text-slate-900">
                  {card.title}
                </h3>
                <p className="text-sm md:text-[15px] leading-relaxed text-slate-600">
                  {card.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="bg-gradient-to-r from-fuchsia-800 to-pink-700 py-16">
        <div className="mx-auto max-w-6xl px-4 text-center text-white">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-10">
            Life Lessons in Numbers
          </h2>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-violet-100 mb-10">
            Your stories, reflections, and insights are building a shared
            library of wisdom for everyone who visits Digital Life Lessons.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                label: "Public Lessons Shared",
                main: "1.2K+",
                sub: "Real stories available for anyone to explore.",
              },
              {
                label: "Favorites Saved",
                main: "8.4K",
                sub: "Moments readers chose to keep close.",
              },
              {
                label: "Active Contributors",
                main: "320+",
                sub: "People turning experience into wisdom.",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-3xl bg-white/10 px-6 py-8 sm:px-10 sm:py-10 shadow-xl backdrop-blur border border-white/20 flex flex-col items-center justify-center"
              >
                <p className="text-sm sm:text-base font-medium text-violet-100">
                  {item.label}
                </p>
                <p className="mt-3 text-3xl sm:text-4xl font-extrabold">
                  {item.main}
                </p>
                <p className="mt-2 text-xs sm:text-sm text-violet-100/80">
                  {item.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="bg-indigo-50 py-14">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="mb-6 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Most Saved Lessons
          </h2>

          {mostSaved && mostSaved.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mostSaved.map((lesson) => (
                <LessonCard
                  key={lesson._id || lesson.id}
                  lesson={lesson}
                  compact
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-600">
              No lessons have been saved yet. Save a lesson to see it appear
              here.
            </p>
          )}
        </div>
      </section>

      
      <section className="bg-violet-50 py-14">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="mb-6 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Top Contributors of the Week
          </h2>

          {(() => {
            const contributorsToShow =
              topContributors && topContributors.length > 0
                ? topContributors
                : DUMMY_TOP_CONTRIBUTORS;

            return (
              <ul className="space-y-4">
                {contributorsToShow.map((u, idx) => (
                  <li
                    key={u.uid || u._id || idx}
                    className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700">
                        {idx + 1}
                      </span>
                      <img
                        src={u.photoURL || "/avatar-anisha.png"}
                        alt={u.name || u.displayName || "User"}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {u.name || u.displayName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {u.totalLessons} lessons shared
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            );
          })()}
        </div>
      </section>
    </div>
  );
};

export default Home;
