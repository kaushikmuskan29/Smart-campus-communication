import { Announcement, Event, Poll, Feedback, Settings, User } from '../types';

// Generic function to get items from localStorage
export const getItems = <T>(key: string): T[] => {
  const items = localStorage.getItem(key);
  return items ? JSON.parse(items) : [];
};

// Generic function to add an item to localStorage
export const addItem = <T extends { id: string }>(key: string, item: T): T => {
  const items = getItems<T>(key);
  const updatedItems = [...items, item];
  localStorage.setItem(key, JSON.stringify(updatedItems));
  return item;
};

// Generic function to update an item in localStorage
export const updateItem = <T extends { id: string }>(key: string, updatedItem: T): T | null => {
  const items = getItems<T>(key);
  const index = items.findIndex(item => item.id === updatedItem.id);
  
  if (index !== -1) {
    items[index] = updatedItem;
    localStorage.setItem(key, JSON.stringify(items));
    return updatedItem;
  }
  
  return null;
};

// Generic function to delete an item from localStorage
export const deleteItem = <T extends { id: string }>(key: string, id: string): boolean => {
  const items = getItems<T>(key);
  const filteredItems = items.filter(item => item.id !== id);
  
  if (filteredItems.length !== items.length) {
    localStorage.setItem(key, JSON.stringify(filteredItems));
    return true;
  }
  
  return false;
};

// Specific functions for each data type
export const getAnnouncements = (): Announcement[] => getItems<Announcement>('announcements');
export const addAnnouncement = (announcement: Announcement): Announcement => {
  if (!announcement.id) {
    announcement.id = Math.random().toString(36).substring(2, 15);
  }
  if (!announcement.createdAt) {
    announcement.createdAt = new Date().toISOString();
  }
  return addItem<Announcement>('announcements', announcement);
};
export const updateAnnouncement = (announcement: Announcement): Announcement | null => {
  return updateItem<Announcement>('announcements', announcement);
};
export const deleteAnnouncement = (id: string): boolean => {
  return deleteItem<Announcement>('announcements', id);
};

export const getEvents = (): Event[] => getItems<Event>('events');
export const addEvent = (event: Event): Event => {
  if (!event.id) {
    event.id = Math.random().toString(36).substring(2, 15);
  }
  if (!event.attendees) {
    event.attendees = [];
  }
  return addItem<Event>('events', event);
};
export const updateEvent = (event: Event): Event | null => {
  return updateItem<Event>('events', event);
};
export const deleteEvent = (id: string): boolean => {
  return deleteItem<Event>('events', id);
};

export const getPolls = (): Poll[] => getItems<Poll>('polls');
export const addPoll = (poll: Poll): Poll => {
  if (!poll.id) {
    poll.id = Math.random().toString(36).substring(2, 15);
  }
  if (!poll.createdAt) {
    poll.createdAt = new Date().toISOString();
  }
  if (!poll.options.every(option => option.id)) {
    poll.options = poll.options.map(option => ({
      ...option,
      id: option.id || Math.random().toString(36).substring(2, 15),
      votes: option.votes || []
    }));
  }
  return addItem<Poll>('polls', poll);
};
export const updatePoll = (poll: Poll): Poll | null => {
  return updateItem<Poll>('polls', poll);
};
export const deletePoll = (id: string): boolean => {
  return deleteItem<Poll>('polls', id);
};

export const getFeedback = (): Feedback[] => getItems<Feedback>('feedback');
export const addFeedback = (feedback: Feedback): Feedback => {
  if (!feedback.id) {
    feedback.id = Math.random().toString(36).substring(2, 15);
  }
  if (!feedback.createdAt) {
    feedback.createdAt = new Date().toISOString();
  }
  return addItem<Feedback>('feedback', feedback);
};

export const getSettings = (userId: string): Settings | null => {
  const allSettings = getItems<Settings>('settings');
  return allSettings.find(settings => settings.userId === userId) || null;
};
export const saveSettings = (settings: Settings): Settings => {
  if (!settings.id) {
    settings.id = `settings-${settings.userId}`;
  }
  
  const allSettings = getItems<Settings>('settings');
  const existingIndex = allSettings.findIndex(s => s.userId === settings.userId);
  
  if (existingIndex !== -1) {
    allSettings[existingIndex] = settings;
    localStorage.setItem('settings', JSON.stringify(allSettings));
  } else {
    addItem<Settings>('settings', settings);
  }
  
  return settings;
};

export const getUserById = (id: string): User | null => {
  const users = getItems<User>('users');
  return users.find(user => user.id === id) || null;
};