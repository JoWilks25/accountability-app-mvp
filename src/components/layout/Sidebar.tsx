import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Target, 
  Users, 
  Settings, 
  Calendar, 
  BarChart 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  const { currentPod } = useApp();

  const navItems = [
    { name: 'Goals', path: '/', icon: <Target className="w-5 h-5" /> },
    { name: 'Check-ins', path: '/check-ins', icon: <Calendar className="w-5 h-5" /> },
    { name: 'Pod Members', path: '/members', icon: <Users className="w-5 h-5" /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart className="w-5 h-5" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-20 flex flex-col flex-shrink-0 pt-16 h-full duration-200 lg:flex transition-width overflow-y-auto ${
        isOpen ? 'w-64' : 'w-0 lg:w-64'
      }`}
    >
      <div className="relative flex flex-col flex-1 min-h-0 pt-0 bg-gray-800 border-r border-gray-200">
        <div className="flex flex-col flex-1 pt-5 pb-4">
          <div className="px-3">
            <div className="rounded-lg bg-gray-700 p-3 mb-6">
              <h2 className="text-white font-medium mb-1">Current Pod</h2>
              {currentPod ? (
                <div>
                  <p className="text-gray-200 text-sm font-bold">{currentPod.name}</p>
                  <p className="text-gray-400 text-xs">{currentPod.members.length} members</p>
                </div>
              ) : (
                <p className="text-gray-300 text-sm">No active pod</p>
              )}
            </div>
          </div>
          <div className="flex flex-col px-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md group transition-colors ${
                  (location.pathname === '/' && item.path === '/') || 
                  (location.pathname !== '/' && location.pathname === item.path)
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="p-3 mt-auto border-t border-gray-700">
          <Link
            to="/help"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
          >
            <span className="mr-3">❓</span>
            <span>Help & Support</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;