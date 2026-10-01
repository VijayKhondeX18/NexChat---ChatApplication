import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import api from "../services/api";
function Logout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
       api.post("/chatApp/auth/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <button
      onClick={handleLogout}
      title="Logout"
      className="p-2 text-gray-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition cursor-pointer flex items-center justify-center"
    >
      <FiLogOut size={22} />
    </button>
  );
}

export default Logout;