'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CrmLayout } from '@/components/crm/CrmLayout';
import { MessageSquare, Send, X } from 'lucide-react';

interface ChatRoom {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  subject: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  lastMessage: ChatMessage | null;
  unreadCount: number;
}

interface ChatMessage {
  id: string;
  senderType: string;
  senderName: string;
  message: string;
  createdAt: string;
}

export default function AdminSupportPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchRooms();
    // Poll for new messages every 5 seconds
    const interval = setInterval(() => {
      fetchRooms();
      if (selectedRoom) {
        fetchMessages(selectedRoom.id);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedRoom?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem('adminToken');

      if (!token) {
        router.push('/admin/login');
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chat/admin/rooms`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/admin/login');
          return;
        }
        setRooms([]);
        return;
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setRooms(data);
      } else {
        setRooms([]);
      }
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (roomId: string) => {
    try {
      const token = localStorage.getItem('adminToken');

      if (!token) {
        router.push('/admin/login');
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chat/admin/rooms/${roomId}/messages`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/admin/login');
          return;
        }
        setMessages([]);
        return;
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setMessages(data);
      } else {
        setMessages([]);
      }

      // Refresh rooms to update unread count
      await fetchRooms();
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      setMessages([]);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom) return;

    try {
      setSending(true);
      const token = localStorage.getItem('adminToken');

      if (!token) {
        router.push('/admin/login');
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chat/admin/rooms/${selectedRoom.id}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: newMessage }),
        }
      );

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/admin/login');
          return;
        }
        console.error('Failed to send message:', res.status);
        return;
      }

      const message = await res.json();
      setMessages([...messages, message]);
      setNewMessage('');
      await fetchRooms();
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleCloseRoom = async (roomId: string) => {
    if (!confirm('Möchten Sie diesen Chat wirklich schließen?')) return;

    try {
      const token = localStorage.getItem('adminToken');

      if (!token) {
        router.push('/admin/login');
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chat/admin/rooms/${roomId}/close`,
        {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/admin/login');
          return;
        }
        console.error('Failed to close room:', res.status);
        return;
      }

      await fetchRooms();
      if (selectedRoom?.id === roomId) {
        setSelectedRoom(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Failed to close room:', error);
    }
  };

  const handleSelectRoom = async (room: ChatRoom) => {
    setSelectedRoom(room);
    await fetchMessages(room.id);
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const getStatusBadge = (status: string) => {
    const styles = status === 'OPEN'
      ? 'bg-green-100 text-green-800 border-green-300'
      : 'bg-gray-100 text-gray-800 border-gray-300';

    const label = status === 'OPEN' ? 'Offen' : 'Geschlossen';

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded border ${styles}`}>
        {label}
      </span>
    );
  };

  return (
    <CrmLayout>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="text-[#D4AF37]" size={24} />
            Support-Chats
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Kundensupport-Anfragen verwalten
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          {/* Chat List */}
          <div className="lg:col-span-1 border-r border-gray-200 max-h-[700px] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Lade Chats...</div>
            ) : rooms.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Keine Support-Anfragen vorhanden
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => handleSelectRoom(room)}
                    className={`p-4 cursor-pointer transition-colors ${
                      selectedRoom?.id === room.id
                        ? 'bg-[#D4AF37]/10'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-bold text-gray-900 text-sm">
                          {room.userName}
                        </div>
                        <div className="text-xs text-gray-600">{room.userEmail}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {room.unreadCount > 0 && (
                          <span className="px-2 py-0.5 bg-[#D4AF37] text-black rounded-full text-xs font-bold">
                            {room.unreadCount}
                          </span>
                        )}
                        {getStatusBadge(room.status)}
                      </div>
                    </div>
                    <div className="font-semibold text-sm text-gray-900 mb-1">
                      {room.subject}
                    </div>
                    {room.lastMessage && (
                      <p className="text-xs text-gray-600 truncate">
                        {room.lastMessage.senderName}: {room.lastMessage.message}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(room.updatedAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chat View */}
          <div className="lg:col-span-2 flex flex-col h-[700px]">
            {!selectedRoom ? (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageSquare size={48} className="mx-auto mb-4 text-gray-400" />
                  <p>Wählen Sie einen Chat aus der Liste</p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {selectedRoom.subject}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {selectedRoom.userName} ({selectedRoom.userEmail})
                      </p>
                      <p className="text-xs text-gray-500">
                        Erstellt am {formatDate(selectedRoom.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(selectedRoom.status)}
                      {selectedRoom.status === 'OPEN' && (
                        <button
                          onClick={() => handleCloseRoom(selectedRoom.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 flex items-center gap-1"
                        >
                          <X size={14} />
                          Schließen
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderType === 'ADMIN' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] ${
                          msg.senderType === 'ADMIN'
                            ? 'bg-gray-700 text-white'
                            : 'bg-white border border-gray-200 text-gray-900'
                        } rounded-lg p-3`}
                      >
                        <div className="text-xs font-semibold mb-1 opacity-80">
                          {msg.senderName}
                        </div>
                        <div className="text-sm whitespace-pre-wrap">{msg.message}</div>
                        <div className="text-xs opacity-70 mt-1">
                          {formatDate(msg.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                {selectedRoom.status === 'OPEN' && (
                  <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Antwort schreiben..."
                        className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg"
                        disabled={sending}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={sending || !newMessage.trim()}
                        className="px-4 py-2 bg-[#D4AF37] hover:bg-[#B8960C] text-black font-bold rounded-lg disabled:opacity-50 flex items-center gap-2"
                      >
                        <Send size={16} />
                        Senden
                      </button>
                    </div>
                  </div>
                )}
                {selectedRoom.status === 'CLOSED' && (
                  <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <p className="text-center text-gray-600 text-sm">
                      Dieser Chat wurde geschlossen
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </CrmLayout>
  );
}
