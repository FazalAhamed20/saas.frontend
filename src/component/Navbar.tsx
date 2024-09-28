import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Home, Package, UserPlus, LogIn, Menu, X, LogOut } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { Player } from "@lottiefiles/react-lottie-player";
import nav from '../assets/images/inventory-management.png'
import { logout } from "../redux/actions/AuthActions";
import { useNavigate } from 'react-router-dom';

const NavLink = ({ href, icon: Icon, children, onClick }:any) => (
  <a
    href={href}
    onClick={onClick}
    className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white"
  >
    <Icon className="mr-2 h-4 w-4" />
    {children}
  </a>
);

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const isAdmin = useSelector((state: any) => state?.auth?.user?.user?.isAdmin);
  const userId = useSelector((state: any) => state?.auth?.user?.user?.UserId);
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout() as any);
    navigate("/", { replace: false });
    setShowDropdown(false);
  };

  return (
    <nav className={`w-full py-4 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img 
              src={nav}
              alt="Logo" 
              className="h-8 w-8 object-contain"
            />
            <h1 className="text-2xl font-bold">
              Inventory <span className="text-blue-500">Pro</span>
            </h1>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="flex items-center w-full px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white"
            >
              {darkMode ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            {userId ? (
              <>
                <NavLink href="/" icon={Home}>Home</NavLink>
                <NavLink href={isAdmin ? "/admintable" : "/home"} icon={Package}>
  Inventory
</NavLink>

                <div className="relative" ref={dropdownRef}  onClick={toggleDropdown}>
                  <Player
                    autoplay
                    loop
                    src="https://lottie.host/5e2373d3-cead-4a42-b2c9-4d0f46101331/zeLVmqrk6Z.json" 
                    style={{ height: "40px", width: "40px", cursor: "pointer" }}
                   
                  />
                  {showDropdown && (
                    <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                      <NavLink href="#" icon={LogOut} onClick={handleLogout}>Logout</NavLink>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <NavLink href="/signup" icon={UserPlus}>SignUp</NavLink>
                <NavLink href="/login" icon={LogIn}>Login</NavLink>
              </>
            )}
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden mt-4">
            {userId ? (
              <>
                <NavLink href="/" icon={Home}>Home</NavLink>
                <NavLink href="/inventory" icon={Package}>Inventory Table</NavLink>
                <NavLink href="#" icon={LogOut} onClick={handleLogout}>Logout</NavLink>
              </>
            ) : (
              <>
                <NavLink href="/signup" icon={UserPlus}>SignUp</NavLink>
                <NavLink href="/login" icon={LogIn}>Login</NavLink>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;