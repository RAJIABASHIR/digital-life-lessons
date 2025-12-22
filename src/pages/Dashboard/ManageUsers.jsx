import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadUsers = async () => {
      try {
        const res = await axiosInstance.get("/admin/users");
        if (isMounted) {
          setUsers(res.data.data || []);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          toast.error("Failed to load users");
        }
      }
    };

    loadUsers();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axiosInstance.patch(`/admin/users/${userId}/role`, { role: newRole });
      toast.success("User role updated");
      const res = await axiosInstance.get("/admin/users");
      setUsers(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.success(" update role");
    }
  };

  return (
    <div className="min-h-[70vh] bg-slate-50 px-4 py-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-4 text-2xl font-extrabold tracking-tight text-slate-900">
          Manage Users
        </h1>

        {/* Desktop table */}
        <div className="hidden md:block">
          <div className="overflow-x-auto rounded-xl bg-white shadow-sm border border-slate-100">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Email
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Role
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Total Lessons
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-t border-slate-100">
                    <td className="px-4 py-2">
                      {u.displayName || u.name || "N/A"}
                    </td>
                    <td className="px-4 py-2">{u.email}</td>
                    <td className="px-4 py-2 capitalize">{u.role}</td>
                    <td className="px-4 py-2">{u.totalLessons || 0}</td>
                    <td className="px-4 py-2">
                      {u.role !== "admin" && (
                        <button
                          onClick={() => handleRoleChange(u._id, "admin")}
                          className="text-xs text-primary hover:underline"
                        >
                          Make Admin
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-4 text-center text-slate-500"
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile cards */}
        <div className="mt-4 space-y-3 md:hidden">
          {users.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm text-slate-500">
              No users found.
            </div>
          ) : (
            users.map((u) => (
              <div
                key={u._id}
                className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900">
                      {u.displayName || u.name || "N/A"}
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">{u.email}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium capitalize text-slate-700">
                    {u.role}
                  </span>
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  Total lessons:{" "}
                  <span className="font-medium text-slate-700">
                    {u.totalLessons || 0}
                  </span>
                </p>

                <div className="mt-3 flex flex-wrap gap-3 text-xs">
                  {u.role !== "admin" && (
                    <button
                      onClick={() => handleRoleChange(u._id, "admin")}
                      className="font-medium text-primary"
                    >
                      Make Admin
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
