import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Dropdown = () => {
  const { logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const EditUser = () => {
    navigate("/edit-user");
    setIsOpen(false);
  };

  const Dashboard = () => {
    navigate("/");
    setIsOpen(false);
  };

  const Devisi = () => {
    navigate("/devisi");
    setIsOpen(false);
  };

  const hadleLogout = async () => {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    logout();
    setIsOpen(false);
    window.location.reload();
    navigate("/login");
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="px-4 py-2 bg-gray-800 text-white rounded"
      >
        Menu
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow z-20">
          <button
            onClick={EditUser}
            className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
          >
            Edit Profile
          </button>

          <button
            onClick={Dashboard}
            className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
          >
            Dashboard
          </button>

          <button
            onClick={Devisi}
            className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
          >
            Devisi
          </button>
          <button
            onClick={hadleLogout}
            className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
