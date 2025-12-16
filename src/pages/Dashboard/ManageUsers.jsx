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
      toast.error("Failed to update role");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Manage Users</h1>
      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Total Lessons</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="px-4 py-2">{u.displayName || u.name || "N/A"}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2 capitalize">{u.role}</td>
                <td className="px-4 py-2">{u.totalLessons || 0}</td>
                <td className="px-4 py-2">
                  {u.role !== "admin" && (
                    <button
                      onClick={() => handleRoleChange(u._id, "admin")}
                      className="text-xs text-primary"
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
  );
}