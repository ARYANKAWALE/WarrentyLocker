import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import {
  Dumbbell,
  House,
  Apple,
  TrendingUp,
  Settings,
  Zap,
  Menu,
  X,
  LogOut,
  UserCircle,
} from "lucide-react";

function Hero() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };

  const navLinks = [
    { to: "/home", label: "Home", Icon: House },
    { to: "/workout", label: "Workout", Icon: Dumbbell },
    { to: "/nutrition", label: "Nutrition", Icon: Apple },
    { to: "/progress", label: "Progress", Icon: TrendingUp },
    { to: "/setting", label: "Settings", Icon: Settings },
  ];

  return (
    <div className="border-b border-separator bg-surface-container-lowest sticky top-0 z-50">
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between font-medium relative">
        
        {/* Brand Logo */}
        <Link to="/home" className="flex flex-row items-center gap-2.5 shrink-0 group">
          <Zap
            size={36}
            className="text-[#FFFFFF] bg-[#2B7FFF] p-1.5 rounded-xl shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300"
          />
          <h1 className="text-2xl font-bold tracking-tight text-on-surface group-hover:text-blue-600 transition-colors">QuickLog</h1>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <ul className="flex flex-row gap-8 items-center text-secondary">
            {navLinks.map(({ to, label, Icon }) => (
              <li key={to} className="list-none">
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `relative flex flex-row items-center gap-2 text-base font-semibold pb-1.5 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:transition-transform after:duration-300 after:ease-out ${
                      isActive
                        ? "text-blue-600 after:scale-x-100 after:bg-blue-600"
                        : "text-secondary hover:text-on-surface after:scale-x-0 after:bg-blue-600 hover:after:scale-x-100"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={20} className={isActive ? "active-link" : "text-secondary"} />
                      <span>{label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container border border-separator">
                <UserCircle size={20} className="text-primary" />
                <span className="text-sm font-semibold text-on-surface">{user?.username}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl hover:bg-red-500/10 text-secondary hover:text-red-500 transition-colors duration-200 font-semibold cursor-pointer"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="px-5 py-2.5 rounded-xl hover:bg-surface-container text-secondary hover:text-on-surface transition-colors duration-200 font-semibold"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="rounded-xl bg-[#2B7FFF] px-5 py-2.5 text-white font-bold hover:bg-blue-600 active:scale-[0.98] transition-all duration-200 shadow-md shadow-blue-500/10"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Hamburger Menu Toggle (Mobile) */}
        <div className="flex md:hidden items-center">
          <button
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-xl border border-separator hover:bg-surface-container text-secondary hover:text-on-surface focus:outline-none transition-colors duration-200 cursor-pointer"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer (Absolute positioned) */}
        {isOpen && (
          <div className="absolute top-full left-0 w-full bg-surface-container-lowest border-b border-separator shadow-xl py-4 flex flex-col md:hidden animate-in fade-in slide-in-from-top-4 duration-200 z-50">
            <nav className="flex flex-col mb-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-6 py-3.5 text-secondary hover:text-on-surface font-semibold text-lg hover:bg-surface-container border-l-4 border-transparent hover:border-primary transition-all"
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>
            
            <div className="border-t border-gray-100 pt-4 px-6 flex flex-col gap-3">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-2 py-3 px-4 bg-surface-container rounded-2xl border border-separator">
                    <UserCircle size={20} className="text-primary" />
                    <span className="font-bold text-on-surface">{user?.username}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-center py-3 border border-red-500/20 rounded-2xl hover:bg-red-500/10 text-red-500 font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center py-3 border border-separator rounded-2xl hover:bg-surface-container text-secondary hover:text-on-surface font-bold transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center py-3 bg-[#2B7FFF] text-white rounded-2xl font-bold hover:bg-blue-600 shadow-md shadow-blue-500/10 transition-all"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}

      </header>
    </div>
  );
}

export default Hero;

