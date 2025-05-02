import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Toast } from '../components/ui/Toast';
import { getFeedback, addFeedback } from '../utils/localStorage';
import { Feedback } from '../types';
import { MessageSquare } from 'lucide-react';

const BAD_WORDS = [
  'gali1', 'gali2', 'abuse1', 'abuse2', 
  'mc', 'bc', 'randi', 'chod', 'madarchod', 
  'bhosdike', 'lavde', 'chutiya', 'gaandu',
];

const FeedbackPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);

  const isAdmin = currentUser?.role === 'admin';
  const isStudent = currentUser?.role === 'student';

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = () => {
    try {
      const allFeedback = getFeedback();
      const sorted = [...allFeedback].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      if (isStudent && currentUser) {
        setFeedback(sorted.filter(f => f.createdBy === currentUser.id));
      } else if (isAdmin) {
        setFeedback(sorted);
      } else {
        setFeedback([]);
      }
    } catch (error) {
      console.error('Error loading feedback:', error);
      setFeedback([]);
    }
  };

  const containsBadWords = (text: string): boolean => {
    if (!text) return false;
    const lowerCaseText = text.toLowerCase();
    return BAD_WORDS.some(word => lowerCaseText.includes(word));
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      showToastMessage('You must be logged in to submit feedback', 'error');
      return;
    }
    
    if (!content.trim()) {
      showToastMessage('Please enter your feedback', 'error');
      return;
    }
    
    if (containsBadWords(content)) {
      showToastMessage('Your feedback contains inappropriate language', 'error');
      return;
    }
    
    const newFeedback: Feedback = {
      id: Math.random().toString(36).substring(2, 15),
      content,
      rating,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.id,
      status: 'pending'
    };
    
    addFeedback(newFeedback);
    setContent('');
    setRating(5);
    loadFeedback();
    showToastMessage('Feedback submitted successfully!', 'success');
    setIsCreateModalOpen(false);
  };

  const showToastMessage = (message: string, type: 'success' | 'error' | 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (!isAdmin && !isStudent) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to view this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Feedback</h1>
        
        {isStudent && (
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            icon={<MessageSquare className="h-4 w-4" />}
          >
            Submit Feedback
          </Button>
        )}
      </div>
      
      {feedback.length > 0 ? (
        <div className="space-y-4">
          {feedback.map((item) => (
            <Card key={item.id} className="mb-4">
              <CardContent className="p-6">
                <div className="mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-5 h-5 ${i < item.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-sm text-gray-500">
                      {formatDate(item.createdAt)}
                    </span>
                    {item.status === 'pending' && (
                      <span className="ml-2 text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                        Under Review
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-700">
                  {item.content}
                </p>
                
                {isAdmin && (
                  <p className="mt-2 text-sm text-gray-500">
                    From: Anonymous Student
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">
              {isStudent 
                ? "You haven't submitted any feedback yet." 
                : "No feedback has been submitted yet."}
            </p>
          </CardContent>
        </Card>
      )}
      
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Submit Feedback"
      >
        <form onSubmit={handleSubmitFeedback}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(i + 1)}
                    className="p-1 focus:outline-none"
                  >
                    <svg 
                      className={`w-6 h-6 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Feedback *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Share your thoughts and suggestions..."
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Your feedback will be anonymous to administrators.
              </p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button 
              variant="outline" 
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Submit
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FeedbackPage;