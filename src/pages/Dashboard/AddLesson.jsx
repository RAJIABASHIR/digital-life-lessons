import { useMemo, useState } from "react";
import axios from "../../utils/axiosInstance";
import useAuth from "../../context/useAuth";
import toast from "react-hot-toast";
import Lottie from "lottie-react";
import successAnimation from "../../assets/lottie/success.json";
import { Link } from "react-router-dom";

const AddLesson = () => {
  const { isPremium, refetchAppUser } = useAuth();

  const [showLottie, setShowLottie] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    emotionalTone: "",
    imageUrl: "",
    visibility: "public",
    accessLevel: "free",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const canSubmit = useMemo(() => {
    return (
      form.title.trim() &&
      form.description.trim() &&
      form.category &&
      form.emotionalTone
    );
  }, [form]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await axios.post("/lessons", form);
      await refetchAppUser();
      toast.success("Lesson added successfully");
      setShowLottie(true);

      setForm({
        title: "",
        description: "",
        category: "",
        emotionalTone: "",
        imageUrl: "",
        visibility: "public",
        accessLevel: "free",
      });

      setTimeout(() => setShowLottie(false), 2500);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add lesson");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <Link
            to="/dashboard/my-lessons"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100 self-center sm:self-auto"
          >
            <span className="mr-1 text-lg">←</span>
            
          </Link>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        <div className="mb-6 sm:mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
         
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Add New Life Lesson
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              Share a story, insight, or realization that could help others.
            </p>
          </div>

          
        </div>

        
        {showLottie && (
          <div className="mx-auto mb-6 flex justify-center">
            <div className="w-40 sm:w-52">
              <Lottie animationData={successAnimation} loop={false} />
            </div>
          </div>
        )}

        
        <div className="flex justify-center">
          <div className="w-full">
            <div className="p-[2px] rounded-2xl bg-gradient-to-r from-sky-500 to-violet-600 shadow-lg">
              <div className="rounded-2xl bg-white px-4 py-6 sm:px-8 sm:py-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Title
                    </label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 px-3 sm:px-4 py-2.5 sm:py-3 text-sm outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
                      placeholder="Give your lesson a short title"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Full Description / Story / Insight
                    </label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 px-3 sm:px-4 py-2.5 sm:py-3 h-36 sm:h-40 resize-none text-sm outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
                      placeholder="Write the full story and the key takeaway..."
                      required
                    />
                  </div>

                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Category
                      </label>
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 px-3 sm:px-4 py-2.5 sm:py-3 bg-white text-sm outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
                        required
                      >
                        <option value="">Select category</option>
                        <option>Personal Growth</option>
                        <option>Career</option>
                        <option>Relationships</option>
                        <option>Mindset</option>
                        <option>Health & Wellness</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Emotional Tone
                      </label>
                      <select
                        name="emotionalTone"
                        value={form.emotionalTone}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 px-3 sm:px-4 py-2.5 sm:py-3 bg-white text-sm outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                        required
                      >
                        <option value="">Select tone</option>
                        <option>Motivational</option>
                        <option>Sad</option>
                        <option>Realization</option>
                        <option>Gratitude</option>
                      </select>
                    </div>
                  </div>

                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Image URL{" "}
                      <span className="text-slate-400">(optional)</span>
                    </label>
                    <input
                      name="imageUrl"
                      value={form.imageUrl}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 px-3 sm:px-4 py-2.5 sm:py-3 text-sm outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
                      placeholder="https://..."
                    />
                  </div>

                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Privacy
                      </label>
                      <select
                        name="visibility"
                        value={form.visibility}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 px-3 sm:px-4 py-2.5 sm:py-3 bg-white text-sm outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
                      >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Access Level{" "}
                        {!isPremium && (
                          <span className="text-slate-400">
                            (Premium locked)
                          </span>
                        )}
                      </label>
                      <select
                        name="accessLevel"
                        value={form.accessLevel}
                        onChange={handleChange}
                        disabled={!isPremium}
                        className="w-full rounded-xl border border-slate-200 px-3 sm:px-4 py-2.5 sm:py-3 bg-white text-sm outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-400"
                      >
                        <option value="free">Free</option>
                        <option value="premium">Premium</option>
                      </select>

                      {!isPremium && (
                        <p className="mt-2 text-xs text-slate-500">
                          Upgrade to Premium to create premium lessons.
                        </p>
                      )}
                    </div>
                  </div>

                  
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
                    <button
                      type="submit"
                      disabled={saving || !canSubmit}
                      className="inline-flex items-center justify-center rounded-xl px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:hover:bg-indigo-600 shadow"
                    >
                      {saving ? "Saving..." : "Save Lesson"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="mt-6 text-xs sm:text-sm text-slate-500">
              Tip: Keep your lesson specific and end with a clear takeaway.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLesson;