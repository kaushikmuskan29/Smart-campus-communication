import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { getAnnouncements, getEvents, getPolls, getFeedback } from '../utils/localStorage';
import { Bell, Calendar, BarChart, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Announcement, Event, Poll, Feedback } from '../types';

const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [stats, setStats] = useState({
    totalAnnouncements: 0,
    totalEvents: 0,
    totalPolls: 0,
    totalFeedback: 0
  });
  
  const isAdmin = currentUser?.role === 'admin';
  const isModerator = currentUser?.role === 'moderator';
  const isStudent = currentUser?.role === 'student';
  
  useEffect(() => {
    // Load data from localStorage
    const allAnnouncements = getAnnouncements();
    const allEvents = getEvents();
    const allPolls = getPolls();
    const allFeedback = getFeedback();
    
    // Set data
    setAnnouncements(allAnnouncements.slice(0, 3));
    setEvents(allEvents.slice(0, 3));
    setPolls(allPolls.slice(0, 3));
    
    // Only show feedback to admins/moderators
    if (isAdmin || isModerator) {
      setFeedback(allFeedback.slice(0, 3));
    }
    
    // Update stats
    setStats({
      totalAnnouncements: allAnnouncements.length,
      totalEvents: allEvents.length,
      totalPolls: allPolls.length,
      totalFeedback: allFeedback.length
    });
  }, [isAdmin, isModerator]);
  
  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                <Bell className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Announcements</p>
                <h3 className="text-xl font-semibold mt-1">{stats.totalAnnouncements}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
                <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Events</p>
                <h3 className="text-xl font-semibold mt-1">{stats.totalEvents}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900">
                <BarChart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Polls</p>
                <h3 className="text-xl font-semibold mt-1">{stats.totalPolls}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900">
                <MessageSquare className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Feedback</p>
                <h3 className="text-xl font-semibold mt-1">{stats.totalFeedback}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Content section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Announcements */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Announcements</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigateTo('/announcements')}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {announcements.length > 0 ? (
              <ul className="space-y-4">
                {announcements.map((announcement) => (
                  <li key={announcement.id} className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0">
                    <h4 className="font-medium flex items-center">
                      {announcement.important && (
                        <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      )}
                      {announcement.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {announcement.content}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No announcements yet.</p>
            )}
          </CardContent>
        </Card>
        
        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Events</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigateTo('/events')}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {events.length > 0 ? (
              <ul className="space-y-4">
                {events.map((event) => (
                  <li key={event.id} className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0">
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(event.date).toLocaleDateString()}
                      <span className="mx-2">•</span>
                      {event.location}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No upcoming events.</p>
            )}
          </CardContent>
        </Card>
        
        {/* Active Polls */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Active Polls</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigateTo('/polls')}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {polls.length > 0 ? (
              <ul className="space-y-4">
                {polls.map((poll) => (
                  <li key={poll.id} className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0">
                    <h4 className="font-medium">{poll.question}</h4>
                    <div className="mt-2 space-y-1">
                      {poll.options.map((option) => {
                        const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes.length, 0);
                        const percentage = totalVotes === 0 ? 0 : Math.round((option.votes.length / totalVotes) * 100);
                        
                        return (
                          <div key={option.id}>
                            <div className="flex items-center justify-between text-sm">
                              <span>{option.text}</span>
                              <span className="text-xs text-gray-500">{percentage}% ({option.votes.length})</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                              <div 
                                className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      Ends on {new Date(poll.endDate).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No active polls.</p>
            )}
          </CardContent>
        </Card>
        
        {/* Recent Feedback (admin/moderator only) */}
        {(isAdmin || isModerator) && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Feedback</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigateTo('/feedback')}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {feedback.length > 0 ? (
                <ul className="space-y-4">
                  {feedback.map((item) => (
                    <li key={item.id} className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0">
                      <div className="flex items-center mb-2">
                        <div className="flex-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg 
                                key={i} 
                                className={`w-4 h-4 ${i < item.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.content}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No feedback yet.</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;