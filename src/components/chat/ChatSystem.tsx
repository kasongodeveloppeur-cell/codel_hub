import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Send, 
  Users, 
  Search, 
  Settings, 
  X, 
  Phone, 
  Video, 
  MoreVertical,
  Paperclip,
  Smile,
  Circle,
  Check,
  CheckCheck,
  Clock,
  User,
  Bot,
  Zap,
  Coffee,
  Code,
  BookOpen,
  Award,
  Heart,
  Star,
  Bell,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { useThemeClasses } from '../../hooks/useTheme';
import { useAuth } from '../../context/AuthContext';

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'system';
  status: 'sending' | 'sent' | 'delivered' | 'read';
  replyTo?: string;
  reactions?: {
    emoji: string;
    userId: string;
    userName: string;
  }[];
}

interface ChatRoom {
  id: string;
  name: string;
  type: 'direct' | 'group' | 'channel' | 'bot';
  description?: string;
  avatar?: string;
  members: string[];
  admins: string[];
  lastMessage?: Message;
  unreadCount: number;
  isOnline: boolean;
  isTyping?: string[];
  tags: string[];
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen?: Date;
  role: 'member' | 'admin' | 'moderator' | 'bot';
  typingIn?: string;
}

const MessageItem: React.FC<{
  message: Message;
  isOwn: boolean;
  sender?: User;
  onReply: (messageId: string) => void;
  onReact: (messageId: string, emoji: string) => void;
  isDarkMode: boolean;
}> = ({ message, isOwn, sender, onReply, onReact, isDarkMode }) => {
  const { bgCard, text } = useThemeClasses();

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sending': return <Clock className="w-3 h-3 text-gray-400" />;
      case 'sent': return <Check className="w-3 h-3 text-gray-400" />;
      case 'delivered': return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case 'read': return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default: return null;
    }
  };

  return (
    <motion.div
      className={`flex gap-3 mb-4 ${isOwn ? 'flex-row-reverse' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {!isOwn && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
          {sender?.name.charAt(0).toUpperCase() || '?'}
        </div>
      )}
      
      <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
        {!isOwn && (
          <div className="text-xs text-gray-500 mb-1">{sender?.name}</div>
        )}
        
        <div
          className={`${bgCard} rounded-2xl px-4 py-2 ${
            isOwn ? 'bg-cyan-500 text-white' : ''
          }`}
        >
          <p className={`text-sm ${isOwn ? 'text-white' : text}`}>
            {message.content}
          </p>
          
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex gap-1 mt-2">
              {message.reactions.map((reaction, index) => (
                <div
                  key={index}
                  className="bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1 text-xs flex items-center gap-1"
                >
                  <span>{reaction.emoji}</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {reaction.userName}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className={`flex items-center gap-2 mt-1 text-xs text-gray-500 ${isOwn ? 'flex-row-reverse' : ''}`}>
          <span>{formatTime(message.timestamp)}</span>
          {isOwn && getStatusIcon(message.status)}
        </div>
      </div>
    </motion.div>
  );
};

const ChatInput: React.FC<{
  onSend: (content: string) => void;
  onTyping: (isTyping: boolean) => void;
  disabled?: boolean;
  isDarkMode: boolean;
}> = ({ onSend, onTyping, disabled, isDarkMode }) => {
  const [message, setMessage] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const emojis = ['😀', '😂', '❤️', '👍', '🎉', '🔥', '💯', '🚀', '💡', '✨', '🌟', '⭐'];

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
      onTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (value: string) => {
    setMessage(value);
    onTyping(value.length > 0);
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 p-4">
      {showEmoji && (
        <div className="mb-3 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="flex flex-wrap gap-2">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  setMessage(prev => prev + emoji);
                  inputRef.current?.focus();
                }}
                className="text-xl hover:bg-gray-200 dark:hover:bg-gray-700 rounded p-1"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowEmoji(!showEmoji)}
          icon={<Smile className="w-4 h-4" />}
        />
        
        <Button
          variant="ghost"
          size="sm"
          icon={<Paperclip className="w-4 h-4" />}
        />
        
        <div className="flex-1">
          <Input
            ref={inputRef}
            placeholder="Tapez votre message..."
            value={message}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={disabled}
            className="w-full"
          />
        </div>
        
        <Button
          variant="primary"
          size="sm"
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          icon={<Send className="w-4 h-4" />}
        />
      </div>
    </div>
  );
};

const ChatSidebar: React.FC<{
  rooms: ChatRoom[];
  activeRoom?: ChatRoom;
  onRoomSelect: (room: ChatRoom) => void;
  onSearch: (query: string) => void;
  isDarkMode: boolean;
}> = ({ rooms, activeRoom, onRoomSelect, onSearch, isDarkMode }) => {
  const { bg, text } = useThemeClasses();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoomIcon = (type: string) => {
    switch (type) {
      case 'direct': return <User className="w-4 h-4" />;
      case 'group': return <Users className="w-4 h-4" />;
      case 'channel': return <MessageSquare className="w-4 h-4" />;
      case 'bot': return <Bot className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getRoomColor = (type: string) => {
    switch (type) {
      case 'direct': return 'text-blue-500';
      case 'group': return 'text-green-500';
      case 'channel': return 'text-purple-500';
      case 'bot': return 'text-cyan-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className={`w-80 ${bg} border-r border-gray-200 dark:border-gray-700 flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className={`text-lg font-semibold ${text} mb-4`}>Messages</h2>
        
        <Input
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            onSearch(e.target.value);
          }}
          icon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Room List */}
      <div className="flex-1 overflow-y-auto">
        {filteredRooms.map(room => (
          <div
            key={room.id}
            onClick={() => onRoomSelect(room)}
            className={`p-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
              activeRoom?.id === room.id ? 'bg-gray-100 dark:bg-gray-800' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white flex-shrink-0 ${getRoomColor(room.type)}`}>
                {getRoomIcon(room.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`font-medium ${text} truncate`}>{room.name}</h3>
                  {room.isOnline && (
                    <Circle className="w-2 h-2 text-green-500 fill-current" />
                  )}
                </div>
                
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} truncate`}>
                  {room.lastMessage?.content || room.description}
                </p>
              </div>
              
              {room.unreadCount > 0 && (
                <Badge variant="primary" size="sm">
                  {room.unreadCount > 99 ? '99+' : room.unreadCount}
                </Badge>
              )}
            </div>
            
            {room.tags.length > 0 && (
              <div className="flex gap-1 mt-2">
                {room.tags.slice(0, 2).map(tag => (
                  <Badge key={tag} variant="outline" size="sm">
                    {tag}
                  </Badge>
                ))}
                {room.tags.length > 2 && (
                  <Badge variant="outline" size="sm">
                    +{room.tags.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const ChatSystem: React.FC = () => {
  const { bg, text } = useThemeClasses();
  const [isDarkMode] = useState(false);
  const { user } = useAuth();
  
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<ChatRoom | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Demo data
  const demoRooms: ChatRoom[] = [
    {
      id: '1',
      name: 'Général',
      type: 'channel',
      description: 'Discussions générales CODEL',
      members: ['1', '2', '3'],
      admins: ['1'],
      unreadCount: 3,
      isOnline: true,
      tags: ['général', 'annonces'],
      lastMessage: {
        id: 'm1',
        content: 'Bienvenue dans le canal général!',
        senderId: '1',
        senderName: 'Admin',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        type: 'text',
        status: 'read'
      }
    },
    {
      id: '2',
      name: 'Développement Web',
      type: 'group',
      description: 'Discussions sur le développement web',
      members: ['1', '2', '3', '4'],
      admins: ['1', '2'],
      unreadCount: 1,
      isOnline: true,
      tags: ['web', 'frontend', 'backend'],
      lastMessage: {
        id: 'm2',
        content: 'Quelqu\'un a travaillé avec React 18?',
        senderId: '2',
        senderName: 'Alice',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        type: 'text',
        status: 'delivered'
      }
    },
    {
      id: '3',
      name: 'Alice Martin',
      type: 'direct',
      members: ['1', '2'],
      admins: ['1', '2'],
      unreadCount: 0,
      isOnline: true,
      tags: ['direct'],
      lastMessage: {
        id: 'm3',
        content: 'À plus tard!',
        senderId: '2',
        senderName: 'Alice',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        type: 'text',
        status: 'read'
      }
    },
    {
      id: '4',
      name: 'CODEL Bot',
      type: 'bot',
      description: 'Assistant IA CODEL',
      members: ['1'],
      admins: ['1'],
      unreadCount: 0,
      isOnline: true,
      tags: ['bot', 'ia', 'aide'],
      lastMessage: {
        id: 'm4',
        content: 'Comment puis-je vous aider aujourd\'hui?',
        senderId: 'bot',
        senderName: 'CODEL Bot',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        type: 'text',
        status: 'read'
      }
    }
  ];

  const demoMessages: Message[] = [
    {
      id: '1',
      content: 'Salut tout le monde! 👋',
      senderId: '1',
      senderName: 'Moi',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      type: 'text',
      status: 'read'
    },
    {
      id: '2',
      content: 'Salut! Comment ça va?',
      senderId: '2',
      senderName: 'Alice',
      timestamp: new Date(Date.now() - 1000 * 60 * 50),
      type: 'text',
      status: 'read',
      reactions: [
        { emoji: '👍', userId: '3', userName: 'Bob' }
      ]
    },
    {
      id: '3',
      content: 'Très bien! Je travaille sur un nouveau projet React',
      senderId: '1',
      senderName: 'Moi',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      type: 'text',
      status: 'read'
    },
    {
      id: '4',
      content: 'Super! J\'adore React. Tu utilises TypeScript?',
      senderId: '2',
      senderName: 'Alice',
      timestamp: new Date(Date.now() - 1000 * 60 * 40),
      type: 'text',
      status: 'delivered'
    },
    {
      id: '5',
      content: 'Oui, bien sûr! C\'est indispensable pour les grands projets 🚀',
      senderId: '1',
      senderName: 'Moi',
      timestamp: new Date(Date.now() - 1000 * 60 * 35),
      type: 'text',
      status: 'delivered',
      reactions: [
        { emoji: '🔥', userId: '2', userName: 'Alice' },
        { emoji: '💯', userId: '3', userName: 'Bob' }
      ]
    }
  ];

  const demoUsers: User[] = [
    {
      id: '1',
      name: 'Moi',
      email: user?.email || '',
      status: 'online',
      role: 'member'
    },
    {
      id: '2',
      name: 'Alice',
      email: 'alice@example.com',
      status: 'online',
      role: 'admin'
    },
    {
      id: '3',
      name: 'Bob',
      email: 'bob@example.com',
      status: 'away',
      lastSeen: new Date(Date.now() - 1000 * 60 * 15),
      role: 'member'
    }
  ];

  useEffect(() => {
    setRooms(demoRooms);
    setMessages(demoMessages);
    setOnlineUsers(['1', '2']);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRoomSelect = (room: ChatRoom) => {
    setActiveRoom(room);
    setMessages(demoMessages);
  };

  const handleSendMessage = useCallback((content: string) => {
    if (!activeRoom || !user) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      senderId: user.uid || '1',
      senderName: user.displayName || 'Moi',
      timestamp: new Date(),
      type: 'text',
      status: 'sending'
    };

    setMessages(prev => [...prev, newMessage]);

    // Simulate message delivery
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'delivered' as const }
            : msg
        )
      );
    }, 1000);

    // Simulate read receipt
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'read' as const }
            : msg
        )
      );
    }, 2000);
  }, [activeRoom, user]);

  const handleTyping = useCallback((isTyping: boolean) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (isTyping) {
      // Notify others that user is typing
      console.log('User is typing...');
    }
  }, []);

  const handleReply = (messageId: string) => {
    console.log('Reply to message:', messageId);
  };

  const handleReact = (messageId: string, emoji: string) => {
    setMessages(prev => 
      prev.map(msg => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions?.find(r => r.emoji === emoji);
          if (existingReaction) {
            return {
              ...msg,
              reactions: msg.reactions?.filter(r => r.emoji !== emoji) || []
            };
          } else {
            return {
              ...msg,
              reactions: [
                ...(msg.reactions || []),
                { emoji, userId: '1', userName: 'Moi' }
              ]
            };
          }
        }
        return msg;
      })
    );
  };

  const getUserById = (userId: string): User | undefined => {
    return demoUsers.find(u => u.id === userId);
  };

  return (
    <div className={`h-screen ${bg} ${text} flex`}>
      {/* Sidebar */}
      <ChatSidebar
        rooms={rooms}
        activeRoom={activeRoom}
        onRoomSelect={handleRoomSelect}
        onSearch={(query) => console.log('Search:', query)}
        isDarkMode={isDarkMode}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeRoom ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white">
                    {activeRoom.type === 'direct' ? (
                      <User className="w-5 h-5" />
                    ) : activeRoom.type === 'bot' ? (
                      <Bot className="w-5 h-5" />
                    ) : (
                      <Users className="w-5 h-5" />
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold">{activeRoom.name}</h3>
                    <p className="text-sm text-gray-500">
                      {activeRoom.members.length} membres • {activeRoom.isOnline ? 'En ligne' : 'Hors ligne'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" icon={<Phone className="w-4 h-4" />} />
                  <Button variant="ghost" size="sm" icon={<Video className="w-4 h-4" />} />
                  <Button variant="ghost" size="sm" icon={<MoreVertical className="w-4 h-4" />} />
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map(message => (
                <MessageItem
                  key={message.id}
                  message={message}
                  isOwn={message.senderId === '1'}
                  sender={getUserById(message.senderId)}
                  onReply={handleReply}
                  onReact={handleReact}
                  isDarkMode={isDarkMode}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Typing Indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="px-4 pb-2"
                >
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span>Quelqu'un écrit...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <ChatInput
              onSend={handleSendMessage}
              onTyping={handleTyping}
              isDarkMode={isDarkMode}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              <h3 className={`text-xl font-medium mb-2 ${text}`}>
                Sélectionnez une conversation
              </h3>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Choisissez un salon ou une discussion pour commencer à chatter
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSystem;
