import { useState, useEffect } from "react";
import api from "../services/api";
function User({ selectedUser, setSelectedUser, searchTerm }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get("/chatApp/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUsers(response.data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes((searchTerm || "").toLowerCase()) ||
    u.email?.toLowerCase().includes((searchTerm || "").toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar text-white divide-y divide-slate-800/50">
      {loading ? (
        <div className="p-5 text-center text-gray-400 text-sm">Loading users...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="p-5 text-center text-gray-400 text-sm">No users found</div>
      ) : (
        filteredUsers.map((user) => {
          const isSelected = selectedUser?._id === user._id;

          return (
            <div
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`flex items-center gap-3.5 px-5 py-3.5 cursor-pointer transition ${
                isSelected
                  ? "bg-slate-800 border-l-4 border-green-500"
                  : "hover:bg-slate-800/50"
              }`}
            >
              <div className="w-11 h-11 rounded-full bg-green-500 flex-shrink-0 flex items-center justify-center text-slate-950 text-base font-bold shadow">
                {user.name?.charAt(0)?.toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-gray-100 text-sm truncate">
                  {user.name}
                </h2>
                <p className="text-xs text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default User;