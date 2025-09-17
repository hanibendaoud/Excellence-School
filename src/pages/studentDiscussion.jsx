import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, User, Clock, Users, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useAuth from '../hooks/useAuth';

const StudentDiscussion = () => {
  const [socket, setSocket] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false); // New state for mobile
  const messagesEndRef = useRef(null);
  const { auth } = useAuth();
  const { t } = useTranslation();

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
      } catch {
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
          setIsConnected(true);
          if (auth?.id) {
            newSocket.emit('register', auth.id);
          }
        });

        newSocket.on('disconnect', () => {
          setIsConnected(false);
        });

        newSocket.on('message', (data) => {
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
      } catch {}
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
    } catch {
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleTeacherSelect = (teacher) => {
    setSelectedTeacher(teacher);
    setMessages([]);
    fetchOldMessages(teacher.teacher);
    setShowMobileChat(true); // Show chat on mobile

    if (socket && isConnected) {
      socket.emit('message', { teacherName: teacher.teacher });
    }
  };

  const handleBackToTeachers = () => {
    setShowMobileChat(false);
    setSelectedTeacher(null);
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 h-[calc(100vh-8rem)]">
      {/* Sidebar - Hidden on mobile when chat is open */}
      <div className={`${showMobileChat ? 'hidden md:block' : 'block'} md:col-span-1 bg-white shadow rounded-xl p-4 space-y-3 overflow-y-auto max-h-[calc(100vh-8rem)]`}>
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-orange-500" />
          <h2 className="font-bold text-sm md:text-base">{t("studentDiscussion.teachers")}</h2>
        </div>

        {loading ? (
          <p className="text-gray-500 text-sm">{t("studentDiscussion.loading")}</p>
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
                  <p className="font-semibold text-gray-800 text-sm md:text-base truncate">{subject.teacher}</p>
                </div>
                <p className="text-xs md:text-sm text-gray-500 truncate">{subject.subject}</p>
                <div className="flex items-center gap-1 mt-1">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                  <span className="text-xs text-gray-400">
                    {isConnected ? t("studentDiscussion.online") : t("studentDiscussion.offline")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageCircle className="w-8 md:w-12 h-8 md:h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">{t("studentDiscussion.noSubjects")}</p>
          </div>
        )}
      </div>

      {/* Messages Panel - Full width on mobile when chat is open */}
      <div className={`${!showMobileChat ? 'hidden md:block' : 'block'} md:col-span-2 bg-white shadow rounded-xl flex flex-col max-h-[calc(100vh-8rem)]`}>
        {/* Header */}
        <div className="flex items-center justify-between p-3 md:p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
          <div className="flex items-center gap-3">
            {/* Back button for mobile */}
            <button
              onClick={handleBackToTeachers}
              className="md:hidden p-1 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <MessageCircle className="w-5 md:w-6 h-5 md:h-6 text-orange-500" />
            <div>
              {selectedTeacher ? (
                <>
                  <h3 className="text-base md:text-lg font-semibold text-gray-800 truncate">{selectedTeacher.teacher}</h3>
                  <p className="text-xs md:text-sm text-gray-500 truncate">{selectedTeacher.subject}</p>
                </>
              ) : (
                <>
                  <h3 className="text-base md:text-lg font-semibold text-gray-800">{t("studentDiscussion.discussions")}</h3>
                  <p className="text-xs md:text-sm text-gray-500">{t("studentDiscussion.selectTeacher")}</p>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`text-xs md:text-sm font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {isConnected ? t("studentDiscussion.online") : t("studentDiscussion.disconnected")}
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4 scroll-smooth">
          {!selectedTeacher ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageCircle className="w-8 md:w-12 h-8 md:h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm md:text-base">{t("studentDiscussion.chooseTeacher")}</p>
              </div>
            </div>
          ) : messagesLoading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-sm md:text-base">{t("studentDiscussion.loadingMessages")}</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageCircle className="w-8 md:w-12 h-8 md:h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm md:text-base">{t("studentDiscussion.noMessages")}</p>
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
                    <div className="max-w-[85%] md:max-w-xs lg:max-w-md px-3 md:px-4 py-2 rounded-lg bg-gradient-to-r from-orange-400 to-yellow-400 text-white">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-3 h-3" />
                        <span className="text-xs font-medium opacity-75 truncate">
                          {msg.fullname || selectedTeacher?.teacher || t("studentDiscussion.teacher")}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
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
        <div className="p-3 md:p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex items-center justify-center">
            <p className="text-xs md:text-sm text-gray-500 text-center">{t("studentDiscussion.readOnly")}</p>
          </div>
          {!auth?.id && (
            <p className="text-xs text-red-500 text-center mt-2">{t("studentDiscussion.errorNoId")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDiscussion;