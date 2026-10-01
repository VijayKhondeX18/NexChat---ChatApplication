import { useState, useEffect, useRef } from "react";
import api from "../services/api";
import socket from "../services/socket";

function Messages({ user, selectedUser }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // ==========================================
  // CONNECT SOCKET + JOIN USER ROOM
  // ==========================================
  useEffect(() => {
    if (!user?._id) return;

    const joinRoom = () => {
      console.log("Joining socket room:", user._id);
      socket.emit("join", user._id);
    };

    if (!socket.connected) {
      socket.connect();
    } else {
      joinRoom();
    }

    socket.on("connect", joinRoom);

    return () => {
      socket.off("connect", joinRoom);
    };
  }, [user?._id]);

  // ==========================================
  // FETCH OLD MESSAGES
  // ==========================================
  useEffect(() => {
    if (!selectedUser?._id) {
      return;
    }

    const fetchMessages = async () => {
      setLoading(true);

      try {
        const token = localStorage.getItem("token");

        const res = await api.get(
          `/chatApp/messages/${selectedUser._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const fetchedMessages = res.data || [];

        setMessages((prev) => {
          const combined = [
            ...fetchedMessages,
            ...prev,
          ];

          const uniqueMessages = combined.filter(
            (message, index, array) =>
              index ===
              array.findIndex(
                (item) =>
                  String(item._id) ===
                  String(message._id)
              )
          );

          return uniqueMessages.sort(
            (a, b) =>
              new Date(a.createdAt || 0) -
              new Date(b.createdAt || 0)
          );
        });
      } catch (error) {
        console.error(
          "Error fetching message history:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedUser?._id]);

  // ==========================================
  // RECEIVE REAL-TIME MESSAGES
  // ==========================================
  useEffect(() => {
    const handleReceiveMessage = (newMessage) => {
      if (!selectedUser?._id || !user?._id) {
        return;
      }

      const senderId = String(
        newMessage.sender?._id ||
          newMessage.sender
      );

      const receiverId = String(
        newMessage.receiver?._id ||
          newMessage.receiver
      );

      const currentUserId = String(user._id);
      const selectedUserId = String(
        selectedUser._id
      );

      const isCurrentChat =
        (senderId === currentUserId &&
          receiverId === selectedUserId) ||
        (senderId === selectedUserId &&
          receiverId === currentUserId);

      if (!isCurrentChat) {
        return;
      }

      setMessages((prev) => {
        if (
          newMessage._id &&
          prev.some(
            (message) =>
              String(message._id) ===
              String(newMessage._id)
          )
        ) {
          return prev;
        }

        const updatedMessages = [
          ...prev,
          newMessage,
        ];

        return updatedMessages.sort(
          (a, b) =>
            new Date(a.createdAt || 0) -
            new Date(b.createdAt || 0)
        );
      });
    };

    socket.on(
      "receive_message",
      handleReceiveMessage
    );

    return () => {
      socket.off(
        "receive_message",
        handleReceiveMessage
      );
    };
  }, [selectedUser?._id, user?._id]);

  // ==========================================
  // AUTO SCROLL
  // ==========================================
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        Loading chat history...
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================
  return (
    <div className="flex flex-col space-y-3 min-h-full justify-end">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 my-auto text-sm">
          No messages yet. Say hi to{" "}
          {selectedUser?.name}!
        </div>
      ) : (
        messages.map((message) => {
          const senderId = String(
            message.sender?._id ||
              message.sender
          );

          const isMe =
            senderId === String(user?._id);

          const date = message.createdAt
            ? new Date(
                message.createdAt
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "";

          return (
            <div
              key={
                message._id ||
                `${message.sender}-${message.createdAt}`
              }
              className={`flex flex-col ${
                isMe
                  ? "items-end"
                  : "items-start"
              }`}
            >
              <div
                className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm shadow-md break-words ${
                  isMe
                    ? "bg-green-600 text-white rounded-br-none"
                    : "bg-slate-800 text-gray-100 rounded-bl-none border border-slate-700/50"
                }`}
              >
                {message.msg}
              </div>

              {date && (
                <span className="text-[10px] text-gray-500 mt-1 px-1">
                  {date}
                </span>
              )}
            </div>
          );
        })
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}

export default Messages;