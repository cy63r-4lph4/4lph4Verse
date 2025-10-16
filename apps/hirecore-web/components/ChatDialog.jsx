import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import ChatContainer from '@/components/chat/ChatContainer';
import { Send, MessageCircle } from 'lucide-react';

export default function ChatDialog({ isOpen, onClose, task, currentUser = 'worker' }) {
  const { toast } = useToast();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (isOpen && task) {
      // Load existing messages from localStorage
      const chatKey = `hirex_chat_${task.id}`;
      const savedMessages = localStorage.getItem(chatKey);
      
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        // Initialize with welcome message
        const welcomeMessage = {
          id: 1,
          sender: 'system',
          message: `Chat started for task: ${task.title}`,
          timestamp: new Date().toISOString(),
          type: 'system'
        };
        setMessages([welcomeMessage]);
        localStorage.setItem(chatKey, JSON.stringify([welcomeMessage]));
      }
    }
  }, [isOpen, task]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      sender: currentUser,
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    
    // Save to localStorage
    const chatKey = `hirex_chat_${task.id}`;
    localStorage.setItem(chatKey, JSON.stringify(updatedMessages));
    
    setNewMessage('');

    // Simulate typing indicator and response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      
      // Auto-response based on current user
      const otherUser = currentUser === 'worker' ? 'client' : 'worker';
      const responses = {
        worker: [
          "Thanks for reaching out! I'm available to start this task.",
          "I have all the necessary tools and can begin immediately.",
          "Could you provide more details about the specific requirements?",
          "I'll be there at the scheduled time. Looking forward to working with you!"
        ],
        client: [
          "Great! I'm glad you're interested in this task.",
          "The location details are in the task description. Let me know if you need anything else.",
          "Perfect! I'll be available during the mentioned time frame.",
          "Thank you for your quick response. I'll prepare everything needed."
        ]
      };

      const randomResponse = responses[otherUser][Math.floor(Math.random() * responses[otherUser].length)];
      
      const autoMessage = {
        id: Date.now() + 1,
        sender: otherUser,
        message: randomResponse,
        timestamp: new Date().toISOString(),
        type: 'text'
      };

      const finalMessages = [...updatedMessages, autoMessage];
      setMessages(finalMessages);
      localStorage.setItem(chatKey, JSON.stringify(finalMessages));
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getSenderName = (sender) => {
    switch (sender) {
      case 'worker': return 'Alex Johnson';
      case 'client': return task?.postedBy || 'Client';
      case 'system': return 'System';
      default: return sender;
    }
  };

  const getSenderColor = (sender) => {
    switch (sender) {
      case 'worker': return 'from-blue-500 to-purple-600';
      case 'client': return 'from-green-500 to-emerald-600';
      case 'system': return 'from-gray-500 to-gray-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[600px] glass-effect border-white/20 bg-gray-900/95 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-white">Chat: {task.title}</span>
              <p className="text-sm text-gray-400 font-normal">
                with {currentUser === 'worker' ? task.postedBy : 'Alex Johnson'}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {/* Task Status Bar */}
          <div className="mb-4 p-3 bg-gray-800/60 rounded-lg border border-gray-600/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30">
                  {task.budget} CØRE
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  {task.status || 'Open'}
                </Badge>
              </div>
              <div className="text-sm text-gray-400">
                Task ID: #{task.id}
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <ChatContainer
            messages={messages}
            isTyping={isTyping}
            currentUser={currentUser}
            getSenderName={getSenderName}
            getSenderColor={getSenderColor}
            formatTime={formatTime}
          />

          {/* Message Input */}
          <div className="flex space-x-2 pt-4 border-t border-gray-700/50">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 bg-gray-800/50 border-gray-600/50 text-white placeholder:text-gray-400 focus:border-blue-500/50"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}