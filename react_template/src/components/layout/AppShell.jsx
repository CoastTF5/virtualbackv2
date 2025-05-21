import React, { useState } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

function AppShell() {
  const { isAuthenticated, user } = useAuth();
  const { darkMode } = useTheme();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Redirect to login if not authenticated
  if (!isAuthenticated && location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`h-screen flex flex-col ${darkMode ? 'bg-dark-bg text-dark-text' : 'bg-white text-gray-800'}`}>
      <Navbar onMenuClick={toggleSidebar} user={user} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} currentPath={location.pathname} />
        
        <main className={`flex-1 overflow-auto pb-16 transition-all ${sidebarOpen ? 'ml-0 md:ml-64' : 'ml-0'} ${darkMode ? 'bg-dark-surface' : 'bg-gray-50'}`}>
          <div className="container mx-auto px-4 py-6">
            <Outlet />
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}

export default AppShell;