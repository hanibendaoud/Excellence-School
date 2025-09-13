import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, User, Clock, Users } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const StudentDiscussion = () => {
  const [socket, setSocket] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { auth } = useAuth();

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch subjects for student
  useEffect(() => {
    if (!auth || !auth.id) {
      setLoading(false);
      return;
    }

    const fetchSubjects = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://excellenceschool.onrender.com/getsubjects/${auth.id}`);
        const data = await res.json();
        setSubjects(data || []);
        console.log('Available teachers:', data);
      } catch (err) {
        console.error('Error fetching subjects:', err);
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [auth?.id]);

  // Initialize socket
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

          if (auth?.id) {
            newSocket.emit('register', auth.id);
            console.log('📝 Registered student with ID:', auth.id);
          }
        });

        newSocket.on('disconnect', () => {
          console.log('⚠️ Disconnected from server');
          setIsConnected(false);
        });

        newSocket.on('message', (data) => {
          console.log("📨 New message from server:", data);
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + Math.random(),
              email: data.email,
              fullname: data.fullname || data.email,
              message: data.message,
              timestamp: new Date(),
              isTeacher: true,
            },
          ]);
        });

        return newSocket;
      } catch (err) {
        console.error('❌ Socket init failed:', err);
      }
    };

    if (auth?.id) {
      const socketPromise = initializeSocket();
      return () => {
        socketPromise.then((sock) => sock && sock.close());
      };
    }
  }, [auth?.id]);

  // Fetch old messages when selecting teacher
  const fetchOldMessages = async (teacherName) => {
    if (!teacherName) return;
    setMessagesLoading(true);
    try {
      const res = await fetch(
        `https://excellenceschool.onrender.com/getmessages?fullname=${encodeURIComponent(teacherName)}`
      );
      const data = await res.json();
      console.log('🔥 Old messages:', data);

      setMessages(
        data.map((msg, idx) => ({
          id: idx + '-' + Date.now(),
          fullname: teacherName,
          email: '',
          message: msg,
          timestamp: new Date(Date.now() - (data.length - idx) * 60000),
          isTeacher: true,
        }))
      );
    } catch (err) {
      console.error('❌ Fetch messages error:', err);
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleTeacherSelect = (teacher) => {
    setSelectedTeacher(teacher);
    setMessages([]);
    fetchOldMessages(teacher.teacher);

    if (socket && isConnected) {
      socket.emit('message', { teacherName: teacher.teacher });
    }
  };

  // Format helpers
  const formatTime = (timestamp) => {
    if (!(timestamp instanceof Date)) return '';
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(timestamp);
  };

  const formatDate = (timestamp) => {
    if (!(timestamp instanceof Date)) return '';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(timestamp);
  };

  return (
    <div className="grid grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
      {/* Sidebar */}
      <div className="col-span-1 bg-white shadow rounded-xl p-4 space-y-3 overflow-y-auto max-h-[calc(100vh-8rem)]">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-orange-500" />
          <h2 className="font-bold">الأساتذة</h2>
        </div>

        {loading ? (
          <p className="text-gray-500">جاري التحميل...</p>
        ) : subjects.length > 0 ? (
          <div className="space-y-2">
            {subjects.map((subject) => (
              <div
                key={subject._id}
                onClick={() => handleTeacherSelect(subject)}
                className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedTeacher?.teacher === subject.teacher
                    ? 'bg-orange-100 border-orange-400'
                    : 'hover:bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-4 h-4 text-gray-500" />
                  <p className="font-semibold text-gray-800">{subject.teacher}</p>
                </div>
                <p className="text-sm text-gray-500">{subject.subject}</p>
                <div className="flex items-center gap-1 mt-1">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                  <span className="text-xs text-gray-400">
                    {isConnected ? 'متصل' : 'غير متصل'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">لا توجد مواد متاحة</p>
          </div>
        )}
      </div>

      {/* Messages Panel */}
      <div className="col-span-2 bg-white shadow rounded-xl flex flex-col max-h-[calc(100vh-8rem)]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-orange-500" />
            <div>
              {selectedTeacher ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-800">{selectedTeacher.teacher}</h3>
                  <p className="text-sm text-gray-500">{selectedTeacher.subject}</p>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-gray-800">المناقشات</h3>
                  <p className="text-sm text-gray-500">اختر أستاذ لعرض الرسائل</p>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`text-sm font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {isConnected ? 'متصل' : 'منقطع'}
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
          {!selectedTeacher ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">اختر أستاذ من القائمة لبدء المحادثة</p>
              </div>
            </div>
          ) : messagesLoading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">جاري تحميل الرسائل...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">لا توجد رسائل من هذا الأستاذ بعد</p>
              </div>
            </div>
          ) : (
            messages.map((msg, index) => {
              const showDate =
                index === 0 ||
                formatDate(msg.timestamp) !== formatDate(messages[index - 1].timestamp);

              return (
                <div key={msg.id}>
                  {showDate && (
                    <div className="flex items-center justify-center my-4">
                      <div className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">
                        {formatDate(msg.timestamp)}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-start">
                    <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gradient-to-r from-orange-400 to-yellow-400 text-white">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-3 h-3" />
                        <span className="text-xs font-medium opacity-75">
                          {msg.fullname || selectedTeacher?.teacher || 'الأستاذ'}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                      <div className="flex items-center gap-1 mt-1 justify-end">
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

        {/* Footer Note */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex items-center justify-center">
            <p className="text-sm text-gray-500 text-center">📖 هذه صفحة لقراءة رسائل الأساتذة فقط</p>
          </div>
          {!auth?.id && (
            <p className="text-xs text-red-500 text-center mt-2">❌ خطأ: معرف الطالب غير موجود</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDiscussion;
