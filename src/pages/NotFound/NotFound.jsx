import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <h1 className="text-5xl font-bold mb-2">404</h1>
      <p className="text-slate-500 mb-4">The page you’re looking for doesn’t exist.</p>
      <Link
        to="/"
        className="px-4 py-2 rounded-md bg-primary text-white font-semibold"
      >
        Go Home
      </Link>
    </div>
  );
}