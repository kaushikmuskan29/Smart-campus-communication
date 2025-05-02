import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, Users, FileText, Calendar, BarChart, Settings, LogOut, 
  MessageSquare, Bell, User, PlusCircle 
} from 'lucide-react';
import { NavLink } from '../ui/NavLink';

interface SideNavigationProps {
  isMobileMenuOpen: boolean;
  closeMobileMenu: () => void;
}

const SideNavigation: React.FC<SideNavigationProps> = ({ 
  isMobileMenuOpen, 
  closeMobileMenu 
}) => {
  const { currentUser, logout } = useAuth();
  const role = currentUser?.role || 'student';
  
  // Navigation items based on user role
  const getNavItems = () => {
    const items = [
      { 
        name: 'Dashboard', 
        icon: <LayoutDashboard className="w-5 h-5" />, 
        href: '/',
        roles: ['admin', 'moderator', 'student'] 
      },
      { 
        name: 'Announcements', 
        icon: <Bell className="w-5 h-5" />, 
        href: '/announcements',
        roles: ['admin', 'moderator', 'student'] 
      },
      { 
        name: 'Events', 
        icon: <Calendar className="w-5 h-5" />, 
        href: '/events',
        roles: ['admin', 'moderator', 'student'] 
      },
      { 
        name: 'Polls', 
        icon: <BarChart className="w-5 h-5" />, 
        href: '/polls',
        roles: ['admin', 'moderator', 'student'] 
      }
    ];
    
    // Add admin/moderator specific items
    if (role === 'admin' || role === 'moderator') {
      items.push(
        { 
          name: 'Create', 
          icon: <PlusCircle className="w-5 h-5" />, 
          href: '/create',
          roles: ['admin', 'moderator'] 
        },
        { 
          name: 'View Feedback', 
          icon: <MessageSquare className="w-5 h-5" />, 
          href: '/feedback',
          roles: ['admin', 'moderator'] 
        }
      );
    } else {
      // Add feedback option for students
      items.push({
        name: 'Submit Feedback',
        icon: <MessageSquare className="w-5 h-5" />,
        href: '/feedback',
        roles: ['student']
      });
    }
    
    // Add items available to all roles
    items.push(
      { 
        name: 'Profile', 
        icon: <User className="w-5 h-5" />, 
        href: '/profile',
        roles: ['admin', 'moderator', 'student'] 
      },
      { 
        name: 'Settings', 
        icon: <Settings className="w-5 h-5" />, 
        href: '/settings',
        roles: ['admin', 'moderator', 'student'] 
      }
    );
    
    return items.filter(item => item.roles.includes(role));
  };
  
  const navItems = getNavItems();
  
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
  };
  
  return (
    <>
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={closeMobileMenu}
        />
      )}
      
      {/* Sidebar navigation */}
      <aside 
        className={`fixed top-0 left-0 z-30 h-full w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo and header */}
          <div className="px-6 py-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-blue-600">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1 capitalize">{role} Portal</p>
          </div>
          
          {/* Navigation links */}
          <nav className="flex-1 px-4 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.name}>
                  <NavLink 
                    href={item.href}
                    onClick={isMobileMenuOpen ? closeMobileMenu : undefined}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Logout button */}
          <div className="px-4 py-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SideNavigation;