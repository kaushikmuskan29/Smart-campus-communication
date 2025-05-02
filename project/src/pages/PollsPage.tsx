import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ConfirmModal } from '../components/ui/Modal';
import { Toast } from '../components/ui/Toast';
import { getPolls, addPoll, updatePoll, deletePoll, getUserById } from '../utils/localStorage';
import { Poll, PollOption } from '../types';
import { PlusCircle, Trash2, Plus, X } from 'lucide-react';

const PollsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPollId, setSelectedPollId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  
  // Form state
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [endDate, setEndDate] = useState('');
  
  const isAdmin = currentUser?.role === 'admin';
  const isModerator = currentUser?.role === 'moderator';
  
  useEffect(() => {
    loadPolls();
  }, []);
  
  const loadPolls = () => {
    const allPolls = getPolls();
    // Sort by date, active first, then newest first
    const sorted = [...allPolls].sort((a, b) => {
      // Active polls first
      if (a.isActive && !b.isActive) return -1;
      if (!a.isActive && b.isActive) return 1;
      
      // Then by end date (upcoming first)
      return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
    });
    setPolls(sorted);
  };
  
  const handleCreatePoll = () => {
    if (!currentUser) return;
    
    if (!question.trim() || !endDate || options.some(opt => !opt.trim())) {
      setToastMessage('Please fill in all required fields and at least two options');
      setToastType('error');
      setShowToast(true);
      return;
    }
    
    // Filter out empty options
    const validOptions = options.filter(opt => opt.trim());
    
    if (validOptions.length < 2) {
      setToastMessage('Please provide at least two options');
      setToastType('error');
      setShowToast(true);
      return;
    }
    
    const pollOptions: PollOption[] = validOptions.map(text => ({
      id: Math.random().toString(36).substring(2, 15),
      text,
      votes: []
    }));
    
    const newPoll: Poll = {
      id: Math.random().toString(36).substring(2, 15),
      question,
      options: pollOptions,
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
      endDate,
      isActive: new Date(endDate) > new Date()
    };
    
    addPoll(newPoll);
    
    // Reset form & close modal
    resetForm();
    setIsCreateModalOpen(false);
    
    // Reload polls
    loadPolls();
    
    // Show success message
    setToastMessage('Poll created successfully!');
    setToastType('success');
    setShowToast(true);
  };
  
  const resetForm = () => {
    setQuestion('');
    setOptions(['', '']);
    setEndDate('');
  };
  
  const addOption = () => {
    setOptions([...options, '']);
  };
  
  const removeOption = (index: number) => {
    if (options.length <= 2) {
      setToastMessage('A poll must have at least two options');
      setToastType('error');
      setShowToast(true);
      return;
    }
    
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };
  
  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };
  
  const confirmDelete = (id: string) => {
    setSelectedPollId(id);
    setIsDeleteModalOpen(true);
  };
  
  const handleDeletePoll = () => {
    if (selectedPollId) {
      deletePoll(selectedPollId);
      
      // Reset state
      setSelectedPollId(null);
      setIsDeleteModalOpen(false);
      
      // Reload polls
      loadPolls();
      
      // Show success message
      setToastMessage('Poll deleted successfully!');
      setToastType('success');
      setShowToast(true);
    }
  };
  
  const handleVote = (pollId: string, optionId: string) => {
    if (!currentUser) return;
    
    const poll = polls.find(p => p.id === pollId);
    if (!poll) return;
    
    // Check if poll is active
    if (!poll.isActive) {
      setToastMessage('This poll has ended');
      setToastType('error');
      setShowToast(true);
      return;
    }
    
    // Check if user has already voted in this poll
    const hasVoted = poll.options.some(opt => opt.votes.includes(currentUser.id));
    
    if (hasVoted) {
      // Remove the previous vote
      const updatedOptions = poll.options.map(opt => ({
        ...opt,
        votes: opt.votes.filter(id => id !== currentUser.id)
      }));
      
      // Add the new vote
      const updatedOptionsWithNewVote = updatedOptions.map(opt => 
        opt.id === optionId 
          ? { ...opt, votes: [...opt.votes, currentUser.id] } 
          : opt
      );
      
      const updatedPoll = {
        ...poll,
        options: updatedOptionsWithNewVote
      };
      
      updatePoll(updatedPoll);
      loadPolls();
      
      setToastMessage('Your vote has been updated');
      setToastType('success');
      setShowToast(true);
    } else {
      // Add the vote
      const updatedOptions = poll.options.map(opt => 
        opt.id === optionId 
          ? { ...opt, votes: [...opt.votes, currentUser.id] } 
          : opt
      );
      
      const updatedPoll = {
        ...poll,
        options: updatedOptions
      };
      
      updatePoll(updatedPoll);
      loadPolls();
      
      setToastMessage('Your vote has been recorded');
      setToastType('success');
      setShowToast(true);
    }
  };
  
  const getAuthorName = (authorId: string) => {
    const user = getUserById(authorId);
    return user ? user.name : 'Unknown User';
  };
  
  const hasUserVoted = (poll: Poll) => {
    return currentUser ? poll.options.some(opt => opt.votes.includes(currentUser.id)) : false;
  };
  
  const getUserVote = (poll: Poll) => {
    if (!currentUser) return null;
    
    for (const option of poll.options) {
      if (option.votes.includes(currentUser.id)) {
        return option.id;
      }
    }
    
    return null;
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
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
        <h1 className="text-2xl font-bold">Polls</h1>
        
        {(isAdmin || isModerator) && (
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            icon={<PlusCircle className="h-4 w-4" />}
          >
            Create Poll
          </Button>
        )}
      </div>
      
      {polls.length > 0 ? (
        <div className="space-y-6">
          {polls.map((poll) => {
            const isActive = poll.isActive;
            const userVoteId = getUserVote(poll);
            
            return (
              <Card key={poll.id} className={!isActive ? 'opacity-75' : ''}>
                <CardContent className="p-6">
                  <div className="flex flex-col">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium">{poll.question}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          By {getAuthorName(poll.createdBy)} • Ends {formatDate(poll.endDate)}
                          {!isActive && <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">Ended</span>}
                        </p>
                      </div>
                      
                      {(isAdmin || (isModerator && poll.createdBy === currentUser?.id)) && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => confirmDelete(poll.id)}
                          icon={<Trash2 className="h-4 w-4" />}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                    
                    <div className="mt-4 space-y-3">
                      {poll.options.map((option) => {
                        const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes.length, 0);
                        const percentage = totalVotes === 0 ? 0 : Math.round((option.votes.length / totalVotes) * 100);
                        const isSelected = userVoteId === option.id;
                        
                        return (
                          <div key={option.id}>
                            <div className="flex items-center justify-between">
                              <button
                                className={`flex items-center text-sm ${
                                  isSelected 
                                    ? 'text-blue-600 font-medium' 
                                    : 'text-gray-700 dark:text-gray-300'
                                } ${
                                  !isActive ? 'cursor-not-allowed' : 'hover:text-blue-600'
                                }`}
                                onClick={() => handleVote(poll.id, option.id)}
                                disabled={!isActive}
                              >
                                <div className={`w-4 h-4 border rounded-full mr-2 flex items-center justify-center ${
                                  isSelected 
                                    ? 'border-blue-600 bg-blue-600' 
                                    : 'border-gray-300'
                                }`}>
                                  {isSelected && (
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                  )}
                                </div>
                                {option.text}
                              </button>
                              <span className="text-xs text-gray-500">
                                {percentage}% ({option.votes.length})
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                              <div 
                                className={`${
                                  isSelected 
                                    ? 'bg-blue-600' 
                                    : 'bg-gray-400 dark:bg-gray-500'
                                } h-2 rounded-full transition-all duration-300`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="mt-4 text-sm text-gray-500">
                      {hasUserVoted(poll) 
                        ? 'You have voted in this poll' 
                        : isActive 
                          ? 'Click an option to vote' 
                          : 'This poll has ended'
                      }
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">No polls available.</p>
          </CardContent>
        </Card>
      )}
      
      {/* Create Poll Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Poll"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Question *
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="What's your poll question?"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Options *
            </label>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Option ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="ml-2 p-2 text-gray-400 hover:text-red-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addOption}
              className="mt-2 flex items-center text-sm text-blue-600 hover:text-blue-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Option
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              End Date *
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              min={new Date().toISOString().split('T')[0]}
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
            onClick={handleCreatePoll}
          >
            Create
          </Button>
        </div>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeletePoll}
        title="Delete Poll"
        message="Are you sure you want to delete this poll? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
      />
    </div>
  );
};

export default PollsPage;