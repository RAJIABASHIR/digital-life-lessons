import { Link } from "react-router-dom";
import useAuth from "../context/useAuth";

const FALLBACK_LESSON_IMAGE ="https://images.pexels.com/photos/4144222/pexels-photo-4144222.jpeg?auto=compress&cs=tinysrgb&w=1200";

const LessonCard = ({ lesson, compact = false }) => {
  const { isPremium } = useAuth();
  const accessPremium = lesson.accessLevel === "premium";
  const locked = accessPremium && !isPremium;

  const createdDate = lesson?.createdAt
    ? new Date(lesson.createdAt).toLocaleDateString()
    : "";

  const imageSrc = lesson.imageUrl || FALLBACK_LESSON_IMAGE;
  if (compact) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm">
        {locked && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-white/85 backdrop-blur rounded-2xl">
            <span className="text-sm font-medium text-slate-800">
              Premium Lesson
            </span>
            <Link
              to="/pricing"
              className="rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white hover:bg-amber-400"
            >
              Upgrade to view
            </Link>
          </div>
        )}

        <div className={locked ? "blur-[2px]" : ""}>
          <div className="flex">
            <div className="h-24 w-32 flex-shrink-0 overflow-hidden">
              <img
                src={imageSrc}
                alt={lesson.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex-1 p-3">
              <h3 className="text-sm font-semibold text-slate-900 line-clamp-1">
                {lesson.title}
              </h3>
              <p className="mt-1 text-[11px] text-gray-500">
                {lesson.category} · {lesson.emotionalTone}
              </p>

              <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500">
                <span>{createdDate}</span>
                <span className="capitalize">
                  {lesson.accessLevel ? `${lesson.accessLevel} access` : ""}
                </span>
              </div>

              <Link
                to={`/lessons/${lesson._id}`}
                className="mt-2 inline-block text-xs font-medium text-indigo-600 hover:text-indigo-500"
              >
                See Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  const content = (
    <>
      <h3 className="font-semibold mb-1 line-clamp-1">{lesson.title}</h3>
      <p className="text-xs text-gray-500 mb-1">
        {lesson.category} · {lesson.emotionalTone}
      </p>
      <p className="text-sm text-gray-600 line-clamp-3 mb-2">
        {lesson.description?.slice(0, 140) || "No description provided."}
        {lesson.description && lesson.description.length > 140 ? "…" : ""}
      </p>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{createdDate}</span>
        <span className="capitalize">
          {lesson.accessLevel ? `${lesson.accessLevel} access` : ""}
        </span>
      </div>
    </>
  );

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
      {locked && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-2xl bg-white/80 backdrop-blur">
          <span className="text-sm font-medium text-slate-800">
            Premium Lesson
          </span>
          <Link
            to="/pricing"
            className="rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white hover:bg-amber-400"
          >
            Upgrade to view
          </Link>
        </div>
      )}
      <div className={locked ? "blur-[2px]" : ""}>
        <div className="h-40 w-full overflow-hidden">
          <img
            src={imageSrc}
            alt={lesson.title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="p-3 sm:p-4">
          {content}
          <Link
            to={`/lessons/${lesson._id}`}
            className="mt-3 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            See Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LessonCard;