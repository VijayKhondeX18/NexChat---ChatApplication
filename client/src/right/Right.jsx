import ChatHeader from "./ChatHeader";
import Messages from "./Messages";
import SendMessage from "./SendMessage";
import { FiMessageSquare } from "react-icons/fi";

function Right({ user, selectedUser }) {
  if (!selectedUser) {
    return (
      <div className="flex-1 h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-8">
        <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center text-green-500 mb-4 shadow-xl">
          <FiMessageSquare size={38} />
        </div>
        <h2 className="text-2xl font-bold text-gray-200 mb-2">Welcome to NexChat</h2>
        <p className="text-gray-400 max-w-sm text-sm">
          Select a conversation from the sidebar on the left to start messaging.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <ChatHeader selectedUser={selectedUser} />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5">
        <Messages user={user} selectedUser={selectedUser} />
      </div>

      {/* Input */}
      <SendMessage user={user} selectedUser={selectedUser} />
    </div>
  );
}

export default Right;