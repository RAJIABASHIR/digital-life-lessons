import { Outlet, NavLink } from "react-router-dom";
import useRole from "../hooks/useRole";

const DashboardLayout = () => {
  const { role } = useRole();

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-slate-900 text-white p-4 space-y-2">
        <h2 className="text-xl font-semibold mb-4">Dashboard</h2>



        {role === "admin" ? (
          <>
            <hr className="my-2" />
            <NavLink to="/dashboard" className="block">
              Admin Overview
            </NavLink>
            <NavLink to="/dashboard/admin/manage-users" className="block">
              Manage Users
            </NavLink>
            <NavLink to="/dashboard/admin/manage-lessons" className="block">
              Manage Lessons
            </NavLink>
            <NavLink to="/dashboard/admin/reported-lessons" className="block">
              Reported Lessons
            </NavLink>
            <NavLink to="/dashboard/profile" className="block">
              Admin Profile
            </NavLink>
          </>
        ) : <>
          <NavLink to="/dashboard" className="block">
            Overview
          </NavLink>
          <NavLink to="/dashboard/add-lesson" className="block">
            Add Lesson
          </NavLink>
          <NavLink to="/dashboard/my-lessons" className="block">
            My Lessons
          </NavLink>
          <NavLink to="/dashboard/my-favorites" className="block">
            My Favorites
          </NavLink>
          <NavLink to="/dashboard/profile" className="block">
            Profile
          </NavLink>
        </>}
      </aside>

      <section className="flex-1 p-6 bg-slate-50">
        <Outlet />
      </section>
    </div>
  );
};

export default DashboardLayout;