import { User, Announcement, Event, Poll, Feedback, Settings, UserRole } from '../types';

// Generate random ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Generate mock users
export const generateMockUsers = (): User[] => {
  return [
    {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 'mod-1',
      name: 'Moderator User',
      email: 'moderator@example.com',
      role: 'moderator',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 'student-1',
      name: 'Student One',
      email: 'student1@example.com',
      role: 'student',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 'student-2',
      name: 'Student Two',
      email: 'student2@example.com',
      role: 'student',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
    }
  ];
};

// Generate mock announcements
export const generateMockAnnouncements = (): Announcement[] => {
  return [
    {
      id: 'ann-1',
      title: 'Welcome to the New Dashboard',
      content: 'We are excited to introduce our new dashboard with improved features and user experience.',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
      createdBy: 'admin-1',
      important: true
    },
    {
      id: 'ann-2',
      title: 'System Maintenance',
      content: 'The system will be under maintenance this weekend. Please save your work before Friday evening.',
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      createdBy: 'mod-1',
      important: false
    }
  ];
};

// Generate mock events
export const generateMockEvents = (): Event[] => {
  return [
    {
      id: 'event-1',
      title: 'Annual Conference',
      description: 'Join us for our annual conference where we will discuss the latest trends and technologies.',
      date: new Date(Date.now() + 86400000 * 10).toISOString(), // 10 days in future
      location: 'Convention Center',
      createdBy: 'admin-1',
      attendees: ['student-1']
    },
    {
      id: 'event-2',
      title: 'Workshop on Modern Web Development',
      description: 'Learn about the latest web development techniques and tools in this hands-on workshop.',
      date: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days in future
      location: 'Tech Hub',
      createdBy: 'mod-1',
      attendees: ['student-1', 'student-2']
    }
  ];
};

// Generate mock polls
export const generateMockPolls = (): Poll[] => {
  return [
    {
      id: 'poll-1',
      question: 'What feature would you like to see next?',
      options: [
        { id: 'opt-1', text: 'Dark Mode', votes: ['student-1'] },
        { id: 'opt-2', text: 'Mobile App', votes: [] },
        { id: 'opt-3', text: 'More Integrations', votes: ['student-2'] }
      ],
      createdBy: 'admin-1',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
      endDate: new Date(Date.now() + 86400000 * 4).toISOString(), // 4 days in future
      isActive: true
    }
  ];
};

// Generate mock feedback
export const generateMockFeedback = (): Feedback[] => {
  return [
    {
      id: 'feedback-1',
      content: 'The dashboard is very intuitive and easy to use. I especially like the calendar integration.',
      rating: 5,
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(), // 4 days ago
      createdBy: 'student-1'
    },
    {
      id: 'feedback-2',
      content: 'I found the poll feature a bit confusing. It would be nice to have more instructions.',
      rating: 3,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
      createdBy: 'student-2'
    }
  ];
};

// Generate mock settings
export const generateMockSettings = (userId: string): Settings => {
  return {
    id: `settings-${userId}`,
    userId,
    darkMode: false,
    emailNotifications: true,
    pushNotifications: false,
    language: 'en'
  };
};

// Initialize mock data in localStorage
export const initializeMockData = () => {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(generateMockUsers()));
  }
  
  if (!localStorage.getItem('announcements')) {
    localStorage.setItem('announcements', JSON.stringify(generateMockAnnouncements()));
  }
  
  if (!localStorage.getItem('events')) {
    localStorage.setItem('events', JSON.stringify(generateMockEvents()));
  }
  
  if (!localStorage.getItem('polls')) {
    localStorage.setItem('polls', JSON.stringify(generateMockPolls()));
  }
  
  if (!localStorage.getItem('feedback')) {
    localStorage.setItem('feedback', JSON.stringify(generateMockFeedback()));
  }
  
  // Settings are per user, so we don't pre-populate them
};