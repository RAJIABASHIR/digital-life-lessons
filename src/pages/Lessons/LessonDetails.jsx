import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import useAuth from "../../context/useAuth";
import toast from "react-hot-toast";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  FacebookIcon,
  LinkedinIcon,
} from "react-share";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);
const XIconCircle = () => (
  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
    X
  </div>
);

export default function LessonDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, isPremium, appUser } = useAuth();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLesson = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/lessons/${id}`);
        const { lesson: data } = res.data;

        if (data.accessLevel === "premium" && !isPremium) {
          navigate("/pricing", { replace: true });
          return;
        }

        setLesson(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load lesson");
      } finally {
        setLoading(false);
      }
    };

    loadLesson();
  }, [id, isPremium, navigate]);

  const handleLike = async () => {
    if (!isLoggedIn) {
      toast("Please log in to like");
      return;
    }
    try {
      const res = await axiosInstance.post(`/lessons/${lesson._id}/like`);
      setLesson((prev) => ({ ...prev, likesCount: res.data.likesCount }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to like lesson");
    }
  };

  const handleFavorite = async () => {
    if (!isLoggedIn) {
      toast("Please log in to save favorites");
      return;
    }
    try {
      const res = await axiosInstance.post("/favorites/toggle", {
        lessonId: lesson._id,
      });

      const favorited = res.data.favorited;
      const favoritesCount = res.data.favoritesCount;

      toast.success(
        favorited ? "Saved to favorites" : "Removed from favorites"
      );
      setLesson((prev) => ({
        ...prev,
        favoritesCount,
      }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to update favorite");
    }
  };

  const handleReport = async () => {
    if (!isLoggedIn) {
      toast("Please log in to report");
      return;
    }

    const { value: reason } = await MySwal.fire({
      title: "Report Lesson",
      input: "select",
      inputOptions: {
        "Inappropriate Content": "Inappropriate Content",
        "Hate Speech or Harassment": "Hate Speech or Harassment",
        "Misleading or False Information": "Misleading or False Information",
        "Spam or Promotional Content": "Spam or Promotional Content",
        "Sensitive or Disturbing Content": "Sensitive or Disturbing Content",
        Other: "Other",
      },
      inputPlaceholder: "Select a reason",
      showCancelButton: true,
    });

    if (!reason) return;

    try {
      await axiosInstance.post(`/lessons/${lesson._id}/report`, { reason });
      toast.success("Lesson reported. Thank you.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to report lesson");
    }
  };

  const handleDelete = async () => {
    if (!isLoggedIn) {
      toast("Please log in to delete");
      return;
    }

    const result = await MySwal.fire({
      title: "Delete this lesson?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosInstance.delete(`/lessons/${lesson._id}`);
      toast.success("Lesson deleted");
      navigate("/dashboard/my-lessons");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete lesson");
    }
  };

  const handleEdit = () => {
    navigate(`/dashboard/edit-lesson/${lesson._id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900">
        <div className="h-10 w-10 rounded-full border-4 border-slate-300 border-t-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900">
        <p>Lesson not found.</p>
      </div>
    );
  }

  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "";
  const title = lesson.title || "Life Lesson";
  const createdAt = lesson.createdAt
    ? new Date(lesson.createdAt).toLocaleDateString()
    : null;

  const isOwner =
    appUser && lesson.creatorId && appUser._id === lesson.creatorId;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <span className="text-lg">←</span>
          <span>Back</span>
        </button>

        
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          
          <div className="w-full lg:w-[45%]">
            <div className="overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-md">
              {lesson.imageUrl ? (
                <img
                  src={lesson.imageUrl}
                  alt={lesson.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[16/9] items-center justify-center bg-gradient-to-tr from-indigo-400 via-fuchsia-400 to-sky-400 text-center text-sm text-white px-6">
                  No image provided for this lesson
                </div>
              )}
            </div>
          </div>

          
          <div className="w-full lg:flex-1">
            <div className="h-full rounded-3xl bg-white border border-slate-200 shadow-md p-6 sm:p-8 flex flex-col">
              
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  {lesson.title}
                </h1>

                <p className="mt-3 text-sm sm:text-base text-slate-600">
                  {lesson.category || "Life Lesson"} •{" "}
                  {lesson.emotionalTone || "Mixed Emotions"} •{" "}
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium uppercase tracking-wide ml-1 text-slate-700">
                    {lesson.visibility || "public"}
                  </span>
                  <span className="ml-2 inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-emerald-700">
                    {lesson.accessLevel === "premium" ? "Premium" : "Free"}
                  </span>
                </p>

                {createdAt && (
                  <p className="mt-1 text-xs text-slate-500">
                    Shared on {createdAt}
                  </p>
                )}
              </div>

              
              <div className="mt-5 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full overflow-hidden bg-slate-200 border border-slate-300">
                  {lesson.creatorPhoto ? (
                    <img
                      src={lesson.creatorPhoto}
                      alt={lesson.creatorName || "Creator"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-slate-700">
                      {(lesson.creatorName || "?")
                        .slice(0, 1)
                        .toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wide text-slate-500">
                    Creator
                  </span>
                  <span className="text-sm font-medium text-slate-800">
                    {lesson.creatorName || "Anonymous"}
                  </span>
                </div>
              </div>

              
              <div className="mt-6 flex-1">
                <p className="text-sm sm:text-base leading-relaxed text-slate-700 whitespace-pre-line">
                  {lesson.description ||
                    "No description has been added for this lesson yet."}
                </p>
              </div>

              
              <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-600">
                <span>
                  ❤️ Likes:{" "}
                  <span className="font-semibold">
                    {lesson.likesCount ?? 0}
                  </span>
                </span>
                <span>
                  🔖 Favorites:{" "}
                  <span className="font-semibold">
                    {lesson.favoritesCount ?? 0}
                  </span>
                </span>
                {typeof lesson.reportsCount === "number" && (
                  <span className="text-slate-500">
                    🚩 Reports:{" "}
                    <span className="font-semibold">
                      {lesson.reportsCount}
                    </span>
                  </span>
                )}
              </div>

              
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleFavorite}
                    className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-slate-800"
                  >
                    🔖 Save to Favorites
                  </button>
                  <button
                    onClick={handleLike}
                    className="inline-flex items-center rounded-full bg-rose-500 px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-rose-400"
                  >
                    ❤️ Like ({lesson.likesCount ?? 0})
                  </button>
                  <button
                    onClick={handleReport}
                    className="inline-flex items-center rounded-full border border-rose-300 bg-rose-50 px-4 py-2 text-xs sm:text-sm font-medium text-rose-600 hover:bg-rose-100"
                  >
                    🚩 Report Lesson
                  </button>
                </div>

                {(isOwner || appUser?.role === "admin") && (
                  <div className="flex gap-2 sm:gap-3">
                    <button
                      onClick={handleEdit}
                      className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-indigo-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              
              <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4">
                <span className="text-xs font-medium text-slate-500">
                  Share this lesson:
                </span>
                <FacebookShareButton url={shareUrl} quote={title}>
                  <FacebookIcon size={32} round />
                </FacebookShareButton>
                <TwitterShareButton url={shareUrl} title={title}>
                  <XIconCircle />
                </TwitterShareButton>
                <LinkedinShareButton url={shareUrl} title={title}>
                  <LinkedinIcon size={32} round />
                </LinkedinShareButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

