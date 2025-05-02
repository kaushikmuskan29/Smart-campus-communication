import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, User, UserCog, School } from 'lucide-react';
import { initializeMockData } from '../utils/mockData';
import { UserRole } from '../types';

const LoginPage: React.FC = () => {
  const { login, switchRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize demo data
  React.useEffect(() => {
    initializeMockData();
  }, []);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      if (!email || !password) {
        throw new Error('Please enter both email and password');
      }
      
      // For demo, use mock credentials
      const success = login(email, password);
      
      if (success) {
        switchRole(selectedRole);
        // Redirect is handled by AuthContext
      } else {
        throw new Error('Invalid credentials. For demo, use any email with password "password"');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleQuickLogin = (role: UserRole) => {
    let email = '';
    
    switch (role) {
      case 'admin':
        email = 'admin@example.com';
        break;
      case 'moderator':
        email = 'moderator@example.com';
        break;
      case 'student':
        email = 'student1@example.com';
        break;
      default:
        email = 'student1@example.com';
    }
    
    setEmail(email);
    setPassword('password');
    setSelectedRole(role);
    setError('');
    
    // Trigger login
    const success = login(email, 'password');
    if (success) {
      switchRole(role);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
            <LogIn className="h-6 w-6 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to Dashboard
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Select a role to access the dashboard with different permissions
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Role selector buttons */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Role
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                className={`flex justify-center items-center px-4 py-2 border ${
                  selectedRole === 'admin'
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                } rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                onClick={() => setSelectedRole('admin')}
              >
                <User className="h-4 w-4 mr-2" />
                Admin
              </button>
              <button
                type="button"
                className={`flex justify-center items-center px-4 py-2 border ${
                  selectedRole === 'moderator'
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                } rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                onClick={() => setSelectedRole('moderator')}
              >
                <UserCog className="h-4 w-4 mr-2" />
                Moderator
              </button>
              <button
                type="button"
                className={`flex justify-center items-center px-4 py-2 border ${
                  selectedRole === 'student'
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                } rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                onClick={() => setSelectedRole('student')}
              >
                <School className="h-4 w-4 mr-2" />
                Student
              </button>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder={selectedRole === 'admin' ? 'admin@example.com' : selectedRole === 'moderator' ? 'moderator@example.com' : 'student1@example.com'}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="password"
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isLoading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Quick Login Options
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <button
                onClick={() => handleQuickLogin('admin')}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <User className="h-5 w-5 text-gray-700" />
                <span className="sr-only">Sign in as Admin</span>
              </button>
              <button
                onClick={() => handleQuickLogin('moderator')}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <UserCog className="h-5 w-5 text-gray-700" />
                <span className="sr-only">Sign in as Moderator</span>
              </button>
              <button
                onClick={() => handleQuickLogin('student')}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <School className="h-5 w-5 text-gray-700" />
                <span className="sr-only">Sign in as Student</span>
              </button>
            </div>
            <p className="mt-3 text-xs text-center text-gray-500">
              For demo: Use any email with password "password"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;