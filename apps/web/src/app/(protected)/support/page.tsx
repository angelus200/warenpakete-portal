'use client';

import { useState, useEffect, useRef } from 'react';
import { useApi } from '@/hooks/useApi';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send, Plus } from 'lucide-react';

interface ChatRoom {
  id: string;
  subject: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  lastMessage: ChatMessage | null;
}

interface ChatMessage {
  id: string;
  senderType: string;
  senderName: string;
  message: string;
  createdAt: string;
}

export default function SupportPage() {
  const api = useApi();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (api.isSignedIn && api.isLoaded) {
      fetchRooms();
      // Poll for new messages every 5 seconds
      const interval = setInterval(() => {
        fetchRooms();
        if (selectedRoom) {
          fetchMessages(selectedRoom.id);
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [api.isSignedIn, api.isLoaded, selectedRoom?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchRooms = async () => {
    try {
      const data = await api.get<ChatRoom[]>('/chat/rooms/my');
      setRooms(data);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (roomId: string) => {
    try {
      const data = await api.get<ChatMessage[]>(`/chat/rooms/${roomId}/messages`);
      setMessages(data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleCreateRoom = async () => {
    if (!newSubject.trim()) return;

    try {
      const room = await api.post<ChatRoom>('/chat/rooms', { subject: newSubject });
      setRooms([room, ...rooms]);
      setSelectedRoom(room);
      setNewSubject('');
      setShowNewChatModal(false);
      setMessages([]);
    } catch (error) {
      console.error('Failed to create room:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom) return;

    try {
      setSending(true);
      const message = await api.post<ChatMessage>(
        `/chat/rooms/${selectedRoom.id}/messages`,
        { message: newMessage }
      );
      setMessages([...messages, message]);
      setNewMessage('');
      await fetchRooms(); // Update last message
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
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

  if (!api.isLoaded || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-500">Lade Support-Chats...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Support
        </h1>
        <p className="text-gray-600">
          Kontaktieren Sie unser Support-Team
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat List */}
        <div className="lg:col-span-1">
          <Card className="p-4 bg-white border-2 border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Meine Chats</h2>
              <Button
                onClick={() => setShowNewChatModal(true)}
                className="bg-[#D4AF37] hover:bg-[#B8960C] text-black font-bold"
                size="sm"
              >
                <Plus size={16} className="mr-1" />
                Neu
              </Button>
            </div>

            {rooms.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                Noch keine Chats vorhanden
              </div>
            ) : (
              <div className="space-y-2">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => handleSelectRoom(room)}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      selectedRoom?.id === room.id
                        ? 'bg-[#D4AF37]/10 border-[#D4AF37]'
                        : 'bg-gray-50 border-gray-200 hover:border-[#D4AF37]/50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-bold text-gray-900 text-sm truncate flex-1">
                        {room.subject}
                      </div>
                      {getStatusBadge(room.status)}
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
          </Card>
        </div>

        {/* Chat View */}
        <div className="lg:col-span-2">
          <Card className="p-0 bg-white border-2 border-gray-200 h-[600px] flex flex-col">
            {!selectedRoom ? (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageSquare size={48} className="mx-auto mb-4 text-gray-400" />
                  <p>Wählen Sie einen Chat oder starten Sie einen neuen</p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b-2 border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">{selectedRoom.subject}</h2>
                      <p className="text-sm text-gray-600">
                        Erstellt am {formatDate(selectedRoom.createdAt)}
                      </p>
                    </div>
                    {getStatusBadge(selectedRoom.status)}
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderType === 'USER' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] ${
                          msg.senderType === 'USER'
                            ? 'bg-[#D4AF37] text-black'
                            : 'bg-gray-200 text-gray-900'
                        } rounded-lg p-3`}
                      >
                        <div className="text-xs font-semibold mb-1">{msg.senderName}</div>
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
                  <div className="p-4 border-t-2 border-gray-200">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Nachricht schreiben..."
                        className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg"
                        disabled={sending}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={sending || !newMessage.trim()}
                        className="bg-[#D4AF37] hover:bg-[#B8960C] text-black font-bold"
                      >
                        <Send size={16} />
                      </Button>
                    </div>
                  </div>
                )}
                {selectedRoom.status === 'CLOSED' && (
                  <div className="p-4 border-t-2 border-gray-200 bg-gray-50">
                    <p className="text-center text-gray-600 text-sm">
                      Dieser Chat wurde geschlossen
                    </p>
                  </div>
                )}
              </>
            )}
          </Card>
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 bg-white max-w-md w-full mx-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Neuen Chat starten</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Betreff
              </label>
              <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="Worum geht es?"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleCreateRoom}
                disabled={!newSubject.trim()}
                className="flex-1 bg-[#D4AF37] hover:bg-[#B8960C] text-black font-bold"
              >
                Chat erstellen
              </Button>
              <Button
                onClick={() => {
                  setShowNewChatModal(false);
                  setNewSubject('');
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold"
              >
                Abbrechen
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
