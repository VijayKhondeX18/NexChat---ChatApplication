import { FaUserCircle } from "react-icons/fa";
import { FiPhone, FiVideo, FiMoreVertical } from "react-icons/fi";

function ChatHeader({ selectedUser }) {
  return (
    <div className="h-20 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        {selectedUser?.name ? (
          <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center font-bold text-slate-950 text-xl shadow">
            {selectedUser.name.charAt(0).toUpperCase()}
          </div>
        ) : (
          <FaUserCircle className="text-5xl text-green-500" />
        )}

        <div>
          <h2 className="text-white text-lg font-semibold">
            {selectedUser ? selectedUser.name : "Select a user"}
          </h2>
          <p className="text-xs text-green-400 font-medium">
            Online
          </p>
        </div>
      </div>

      <div className="flex gap-5 text-gray-400">
        <FiPhone className="text-xl cursor-pointer hover:text-green-500 transition" />
        <FiVideo className="text-xl cursor-pointer hover:text-green-500 transition" />
        <FiMoreVertical className="text-xl cursor-pointer hover:text-green-500 transition" />
      </div>
    </div>
  );
}

export default ChatHeader;