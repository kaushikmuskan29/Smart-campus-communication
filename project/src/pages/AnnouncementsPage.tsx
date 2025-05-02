import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ConfirmModal } from '../components/ui/Modal';
import { Toast } from '../components/ui/Toast';
import { getAnnouncements, addAnnouncement, deleteAnnouncement, getUserById } from '../utils/localStorage';
import { Announcement } from '../types';
import { PlusCircle, Trash2, Bell } from 'lucide-react';

const AnnouncementsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  
  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [important, setImportant] = useState(false);
  
  const isAdmin = currentUser?.role === 'admin';
  const isModerator = currentUser?.role === 'moderator';
  
  useEffect(() => {
    loadAnnouncements();
  }, []);
  
  const loadAnnouncements = () => {
    const allAnnouncements = getAnnouncements();
    // Sort by date, newest first
    const sorted = [...allAnnouncements].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setAnnouncements(sorted);
  };
  
  const handleCreateAnnouncement = () => {
    if (!currentUser) return;
    
    if (!title.trim() || !content.trim()) {
      setToastMessage('Please fill in all required fields');
      setToastType('error');
      setShowToast(true);
      return;
    }
    
    const newAnnouncement: Announcement = {
      id: Math.random().toString(36).substring(2, 15),
      title,
      content,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.id,
      important
    };
    
    addAnnouncement(newAnnouncement);
    
    // Reset form & close modal
    setTitle('');
    setContent('');
    setImportant(false);
    setIsCreateModalOpen(false);
    
    // Reload announcements
    loadAnnouncements();
    
    // Show success message
    setToastMessage('Announcement created successfully!');
    setToastType('success');
    setShowToast(true);
  };
  
  const confirmDelete = (id: string) => {
    setSelectedAnnouncementId(id);
    setIsDeleteModalOpen(true);
  };
  
  const handleDeleteAnnouncement = () => {
    if (selectedAnnouncementId) {
      deleteAnnouncement(selectedAnnouncementId);
      
      // Reset state
      setSelectedAnnouncementId(null);
      setIsDeleteModalOpen(false);
      
      // Reload announcements
      loadAnnouncements();
      
      // Show success message
      setToastMessage('Announcement deleted successfully!');
      setToastType('success');
      setShowToast(true);
    }
  };
  
  const getAuthorName = (authorId: string) => {
    const user = getUserById(authorId);
    return user ? user.name : 'Unknown User';
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
        <h1 className="text-2xl font-bold">Announcements</h1>
        
        {(isAdmin || isModerator) && (
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            icon={<PlusCircle className="h-4 w-4" />}
          >
            Create Announcement
          </Button>
        )}
      </div>
      
      {announcements.length > 0 ? (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className={announcement.important ? 'border-l-4 border-l-red-500' : ''}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium flex items-center">
                      {announcement.important && (
                        <Bell className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      {announcement.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      By {getAuthorName(announcement.createdBy)} • {new Date(announcement.createdAt).toLocaleDateString()}
                    </p>
                    <div className="mt-3 text-gray-600 dark:text-gray-300">
                      {announcement.content}
                    </div>
                  </div>
                  
                  {(isAdmin || (isModerator && announcement.createdBy === currentUser?.id)) && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="ml-4 text-red-600 hover:bg-red-50"
                      onClick={() => confirmDelete(announcement.id)}
                      icon={<Trash2 className="h-4 w-4" />}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">No announcements yet.</p>
          </CardContent>
        </Card>
      )}
      
      {/* Create Announcement Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Announcement"
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
              placeholder="Announcement title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Content *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Announcement content"
            ></textarea>
          </div>
          
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={important}
                onChange={(e) => setImportant(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Mark as important
              </span>
            </label>
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
            onClick={handleCreateAnnouncement}
          >
            Create
          </Button>
        </div>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAnnouncement}
        title="Delete Announcement"
        message="Are you sure you want to delete this announcement? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
      />
    </div>
  );
};

export default AnnouncementsPage;