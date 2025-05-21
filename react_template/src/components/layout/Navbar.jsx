import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from '../search/SearchBar';
import AIWandSearch from '../search/AIWandSearch';
import ThemeToggle from '../common/ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

function Navbar({ onMenuClick, user }) {
  const { logout } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAIWandOpen, setIsAIWandOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <nav className={`${darkMode ? 'bg-dark-surface' : 'bg-gray-900'} text-white shadow`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={onMenuClick}
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-400">Virtual Backlot</span>
            </Link>
          </div>

          {/* Search bar */}
          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <SearchBar />
          </div>

          {/* Right side actions */}
          <div className="flex items-center">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* AI Wand button */}
            <button
              onClick={() => setIsAIWandOpen(true)}
              className="p-2 mx-2 rounded-full text-gray-400 hover:text-blue-400 hover:bg-gray-800"
              title="AI Wand Search"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 4V2m0 14v-2M8 9h2M20 9h2M17.8 11.8L19 13M15 9h0m2.8-2.8L19 5M3 21l9-9M12.2 6.2L11 5" />
              </svg>
            </button>

            {/* User profile dropdown */}
            <div className="ml-3 relative">
              <button
                onClick={toggleProfileMenu}
                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                  {user?.avatar || user?.name?.[0] || '?'}
                </div>
              </button>

              {/* Profile dropdown */}
              {isProfileOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                    <div className="block px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                      <div className="font-medium">{user?.name || 'Guest User'}</div>
                      <div className="text-gray-400 text-xs">{user?.role || 'No role'}</div>
                    </div>
                    <Link
                      to="/gallery"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      My Gallery
                    </Link>
                    <Link
                      to="/analytics"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Analytics
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="md:hidden px-4 pb-3">
        <SearchBar />
      </div>

      {/* AI Wand modal */}
      {isAIWandOpen && (
        <AIWandSearch onClose={() => setIsAIWandOpen(false)} />
      )}
    </nav>
  );
}

export default Navbar;