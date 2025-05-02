import React, { useState } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import * as Dialog from '@radix-ui/react-dialog';

interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
}

const ChatBot: React.FC = () => {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // OpenRouter API Configuration - IMPORTANT: Replace with your actual API key
  const OPENROUTER_API_KEY = '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'; // Get this from OpenRouter.ai
  const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

  const initialBotMessage = {
    text: `Hello${currentUser?.name ? ` ${currentUser.name}` : ''}! I'm your college assistant. How can I help you today?`,
    sender: 'bot' as const
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage: ChatMessage = { text: input, sender: 'user' };
    setMessages(prev => [...(prev.length ? prev : [initialBotMessage]), userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare conversation history for OpenRouter
      const conversationHistory = [
        {
          role: 'system',
          content: `You are a helpful college assistant. The user is a ${currentUser?.role || 'student'}.
          Provide concise, helpful responses about college announcements, events, feedback, and campus-related topics.
          Keep responses under 150 characters when possible.`
        },
        ...messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        })),
        { role: 'user', content: input }
      ];

      // Call OpenRouter API
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': window.location.href, // Use current URL
          'X-Title': 'College Communication Platform'
        },
        body: JSON.stringify({
          model: 'openai/gpt-3.5-turbo', // or any model from OpenRouter
          messages: conversationHistory,
          temperature: 0.7,
          max_tokens: 150
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const botResponse = data.choices[0]?.message?.content || 
        "I'm sorry, I couldn't process your request. Please try again.";

      setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
    } catch (error) {
      console.error('Error calling OpenRouter API:', error);
      setMessages(prev => [...prev, { 
        text: error instanceof Error ? error.message : "Sorry, I'm having trouble connecting right now. Please try again later.", 
        sender: 'bot' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Open chat"
      >
        <MessageSquare className="h-6 w-6" />
      </button>

      {/* Chat Dialog */}
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Content className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">College Assistant</h3>
              <Dialog.Close asChild>
                <button 
                  className="text-gray-400 hover:text-gray-500"
                  aria-label="Close chat"
                >
                  <X className="h-5 w-5" />
                </button>
              </Dialog.Close>
            </div>

            <div className="p-4 h-96 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="flex justify-start mb-4">
                  <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 text-gray-900">
                    {initialBotMessage.text}
                  </div>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${
                      message.sender === 'user' ? 'flex justify-end' : 'flex justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 text-gray-900">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-75"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-150"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                  aria-label="Chat input"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading || !input.trim()}
                  aria-label="Send message"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

export default ChatBot;