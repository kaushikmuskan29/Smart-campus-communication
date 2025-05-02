import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Bell, Calendar, BarChart } from 'lucide-react';
import { Toast } from '../components/ui/Toast';

const CreatePage: React.FC = () => {
  const { currentUser } = useAuth();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const isAdmin = currentUser?.role === 'admin';
  const isModerator = currentUser?.role === 'moderator';
  
  // Redirect if not admin/moderator
  if (!isAdmin && !isModerator) {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
    return null;
  }
  
  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };
  
  return (
    <div>
      {showToast && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
      
      <h1 className="text-2xl font-bold mb-6">Create</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Create Announcement */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <Bell className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="mb-2">Announcement</CardTitle>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Create a new announcement for all users
            </p>
            <Button
              onClick={() => navigateTo('/announcements')}
              className="w-full"
            >
              Create Announcement
            </Button>
          </CardContent>
        </Card>
        
        {/* Create Event */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="mb-2">Event</CardTitle>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Schedule a new event for users to attend
            </p>
            <Button
              onClick={() => navigateTo('/events')}
              className="w-full"
            >
              Create Event
            </Button>
          </CardContent>
        </Card>
        
        {/* Create Poll */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
              <BarChart className="h-8 w-8 text-purple-600" />
            </div>
            <CardTitle className="mb-2">Poll</CardTitle>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Create a new poll to gather user feedback
            </p>
            <Button
              onClick={() => navigateTo('/polls')}
              className="w-full"
            >
              Create Poll
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatePage;