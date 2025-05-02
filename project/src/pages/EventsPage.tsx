import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ConfirmModal } from '../components/ui/Modal';
import { Toast } from '../components/ui/Toast';
import { getEvents, addEvent, updateEvent, deleteEvent, getUserById } from '../utils/localStorage';
import { Event } from '../types';
import { PlusCircle, Trash2, Calendar, MapPin, Users, Check } from 'lucide-react';

const EventsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  
  const isAdmin = currentUser?.role === 'admin';
  const isModerator = currentUser?.role === 'moderator';
  
  useEffect(() => {
    loadEvents();
  }, []);
  
  const loadEvents = () => {
    const allEvents = getEvents();
    // Sort by date, upcoming first
    const sorted = [...allEvents].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    setEvents(sorted);
  };
  
  const handleCreateEvent = () => {
    if (!currentUser) return;
    
    if (!title.trim() || !description.trim() || !date || !location.trim()) {
      setToastMessage('Please fill in all required fields');
      setToastType('error');
      setShowToast(true);
      return;
    }
    
    const newEvent: Event = {
      id: Math.random().toString(36).substring(2, 15),
      title,
      description,
      date,
      location,
      createdBy: currentUser.id,
      attendees: []
    };
    
    addEvent(newEvent);
    
    // Reset form & close modal
    resetForm();
    setIsCreateModalOpen(false);
    
    // Reload events
    loadEvents();
    
    // Show success message
    setToastMessage('Event created successfully!');
    setToastType('success');
    setShowToast(true);
  };
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDate('');
    setLocation('');
  };
  
  const confirmDelete = (id: string) => {
    setSelectedEventId(id);
    setIsDeleteModalOpen(true);
  };
  
  const handleDeleteEvent = () => {
    if (selectedEventId) {
      deleteEvent(selectedEventId);
      
      // Reset state
      setSelectedEventId(null);
      setIsDeleteModalOpen(false);
      
      // Reload events
      loadEvents();
      
      // Show success message
      setToastMessage('Event deleted successfully!');
      setToastType('success');
      setShowToast(true);
    }
  };
  
  const handleAttendEvent = (eventId: string) => {
    if (!currentUser) return;
    
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    const isAttending = event.attendees.includes(currentUser.id);
    let updatedAttendees;
    
    if (isAttending) {
      // Remove user from attendees
      updatedAttendees = event.attendees.filter(id => id !== currentUser.id);
    } else {
      // Add user to attendees
      updatedAttendees = [...event.attendees, currentUser.id];
    }
    
    const updatedEvent = {
      ...event,
      attendees: updatedAttendees
    };
    
    updateEvent(updatedEvent);
    loadEvents();
    
    setToastMessage(isAttending ? 'You are no longer attending this event' : 'You are now attending this event');
    setToastType('success');
    setShowToast(true);
  };
  
  const getAuthorName = (authorId: string) => {
    const user = getUserById(authorId);
    return user ? user.name : 'Unknown User';
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div>
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Events</h1>
        
        {(isAdmin || isModerator) && (
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            icon={<PlusCircle className="h-4 w-4" />}
          >
            Create Event
          </Button>
        )}
      </div>
      
      {events.length > 0 ? (
        <div className="space-y-4">
          {events.map((event) => {
            const isAttending = currentUser ? event.attendees.includes(currentUser.id) : false;
            const isPast = new Date(event.date) < new Date();
            
            return (
              <Card key={event.id} className={isPast ? 'opacity-75' : ''}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium flex items-center">
                        {event.title}
                        {isPast && (
                          <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                            Past
                          </span>
                        )}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(event.date)}
                        </div>
                        
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {event.location}
                        </div>
                        
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {event.attendees.length} attending
                        </div>
                      </div>
                      
                      <div className="mt-3 text-gray-600 dark:text-gray-300">
                        {event.description}
                      </div>
                      
                      <div className="mt-4">
                        <Button 
                          size="sm"
                          variant={isAttending ? 'success' : 'outline'}
                          onClick={() => handleAttendEvent(event.id)}
                          icon={isAttending ? <Check className="h-4 w-4" /> : undefined}
                          disabled={isPast}
                        >
                          {isAttending ? 'Attending' : 'Attend Event'}
                        </Button>
                      </div>
                    </div>
                    
                    {(isAdmin || (isModerator && event.createdBy === currentUser?.id)) && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="ml-4 text-red-600 hover:bg-red-50 mt-4 md:mt-0"
                        onClick={() => confirmDelete(event.id)}
                        icon={<Trash2 className="h-4 w-4" />}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">No events scheduled.</p>
          </CardContent>
        </Card>
      )}
      
      {/* Create Event Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Event"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Event title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Event description"
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date and Time *
            </label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location *
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Event location"
            />
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <Button 
            variant="outline" 
            onClick={() => setIsCreateModalOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateEvent}
          >
            Create
          </Button>
        </div>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteEvent}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
      />
    </div>
  );
};

export default EventsPage;