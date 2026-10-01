import Header from "./Header";
import SearchBox from "./SearchBox";
import User from "./User";
import Logout from "./Logout";
import { FiSettings, FiMessageCircle } from "react-icons/fi";

function Left({ user, selectedUser, setSelectedUser, searchTerm, setSearchTerm }) {
  return (
    <div className="w-[450px] min-w-[350px] h-screen flex">
      {/* Small Sidebar */}
      <div className="w-16 bg-slate-950 border-r border-slate-800 flex flex-col items-center py-5">
        {/* Profile Avatar */}
        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center font-bold text-slate-950 text-lg cursor-pointer">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>

        {/* Menu Icons */}
        <div className="mt-auto flex flex-col items-center gap-6 text-gray-400">
          <FiMessageCircle
            size={24}
            className="hover:text-green-500 cursor-pointer transition text-green-500"
          />

          <FiSettings
            size={24}
            className="hover:text-green-500 cursor-pointer transition"
          />
        </div>

        {/* Logout */}
        <div className="mb-4 mt-8">
          <Logout />
        </div>
      </div>

      {/* Main Sidebar */}
      <div className="flex-1 bg-slate-900 border-r border-slate-800 flex flex-col">
        <Header user={user} />
        <SearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <User
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          searchTerm={searchTerm}
        />
      </div>
    </div>
  );
}

export default Left;