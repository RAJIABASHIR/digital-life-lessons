import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { CATEGORIES, EMOTIONAL_TONES } from "../../utils/constants";
import toast from "react-hot-toast";

export default function UpdateLesson() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await axiosInstance.get(`/lessons/${id}`);
        setLesson(res.data.lesson);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load lesson");
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setLesson(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { title, description, category, emotionalTone, imageUrl, visibility, accessLevel } =
        lesson;
      const payload = {
        title,
        description,
        category,
        emotionalTone,
        imageUrl,
        visibility,
        accessLevel
      };
      await axiosInstance.patch(`/lessons/${id}`, payload);
      toast.success("Lesson updated");
      navigate("/dashboard/my-lessons");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update lesson");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!lesson) return <p>Lesson not found</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold mb-4">Update Lesson</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-xl shadow-sm">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            name="title"
            value={lesson.title || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={lesson.description || ""}
            onChange={handleChange}
            rows={5}
            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="category"
              value={lesson.category || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md border border-slate-300"
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Emotional Tone</label>
            <select
              name="emotionalTone"
              value={lesson.emotionalTone || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md border border-slate-300"
            >
              {EMOTIONAL_TONES.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input
            name="imageUrl"
            value={lesson.imageUrl || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md border border-slate-300"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Visibility</label>
            <select
              name="visibility"
              value={lesson.visibility || "public"}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md border border-slate-300"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Access Level</label>
            <select
              name="accessLevel"
              value={lesson.accessLevel || "free"}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md border border-slate-300"
            >
              <option value="free">Free</option>
              <option value="premium">Premium</option>
            </select>
          </div>
        </div>

  <button className="px-4 py-2 rounded-md bg-violet-600 hover:bg-violet-500 text-white font-semibold shadow-sm">
  Save Changes
</button>
      </form>
    </div>
  );
}