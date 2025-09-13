import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, User, Clock } from 'lucide-react';

const TeacherDiscussion = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  const teachername = localStorage.getItem('fullname');
  const teacherEmail = localStorage.getItem('email')
  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch old messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!teachername) return;

        const res = await fetch(
          `https://excellenceschool.onrender.com/getmessages?fullname=${encodeURIComponent(teachername)}`
        );

        if (!res.ok) throw new Error('Failed to fetch messages');

        const data = await res.json();
        console.log("📥 Raw messages from backend:", data);

        setMessages(
  data.map((msg, idx) => ({
    id: idx + '-' + Date.now(),
    fullname: teachername,   
    email: "",                   
    message: msg,                
    timestamp: new Date(Date.now() - (data.length - idx) * 60000), 
    isOwn: false
  }))
);
      } catch (error) {
        console.error('❌ Error fetching old messages:', error);
      }
    };

    fetchMessages();
  }, [teachername]);

  // Initialize socket connection
  useEffect(() => {
    const initializeSocket = async () => {
      try {
        const { io } = await import('socket.io-client');
        const newSocket = io('https://excellenceschool.onrender.com', {
          transports: ['websocket', 'polling'],
        });
        setSocket(newSocket);

        newSocket.on('connect', () => {
          console.log('✅ Connected to server');
          setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
          console.log('⚠️ Disconnected from server');
          setIsConnected(false);
        });

        // New incoming messages
        newSocket.on('message', (data) => {
          console.log("📨 New message from server:", data);
          setMessages(prev => [
            ...prev,
            {
              id: Date.now() + Math.random(),
              email: data.email,
              message: data.message,
              timestamp: new Date(),
              isOwn: data.email === teacherEmail
            }
          ]);
        });

        return newSocket;
      } catch (error) {
        console.error('❌ Failed to initialize socket:', error);
      }
    };

    const socketPromise = initializeSocket();

    return () => {
      socketPromise.then((sock) => sock && sock.close());
    };
  }, [teacherEmail]);

  // Send message
  const sendMessage = () => {
  if (!newMessage.trim() || !socket || !teacherEmail) return;

  const trimmedMessage = newMessage.trim();

  const messageData = {
    email: teacherEmail,
    message: trimmedMessage
  };

  console.log("📤 Sending message:", messageData);

  // Emit to server
  socket.emit('sending', messageData);

  // Optimistically add to local state
  setMessages(prev => [
    ...prev,
    {
      id: Date.now() + Math.random(),
      email: teacherEmail,
      message: trimmedMessage,
      timestamp: new Date(),
      isOwn: true
    }
  ]);

  setNewMessage('');
};


  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Format helpers with safety
  const formatTime = (timestamp) => {
    if (!(timestamp instanceof Date) || isNaN(timestamp)) return '';
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(timestamp);
  };

  const formatDate = (timestamp) => {
    if (!(timestamp instanceof Date) || isNaN(timestamp)) return '';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(timestamp);
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-8rem)] bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-6 h-6 text-orange-500" />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Teacher Discussion</h3>
            <p className="text-sm text-gray-500">Connect with other teachers</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className={`text-sm font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No messages yet. Start the conversation!</p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => {
            const showDate =
              index === 0 ||
              formatDate(msg.timestamp) !== formatDate(messages[index - 1].timestamp);

            return (
              <div key={msg.id}>
                {/* Date separator */}
                {showDate && (
                  <div className="flex items-center justify-center my-4">
                    <div className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">
                      {formatDate(msg.timestamp)}
                    </div>
                  </div>
                )}

                {/* Message */}
                <div className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.isOwn
                        ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {!msg.isOwn && (
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-3 h-3" />
                        <span className="text-xs font-medium opacity-75">
                          {msg.email || msg.fullname || "Unknown"}
                        </span>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                    <div
                      className={`flex items-center gap-1 mt-1 ${
                        msg.isOwn ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <Clock className="w-3 h-3 opacity-50" />
                      <span className="text-xs opacity-75">{formatTime(msg.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              rows={1}
              style={{
                minHeight: '40px',
                maxHeight: '120px',
                height: 'auto'
              }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
              disabled={!isConnected}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || !isConnected}
            className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-lg hover:from-orange-500 hover:to-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        {!teacherEmail && (
          <p className="text-xs text-red-500 mt-2">
            ❌ Error: Teacher email not found in localStorage
          </p>
        )}
        {!socket && (
          <p className="text-xs text-red-500 mt-1">
            ❌ Socket connection not established
          </p>
        )}
        {socket && !isConnected && (
          <p className="text-xs text-yellow-500 mt-1">
            ⚠️ Socket exists but not connected
          </p>
        )}
        <p className="text-xs text-gray-400 mt-1">
          Debug: Check browser console (F12) for detailed logs
        </p>
      </div>
    </div>
  );
};

export default TeacherDiscussion;
