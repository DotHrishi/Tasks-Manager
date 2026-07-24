import { Link, useNavigate } from "react-router-dom";
import { PlusIcon, SearchIcon, LogOutIcon } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="w-full bg-black border-b border-gray-700">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-1 flex justify-start">
            <Link to="/" className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">Task Manager</h1>
            </Link>
          </div>

          <div className="flex-1 flex justify-center hidden sm:flex"></div>

          <div className="flex-1 flex justify-end items-center gap-4">
            {token ? (
              <>
                <Link
                  to="/create"
                  className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
                >
                  <PlusIcon className="h-4 w-4" />
                  New Task
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-red-700"
                >
                  <LogOutIcon className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-white hover:text-blue-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
