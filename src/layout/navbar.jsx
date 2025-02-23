import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { fetchData } from "../../firebase";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fireStatus, setFireStatus] = useState("");
  useEffect(() => {
    fetchData("/fireStatus", (data) => setFireStatus(data));
  }, []);
  return (
    <nav className="bg-gray-900 text-white shadow-lg font-heading font-bold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <p className="text-red-500 text-2xl" />
            <h1 className="text-xl font-bold">Fire Detection</h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-red-400 transition">
              Dashboard
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none"
            >
              {isOpen ? (
                <FiX className="text-2xl" />
              ) : (
                <FiMenu className="text-2xl" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 p-4 space-y-3">
          <Link to="/" className="block hover:text-red-400 transition">
            Dashboard
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
