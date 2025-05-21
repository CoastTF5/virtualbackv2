import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

function Sidebar({ isOpen, currentPath }) {
  const { user, hasPermission } = useAuth();
  const { darkMode } = useTheme();

  const navigation = [
    { name: 'Asset Library', href: '/', icon: 'M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4' },
    { name: 'My Gallery', href: '/gallery', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { name: 'Create Mood Board', href: '/moodboard/new', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  ];

  // Add analytics link if user has permission
  if (user && hasPermission('analytics')) {
    navigation.push({
      name: 'Analytics',
      href: '/analytics',
      icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
    });
  }

  return (
    <div className={`md:block ${darkMode ? 'bg-dark-surface' : 'bg-gray-800'} fixed md:sticky top-0 h-screen overflow-y-auto transition-all z-10 ${isOpen ? 'w-64' : 'w-0 md:w-64'}`}>
      <div className="w-64 h-full flex flex-col">
        {/* Sidebar content */}
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex-1 px-3 space-y-1">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-6">
              Navigation
            </p>

            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  currentPath === item.href
                    ? darkMode ? 'bg-dark-bg text-white' : 'bg-gray-900 text-white'
                    : darkMode ? 'text-gray-300 hover:bg-dark-bg hover:text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
              >
                <svg
                  className="text-gray-400 group-hover:text-gray-300 mr-3 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                </svg>
                {item.name}
              </Link>
            ))}
          </div>

          {/* Categories section */}
          <div className="px-3 mt-6">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Asset Categories
            </p>
            
            <Link
              to="/?category=environments"
              className={`text-gray-300 ${darkMode ? 'hover:bg-dark-bg' : 'hover:bg-gray-700'} hover:text-white group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500 mr-3"></span>
              Environments
            </Link>
            
            <Link
              to="/?category=vehicles"
              className={`text-gray-300 ${darkMode ? 'hover:bg-dark-bg' : 'hover:bg-gray-700'} hover:text-white group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
            >
              <span className="w-2 h-2 rounded-full bg-green-500 mr-3"></span>
              Vehicles
            </Link>
            
            <Link
              to="/?category=props"
              className={`text-gray-300 ${darkMode ? 'hover:bg-dark-bg' : 'hover:bg-gray-700'} hover:text-white group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
            >
              <span className="w-2 h-2 rounded-full bg-yellow-500 mr-3"></span>
              Props
            </Link>
            
            <Link
              to="/?category=characters"
              className={`text-gray-300 ${darkMode ? 'hover:bg-dark-bg' : 'hover:bg-gray-700'} hover:text-white group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
            >
              <span className="w-2 h-2 rounded-full bg-purple-500 mr-3"></span>
              Characters
            </Link>
            
            <Link
              to="/?category=promos"
              className={`text-gray-300 ${darkMode ? 'hover:bg-dark-bg' : 'hover:bg-gray-700'} hover:text-white group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500 mr-3"></span>
              Promos
            </Link>
          </div>
        </div>

        {/* User info section */}
        <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-700'} p-4`}>
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
              {user?.avatar || '?'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{user?.name || 'Guest'}</p>
              <p className="text-xs text-gray-400">{user?.role || 'Not logged in'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;