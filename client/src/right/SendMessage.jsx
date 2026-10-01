import { FiPaperclip } from "react-icons/fi";
import { BsEmojiSmile } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import { useState } from "react";
import socket from "../services/socket";

function SendMessage({ selectedUser, user }) {
  const [message, setMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();

    const text = message.trim();

    if (!text) return;

    if (!user?._id) {
      console.error("❌ User not found");
      return;
    }

    if (!selectedUser?._id) {
      console.error("❌ Receiver not selected");
      return;
    }

    console.log("Socket connected:", socket.connected);
    console.log("Sender:", user._id);
    console.log("Receiver:", selectedUser._id);

    if (!socket.connected) {
      console.error("❌ Socket is NOT connected");
      return;
    }

    const messageData = {
      sender: user._id,
      receiver: selectedUser._id,
      msg: text,
    };

    console.log("📤 Sending:", messageData);

    socket.emit("send_message", messageData);

    setMessage("");
  };

  return (
    <div className="h-20 bg-slate-900 border-t border-slate-800 flex items-center px-6 gap-4">
      <BsEmojiSmile className="text-2xl text-gray-400 cursor-pointer hover:text-yellow-400 transition" />

      <FiPaperclip className="text-2xl text-gray-400 cursor-pointer hover:text-green-500 transition" />

      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-3 flex-1"
      >
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 bg-slate-800 border border-slate-700/60 rounded-full px-5 py-3 outline-none text-white text-sm placeholder:text-gray-500 focus:border-green-500 transition"
        />

        <button
          type="submit"
          className="bg-green-500 p-3 rounded-full hover:bg-green-600 transition shadow-lg text-slate-950 flex items-center justify-center cursor-pointer"
        >
          <IoSend className="text-xl" />
        </button>
      </form>
    </div>
  );
}

export default SendMessage;