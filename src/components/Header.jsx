import appLogo from "@/assets/logo.png";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
              <img className="ml-1 text-white font-bold text-lg" src={appLogo} alt="Q" />
            </div>
            <span className="text-xl text-green-800 font-semibold text-gray-900">SmartQuitIoT</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium">Home</Link>
            <Link to="/dashboard" className="text-gray-700 hover:text-gray-900 font-medium">Dashboard</Link>
            <Link to="/resources" className="text-gray-700 hover:text-gray-900 font-medium">Resources</Link>
            <Link to="/community" className="text-gray-700 hover:text-gray-900 font-medium">Community</Link>
            <Link to="/news" className="text-gray-700 hover:text-gray-900 font-medium">News</Link>
            <Link to="/about" className="text-gray-700 hover:text-gray-900 font-medium">About</Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/login")} className="text-gray-700 hover:text-gray-900 font-medium px-4 py-2 cursor-pointer">
              Login
            </button>
            <button onClick={() => navigate("/login")} className="cursor-pointer bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-md transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
