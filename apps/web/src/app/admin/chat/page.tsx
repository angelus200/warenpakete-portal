'use client';

import { useState, useEffect, useRef } from 'react';
import { useApi } from '@/hooks/useApi';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send, Plus, X, Search, User as UserIcon } from 'lucide-react';

interface ChatRoom {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  subject: string;
  status: string;
  roomType: string;
  initiatedBy: string;
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

interface SearchUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  isAffiliate: boolean;
  affiliateCode: string | null;
  displayName: string;
}

export default function AdminChatPage() {
  const api = useApi();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [filterTab, setFilterTab] = useState<'ALL' | 'SUPPORT' | 'AFFILIATE'>('ALL');

  // New chat modal
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<SearchUser | null>(null);
  const [newChatSubject, setNewChatSubject] = useState('');
  const [newChatMessage, setNewChatMessage] = useState('');
  const [creatingChat, setCreatingChat] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (api.isSignedIn && api.isLoaded) {
      fetchRooms();
      // Poll every 5 seconds
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

  useEffect(() => {
    applyFilter();
  }, [rooms, filterTab]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const applyFilter = () => {
    if (filterTab === 'ALL') {
      setFilteredRooms(rooms);
    } else {
      setFilteredRooms(rooms.filter(r => r.roomType === filterTab));
    }
  };

  const fetchRooms = async () => {
    try {
      const data = await api.get<ChatRoom[]>('/chat/admin/rooms');
      setRooms(data);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (roomId: string) => {
    try {
      const data = await api.get<ChatMessage[]>(`/chat/admin/rooms/${roomId}/messages`);
      setMessages(data);
      await fetchRooms(); // Refresh to update unread count
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom) return;

    try {
      setSending(true);
      const message = await api.post<ChatMessage>(
        `/chat/admin/rooms/${selectedRoom.id}/messages`,
        { message: newMessage }
      );
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
    if (!confirm('Chat wirklich schließen?')) return;

    try {
      await api.patch(`/chat/admin/rooms/${roomId}/close`, {});
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

  const handleSearchUsers = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const data = await api.get<SearchUser[]>(`/chat/admin/users/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchResults(data);
    } catch (error) {
      console.error('Failed to search users:', error);
    }
  };

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery) {
        handleSearchUsers();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const handleCreateNewChat = async () => {
    if (!selectedUser || !newChatSubject.trim() || !newChatMessage.trim()) return;

    try {
      setCreatingChat(true);
      const roomType = selectedUser.isAffiliate ? 'AFFILIATE' : 'SUPPORT';
      const room = await api.post<ChatRoom>('/chat/admin/rooms/new', {
        userId: selectedUser.id,
        subject: newChatSubject,
        message: newChatMessage,
        roomType,
      });

      await fetchRooms();
      setSelectedRoom(room);
      await fetchMessages(room.id);

      // Reset modal
      setShowNewChatModal(false);
      setSelectedUser(null);
      setNewChatSubject('');
      setNewChatMessage('');
      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      console.error('Failed to create chat:', error);
      alert('Fehler beim Erstellen des Chats');
    } finally {
      setCreatingChat(false);
    }
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
    return <span className={`px-2 py-1 text-xs font-semibold rounded border ${styles}`}>{label}</span>;
  };

  const getRoomTypeIcon = (roomType: string) => {
    if (roomType === 'AFFILIATE') {
      return <span className="text-purple-600">🟣</span>;
    }
    return <span className="text-green-600">🟢</span>;
  };

  const getRoomTypeBadge = (roomType: string) => {
    const config: Record<string, { bg: string; text: string; label: string }> = {
      SUPPORT: { bg: 'bg-green-100', text: 'text-green-800', label: 'Support' },
      AFFILIATE: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Affiliate' },
      ORDER: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Bestellung' },
    };
    const { bg, text, label } = config[roomType] || config.SUPPORT;
    return <span className={`px-2 py-1 text-xs font-semibold rounded ${bg} ${text}`}>{label}</span>;
  };

  if (!api.isLoaded || loading) {
    return (
      <div className="min-h-screen bg-[#ebebeb] flex items-center justify-center">
        <div className="text-gray-500">Lade Chats...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ebebeb]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Chat</h1>
          <p className="text-gray-600">Kunden & Affiliates anschreiben</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat List */}
          <div className="lg:col-span-1">
            <Card className="p-4 bg-white border-2 border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">Chats</h2>
                <Button
                  onClick={() => setShowNewChatModal(true)}
                  className="bg-[#D4AF37] hover:bg-[#B8960C] text-black font-bold"
                  size="sm"
                >
                  <Plus size={16} className="mr-1" />
                  Neu
                </Button>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setFilterTab('ALL')}
                  className={`px-3 py-1 text-xs font-semibold rounded ${
                    filterTab === 'ALL'
                      ? 'bg-[#D4AF37] text-black'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Alle
                </button>
                <button
                  onClick={() => setFilterTab('SUPPORT')}
                  className={`px-3 py-1 text-xs font-semibold rounded ${
                    filterTab === 'SUPPORT'
                      ? 'bg-[#D4AF37] text-black'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Support
                </button>
                <button
                  onClick={() => setFilterTab('AFFILIATE')}
                  className={`px-3 py-1 text-xs font-semibold rounded ${
                    filterTab === 'AFFILIATE'
                      ? 'bg-[#D4AF37] text-black'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Affiliate
                </button>
              </div>

              {filteredRooms.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  Keine Chats gefunden
                </div>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {filteredRooms.map((room) => (
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
                        <div className="flex items-center gap-2 flex-1">
                          {getRoomTypeIcon(room.roomType)}
                          <div className="font-bold text-gray-900 text-sm truncate">
                            {room.userName}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {room.unreadCount > 0 && (
                            <span className="px-2 py-0.5 bg-[#D4AF37] text-black rounded-full text-xs font-bold">
                              {room.unreadCount}
                            </span>
                          )}
                          {getStatusBadge(room.status)}
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 mb-1">{room.subject}</div>
                      <div className="flex items-center gap-2 mb-1">
                        {getRoomTypeBadge(room.roomType)}
                        <span className="text-xs text-gray-500">
                          {room.initiatedBy === 'ADMIN' ? '👑 Admin gestartet' : '👤 User gestartet'}
                        </span>
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
            <Card className="p-0 bg-white border-2 border-gray-200 h-[700px] flex flex-col">
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
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">{selectedRoom.userName}</h2>
                        <p className="text-sm text-gray-600">{selectedRoom.userEmail}</p>
                        <p className="text-sm text-gray-900 mt-1">{selectedRoom.subject}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {getRoomTypeBadge(selectedRoom.roomType)}
                          <span className="text-xs text-gray-500">
                            {selectedRoom.initiatedBy === 'ADMIN' ? 'Admin gestartet' : 'User gestartet'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(selectedRoom.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(selectedRoom.status)}
                        {selectedRoom.status === 'OPEN' && (
                          <Button
                            onClick={() => handleCloseRoom(selectedRoom.id)}
                            size="sm"
                            className="bg-red-500 hover:bg-red-600 text-white font-bold"
                          >
                            <X size={14} className="mr-1" />
                            Schließen
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.senderType === 'ADMIN' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] ${
                            msg.senderType === 'ADMIN'
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
                </>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 bg-white max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Neuen Chat starten</h2>
              <button
                onClick={() => {
                  setShowNewChatModal(false);
                  setSelectedUser(null);
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            {!selectedUser ? (
              <>
                {/* User Search */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Benutzer suchen
                  </label>
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Email oder Name eingeben..."
                      className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {searchResults.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => setSelectedUser(user)}
                        className="p-3 border-2 border-gray-200 rounded-lg hover:border-[#D4AF37] cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <UserIcon size={20} className="text-gray-400" />
                            <div>
                              <div className="font-semibold text-gray-900">{user.displayName}</div>
                              <div className="text-sm text-gray-600">{user.email}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {user.isAffiliate && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-semibold">
                                Affiliate
                              </span>
                            )}
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                              {user.role}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Selected User + Chat Form */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg border-2 border-[#D4AF37]">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">{selectedUser.displayName}</div>
                      <div className="text-sm text-gray-600">{selectedUser.email}</div>
                    </div>
                    <button
                      onClick={() => setSelectedUser(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  {selectedUser.isAffiliate && (
                    <div className="mt-2">
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-semibold">
                        Affiliate (Code: {selectedUser.affiliateCode})
                      </span>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Betreff
                  </label>
                  <input
                    type="text"
                    value={newChatSubject}
                    onChange={(e) => setNewChatSubject(e.target.value)}
                    placeholder="Worum geht es?"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Erste Nachricht
                  </label>
                  <textarea
                    value={newChatMessage}
                    onChange={(e) => setNewChatMessage(e.target.value)}
                    placeholder="Ihre Nachricht..."
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg h-32"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleCreateNewChat}
                    disabled={creatingChat || !newChatSubject.trim() || !newChatMessage.trim()}
                    className="flex-1 bg-[#D4AF37] hover:bg-[#B8960C] text-black font-bold"
                  >
                    {creatingChat ? 'Wird erstellt...' : 'Chat erstellen'}
                  </Button>
                  <Button
                    onClick={() => setSelectedUser(null)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold"
                  >
                    Zurück
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
