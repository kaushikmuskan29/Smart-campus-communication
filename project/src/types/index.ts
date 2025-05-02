export type UserRole = 'admin' | 'moderator' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  createdBy: string;
  important?: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  createdBy: string;
  attendees: string[];
}

export interface PollOption {
  id: string;
  text: string;
  votes: string[]; // User IDs who voted
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  createdBy: string;
  createdAt: string;
  endDate: string;
  isActive: boolean;
}

export interface Feedback {
  id: string;
  content: string;
  rating: number;
  createdAt: string;
  createdBy: string; // User ID
}

export interface Settings {
  id: string;
  userId: string;
  darkMode: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  language: string;
}