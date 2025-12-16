import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";

const Navbar = () => {
  const { firebaseUser, appUser, isPremium, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }, []);

  const handleLogout = async () => {
    await logout();
    setProfileOpen(false);
    setMobileOpen(false);
    navigate("/");
  };

  const closeMenus = () => {
    setMobileOpen(false);
    setProfileOpen(false);
  };
  const brand = (
    <Link to="/" onClick={closeMenus} className="flex items-center gap-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-fuchsia-500 text-sm font-bold text-white shadow-sm">
         DL
      </div>
      <span className="text-lg font-semibold tracking-tight">
        <span className="text-slate-900 dark:text-slate-50">Digital</span>{" "}
        <span className="text-slate-900 dark:text-slate-50">Life</span>{" "}
        <span className="text-violet-500 dark:text-violet-400">Lessons</span>
      </span>
    </Link>
  );
  const primaryLinks = (
    <>
      <NavLink
        to="/"
        onClick={closeMenus}
        className={({ isActive }) =>
          `block md:inline-flex md:px-3 text-sm font-medium transition-colors ${
            isActive ? "text-sky-400" : "text-slate-200 hover:text-white"
          }`
        }
      >
        Home
      </NavLink>

      <NavLink
        to="/public-lessons"
        onClick={closeMenus}
        className={({ isActive }) =>
          `block md:inline-flex md:px-3 text-sm font-medium transition-colors ${
            isActive ? "text-sky-400" : "text-slate-200 hover:text-white"
          }`
        }
      >
        Public Lessons
      </NavLink>

      {firebaseUser && (
        <>
          <button
            type="button"
            onClick={() => {
              navigate("/dashboard/add-lesson");
              closeMenus();
            }}
            className="block md:inline-flex md:px-3 text-left text-sm font-medium text-slate-200 hover:text-white transition-colors"
          >
            Add Lesson
          </button>

          <button
            type="button"
            onClick={() => {
              navigate("/dashboard/my-lessons");
              closeMenus();
            }}
            className="block md:inline-flex md:px-3 text-left text-sm font-medium text-slate-200 hover:text-white transition-colors"
          >
            My Lessons
          </button>

          
          {appUser?.role === "admin" && (
            <>
              <NavLink
                to="/dashboard/manage-users"
                onClick={closeMenus}
                className={({ isActive }) =>
                  `block md:inline-flex md:px-3 text-sm font-medium transition-colors ${
                    isActive ? "text-sky-400" : "text-slate-200 hover:text-white"
                  }`
                }
              >
                Manage Users
              </NavLink>

              <NavLink
                to="/dashboard/manage-lessons"
                onClick={closeMenus}
                className={({ isActive }) =>
                  `block md:inline-flex md:px-3 text-sm font-medium transition-colors ${
                    isActive ? "text-sky-400" : "text-slate-200 hover:text-white"
                  }`
                }
              >
                Manage Lessons
              </NavLink>
            </>
          )}
          {!isPremium ? (
            <button
              type="button"
              onClick={() => {
                navigate("/pricing");
                closeMenus();
              }}
              className="mt-3 w-full rounded-full bg-amber-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-sm hover:bg-amber-400
                         md:mt-0 md:w-auto md:px-12 md:py-2.5 md:text-sm"
            >
              Upgrade
            </button>
          ) : (
            <span className="mt-3 inline-flex items-center rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-slate-950 shadow-sm md:mt-0">
              Premium ⭐
            </span>
          )}
        </>
      )}
    </>
  );
  const authButtonsDesktop = !firebaseUser ? (
    <div className="flex items-center gap-2">
      <Link
        to="/login"
        onClick={closeMenus}
        className="px-3 py-1.5 rounded-full border border-slate-500 text-xs font-medium text-slate-100 hover:bg-slate-800"
      >
        Login
      </Link>
      <Link
        to="/register"
        onClick={closeMenus}
        className="px-3 py-1.5 rounded-full bg-sky-500 text-xs font-semibold text-white hover:bg-sky-400"
      >
        Signup
      </Link>
    </div>
  ) : (
    <div className="relative">
      <button
        type="button"
        onClick={() => setProfileOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-slate-500 px-3 py-1.5 hover:border-sky-500"
      >
        <div className="relative">
          <div className="rounded-full border border-sky-400/60 p-[2px]">
            <img
              src={
                firebaseUser.photoURL ||
                "https://lh3.googleusercontent.com/a/ACg8ocI0UmC_7Ip6vOTMmbuHY9GWqCNQ_TMweXHY6PBzcE4KUAKpmw=s576-c-mo-no"
              }
              alt="avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-xs font-semibold text-slate-100">
            {firebaseUser.displayName || appUser?.name || "Account"}
          </span>
        </div>
      </button>

      {profileOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-700 shadow-xl z-30">
          <div className="px-4 py-3 border-b border-slate-700">
            <p className="text-sm font-semibold text-slate-50">
              {firebaseUser.displayName || appUser?.name || "User"}
            </p>
            <p className="text-xs text-slate-400">{firebaseUser.email}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              navigate("/dashboard/profile");
              setProfileOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-xs text-slate-200 hover:bg-slate-800"
          >
            Profile
          </button>
          <button
            type="button"
            onClick={() => {
              navigate("/dashboard");
              setProfileOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-xs text-slate-200 hover:bg-slate-800"
          >
            Dashboard
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-slate-800"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
  const authButtonsMobile = !firebaseUser ? (
    <div className="flex flex-col gap-2">
      <Link
        to="/login"
        onClick={closeMenus}
        className="block w-full rounded-full border border-slate-500 px-3 py-1.5 text-center text-xs font-medium text-slate-100 hover:bg-slate-800"
      >
        Login
      </Link>
      <Link
        to="/register"
        onClick={closeMenus}
        className="block w-full rounded-full bg-sky-500 px-3 py-1.5 text-center text-xs font-semibold text-white hover:bg-sky-400"
      >
        Signup
      </Link>
    </div>
  ) : (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => {
          navigate("/dashboard/profile");
          closeMenus();
        }}
        className="block w-full text-left rounded-lg px-3 py-2 text-xs text-slate-100 hover:bg-slate-800"
      >
        Profile
      </button>
      <button
        type="button"
        onClick={() => {
          navigate("/dashboard");
          closeMenus();
        }}
        className="block w-full text-left rounded-lg px-3 py-2 text-xs text-slate-100 hover:bg-slate-800"
      >
        Dashboard
      </button>
      <button
        type="button"
        onClick={handleLogout}
        className="block w-full text-left rounded-lg px-3 py-2 text-xs text-red-400 hover:bg-slate-800"
      >
        Log out
      </button>
    </div>
  );

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 text-slate-100 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
        {brand}
        <div className="hidden flex-1 items-center justify-center md:flex">
          <div className="flex items-center gap-4">{primaryLinks}</div>
        </div>
        <div className="hidden items-center md:flex">
          {authButtonsDesktop}
        </div>
        <div className="flex flex-1 items-center justify-end gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="h-10 w-10 flex items-center justify-center rounded-2xl border border-slate-600 bg-slate-900 text-2xl text-slate-100"
          >
            ≡
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950">
          <div className="mx-auto max-w-6xl px-4 py-4 space-y-4">
            <div className="flex flex-col gap-3">{primaryLinks}</div>
            <div className="border-t border-slate-800 pt-3">
              {authButtonsMobile}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;