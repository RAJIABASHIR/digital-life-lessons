import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import useAuth from "../../context/useAuth";
import toast from "react-hot-toast";

export default function Register() {
  const { registerEmailPassword, loginWithGoogle, refetchAppUser } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    photoURL: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validatePassword = (password) => {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasLength = password.length >= 6;
    if (!hasUpper) return "Password must contain at least one uppercase letter.";
    if (!hasLower) return "Password must contain at least one lowercase letter.";
    if (!hasLength) return "Password must be at least 6 characters.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validatePassword(form.password);
    if (error) {
      toast.error(error);
      return;
    }

    try {
      setLoading(true);
      await registerEmailPassword(form);
      toast.success("Account created successfully!");
      await refetchAppUser();
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      toast.success("Logged in with Google");
      await refetchAppUser();
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white px-8 py-8 shadow-xl border border-slate-100">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            Create Your Account
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Start capturing your life lessons today.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              placeholder="Your full name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Photo URL
            </label>
            <input
              name="photoURL"
              value={form.photoURL}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              placeholder="Optional profile photo link"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              placeholder="••••••••"
              required
            />
            <p className="mt-1 text-xs text-slate-500">
              Must contain uppercase, lowercase, and be at least 6 characters.
            </p>
          </div>
          <button
            disabled={loading}
            type="submit"
            className="mt-2 w-full rounded-full bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
        <div className="mt-5 flex items-center gap-2">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs uppercase tracking-wide text-slate-400">
            or
          </span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google logo"
            className="h-5 w-5"
          />
          <span>Continue with Google</span>
        </button>
        <p className="mt-5 text-xs text-center text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-violet-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}