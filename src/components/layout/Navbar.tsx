import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import Avatar from '../ui/Avatar';
import { useApp } from '../../context/AppContext';

interface NavbarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, isSidebarOpen }) => {
  const { currentUser } = useApp();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  const notificationsRef = useRef<HTMLDivElement>(null);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Handle notifications dropdown
      if (
        notificationsRef.current && 
        !notificationsRef.current.contains(event.target as Node) &&
        !notificationButtonRef.current?.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }

      // Handle profile dropdown
      if (
        profileRef.current && 
        !profileRef.current.contains(event.target as Node) &&
        !profileButtonRef.current?.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-30 transition-all duration-300">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              aria-expanded={isSidebarOpen}
              className="p-2 rounded-md lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              {isSidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
              <span className="sr-only">Toggle sidebar</span>
            </button>
            <Link to="/" className="flex ml-2 md:mr-24">
              <span className="self-center text-xl font-bold text-teal-600 whitespace-nowrap">
                AccountaPod
              </span>
            </Link>
          </div>
          <div className="flex items-center">
            <div className="relative flex items-center mr-4">
              <button
                ref={notificationButtonRef}
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
              </button>
              {isNotificationsOpen && (
                <div 
                  ref={notificationsRef}
                  className="absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  style={{ top: '100%' }}
                >
                  <div className="p-3 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
                  </div>
                  <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                    <div className="p-3 border-b border-gray-200">
                      <div className="flex items-center">
                        <Avatar
                          size="sm"
                          src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150"
                          alt="Samantha Lee"
                        />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            Samantha commented on your milestone
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            2 hours ago
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center">
                        <Avatar
                          size="sm"
                          src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150"
                          alt="Michael Chen"
                        />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            Weekly check-in reminder
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Yesterday
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 border-t border-gray-200">
                    <Link
                      to="/notifications"
                      className="block text-center text-sm font-medium text-teal-600 hover:text-teal-800"
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                ref={profileButtonRef}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex text-sm bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <span className="sr-only">Open user menu</span>
                <Avatar
                  src={currentUser?.avatarUrl}
                  alt={currentUser?.name || "User"}
                  size="sm"
                />
              </button>
              {isProfileOpen && (
                <div 
                  ref={profileRef}
                  className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Your Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
    </nav>
  );
};

export default Navbar;
