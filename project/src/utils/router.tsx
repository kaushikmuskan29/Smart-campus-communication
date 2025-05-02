import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import DashboardPage from '../pages/DashboardPage';
import ProfilePage from '../pages/ProfilePage';
import SettingsPage from '../pages/SettingsPage';
import AnnouncementsPage from '../pages/AnnouncementsPage';
import EventsPage from '../pages/EventsPage';
import PollsPage from '../pages/PollsPage';
import FeedbackPage from '../pages/FeedbackPage';
import CreatePage from '../pages/CreatePage';
import { useAuth } from '../context/AuthContext';

export const Router: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const { currentUser } = useAuth();
  
  const isAdmin = currentUser?.role === 'admin';
  const isModerator = currentUser?.role === 'moderator';
  
  useEffect(() => {
    const handleRouteChange = () => {
      setCurrentPath(window.location.pathname);
    };
    
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);
  
  const renderPage = () => {
    switch (currentPath) {
      case '/':
        return <DashboardPage />;
      case '/profile':
        return <ProfilePage />;
      case '/settings':
        return <SettingsPage />;
      case '/announcements':
        return <AnnouncementsPage />;
      case '/events':
        return <EventsPage />;
      case '/polls':
        return <PollsPage />;
      case '/feedback':
        // Only admin/moderator can see all feedback
        if (isAdmin || isModerator) {
          return <FeedbackPage />;
        }
        // Students can only submit feedback
        return <FeedbackPage />;
      case '/create':
        // Only admin/moderator can create
        if (isAdmin || isModerator) {
          return <CreatePage />;
        }
        return <DashboardPage />;
      default:
        // Redirect to dashboard for unknown paths
        window.history.pushState({}, '', '/');
        return <DashboardPage />;
    }
  };
  
  return (
    <Layout>
      {renderPage()}
    </Layout>
  );
};