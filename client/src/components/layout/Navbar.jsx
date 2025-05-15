import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContextProvider';
import { User, LogOut, Lock, ChevronDown } from 'lucide-react';


const Navbar = () => {
    const{loginStatus, userLogout}= useContext(AuthContext)
    

    const [dropdownOpen, setDropdownOpen] = useState(false);
  
    const toggleDropdown = () => {
      setDropdownOpen(!dropdownOpen);
    };
    
    const closeDropdown = () => {
      setDropdownOpen(false);
    };
  return (

    <nav className="bg-blue-600 text-white shadow-md">
    <div className="container mx-auto px-4 py-3">
      <div className="flex justify-between items-center">
        <div className="text-xl font-bold cursor-pointer">Store Rating System</div>
        
        <div className="flex items-center space-x-4">
          {loginStatus.isLoggedIn ? (
            <>
              <div className="hidden md:flex">
              {loginStatus.role === 'user' && (
                    <Link to="/stores" className="hover:text-blue-200">Stores</Link>
                  )}
                {loginStatus.role === 'system_administrator' && (
                    <Link to="/admin" className="hover:text-blue-200">System Administrator</Link>
                  )}
                {loginStatus.role === 'store_owner' && (
                    <Link to="/store_owner" className="hover:text-blue-200">Store Owner</Link>
                  )}
              </div>
              
              {/* User dropdown menu */}
              <div className="relative">
                <button 
                  onClick={toggleDropdown}
                  className="flex items-center space-x-1 focus:outline-none hover:text-blue-200"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-white text-blue-600 rounded-full">
                    <User size={18} />
                  </div>
                  <span className="hidden md:inline">{loginStatus.userName}</span>
                  <ChevronDown size={16} className={`transition-transform duration-200 ${dropdownOpen ? 'transform rotate-180' : ''}`} />
                </button>
                
                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="block px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                      <p className="font-bold">Signed in as</p>
                      <p className="truncate">{loginStatus.userName}</p>
                    </div>
                    
                    <Link 
                      to="#" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={closeDropdown}
                    >
                      <User size={16} className="mr-2" />
                      My Profile
                    </Link>
                    
                    <Link 
                      to="/update-password" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={closeDropdown}
                    >
                      <Lock size={16} className="mr-2" />
                      Update Password
                    </Link>
                    
                    <div className="border-t border-gray-100">
                      <button 
                        onClick={() => {
                          userLogout();
                          closeDropdown();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                      >
                        <LogOut size={16} className="mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200">Login</Link>
              <Link 
                to="/signup" 
                className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
    
    {/* Backdrop to close dropdown when clicking outside */}
    {dropdownOpen && (
      <div 
        className="fixed inset-0 z-10" 
        onClick={closeDropdown}
      ></div>
    )}
  </nav>
  );
};

export default Navbar;