import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { getUserById } from '../utils/localStorage';
import { User } from '../types';
import { Toast } from '../components/ui/Toast';

const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  useEffect(() => {
    if (currentUser) {
      const userData = getUserById(currentUser.id);
      setUser(userData);
      
      if (userData) {
        setName(userData.name);
        setEmail(userData.email);
      }
    }
  }, [currentUser]);
  
  const handleSaveProfile = () => {
    if (!currentUser) return;
    
    // For simplicity, we'll just update the local state
    // In a real app, this would update the user in localStorage/database
    const updatedUser = {
      ...currentUser,
      name,
      email
    };
    
    setUser(updatedUser);
    setIsEditing(false);
    setToastMessage('Profile updated successfully!');
    setShowToast(true);
  };
  
  if (!user) {
    return (
      <div className="text-center py-10">
        <p>Loading profile...</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      {showToast && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
      
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 mb-6 md:mb-0 flex justify-center">
              <div className="relative">
                <img
                  src={user.avatar || 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=300'}
                  alt="Profile"
                  className="rounded-full w-32 h-32 object-cover border-4 border-white shadow-md"
                />
                <div className="absolute bottom-0 right-0 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full capitalize">
                  {user.role}
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3 md:pl-6">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Role
                    </label>
                    <input
                      type="text"
                      value={user.role}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm"
                    />
                    <p className="mt-1 text-xs text-gray-500">Role cannot be changed</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</h3>
                    <p className="mt-1 text-lg font-medium">{user.name}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h3>
                    <p className="mt-1">{user.email}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</h3>
                    <p className="mt-1 capitalize">{user.role}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <div className="flex justify-end space-x-3">
            {isEditing ? (
              <>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    // Reset form
                    setName(user.name);
                    setEmail(user.email);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveProfile}>
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfilePage;