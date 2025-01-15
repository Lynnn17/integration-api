import { useContext } from "react";
import Dropdown from "./Dropdown";
import { AuthContext } from "../context/AuthContext";
import ThemeSwitcher from "./ThemeSwitcher";

const Navbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-blue-600 text-white">
      <h1 className="text-xl font-bold">My App</h1>
      <div className="relative flex flex-col lg:flex-row items-center">
        <div>
          <ThemeSwitcher />
        </div>
        <div className="flex items-center">
          <span className="mr-4 uppercase">{user?.fullName}</span>
          <Dropdown />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
