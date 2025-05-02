import React from 'react';
import { useLocation } from 'react-router-dom';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const NavLink: React.FC<NavLinkProps> = ({ href, children, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === href;
  
  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        window.history.pushState({}, '', href);
        // Dispatch a new popstate event to trigger route change
        window.dispatchEvent(new PopStateEvent('popstate'));
        if (onClick) onClick();
      }}
      className={`flex items-center px-4 py-2 text-sm rounded-md transition-colors ${
        isActive
          ? 'bg-blue-50 text-blue-600 font-medium'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      {children}
    </a>
  );
};