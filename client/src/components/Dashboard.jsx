import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../services/socket";
import Left from "../left/Left";
import Right from "../right/Right";

const Dashboard = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const userString = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  const user = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
      return;
    }

    if (!socket.connected) {
      socket.connect();
    }

    const onConnect = () => {
      console.log("Socket connected:", socket.id);
      if (user?._id) {
        socket.emit("join", user._id);
      }
    };

    socket.on("connect", onConnect);

    if (socket.connected && user?._id) {
      socket.emit("join", user._id);
    }

    return () => {
      socket.off("connect", onConnect);
    };
  }, [user?._id, token, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950">
      <Left
        user={user}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <Right
        user={user}
        selectedUser={selectedUser}
      />
    </div>
  );
};

export default Dashboard;