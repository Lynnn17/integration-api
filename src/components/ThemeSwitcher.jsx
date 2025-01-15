import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { FaSun, FaMoon, FaDesktop } from "react-icons/fa";

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="p-4">
      <div className=" flex space-x-4">
        <button
          onClick={() => toggleTheme("light")}
          className={`p-2 rounded-full ${
            theme === "light"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          <FaSun size={20} />
        </button>
        <button
          onClick={() => toggleTheme("dark")}
          className={`p-2 rounded-full ${
            theme === "dark"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          <FaMoon size={24} />
        </button>
        <button
          onClick={() => toggleTheme("system")}
          className={`p-2 rounded-full ${
            theme === "system"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          <FaDesktop size={24} />
        </button>
      </div>
    </div>
  );
};

export default ThemeSwitcher;
