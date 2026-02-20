'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CrmLayout } from '@/components/crm/CrmLayout';
import { Users, Plus, Edit2, Trash2 } from 'lucide-react';

interface Consultant {
  id: string;
  name: string;
  email: string;
  calendlyUrl: string;
  isActive: boolean;
  maxLeadsPerDay: number | null;
  assignedLeads: number;
  createdAt: string;
  _count?: {
    leads: number;
  };
}

export default function CrmConsultantsPage() {
  const router = useRouter();
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    calendlyUrl: '',
    isActive: true,
    maxLeadsPerDay: 10,
  });

  useEffect(() => {
    fetchConsultants();
  }, []);

  const fetchConsultants = async () => {
    try {
      const token = localStorage.getItem('adminToken');

      if (!token) {
        router.push('/admin/login');
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/funnel/consultants`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/admin/login');
          return;
        }
        setConsultants([]);
        return;
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setConsultants(data);
      } else {
        setConsultants([]);
      }
    } catch (error) {
      console.error('Failed to fetch consultants:', error);
      setConsultants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem('adminToken');

      if (!token) {
        router.push('/admin/login');
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/funnel/consultants`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/admin/login');
          return;
        }
        alert('Fehler beim Erstellen des Beraters');
        return;
      }

      setShowModal(false);
      resetForm();
      await fetchConsultants();
    } catch (error) {
      console.error('Failed to create consultant:', error);
      alert('Fehler beim Erstellen des Beraters');
    }
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    try {
      const token = localStorage.getItem('adminToken');

      if (!token) {
        router.push('/admin/login');
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/funnel/consultants/${editingId}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/admin/login');
          return;
        }
        alert('Fehler beim Aktualisieren des Beraters');
        return;
      }

      setShowModal(false);
      setEditingId(null);
      resetForm();
      await fetchConsultants();
    } catch (error) {
      console.error('Failed to update consultant:', error);
      alert('Fehler beim Aktualisieren des Beraters');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Berater wirklich deaktivieren?')) return;

    try {
      const token = localStorage.getItem('adminToken');

      if (!token) {
        router.push('/admin/login');
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/funnel/consultants/${id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/admin/login');
          return;
        }
        alert('Fehler beim Löschen des Beraters');
        return;
      }

      await fetchConsultants();
    } catch (error) {
      console.error('Failed to delete consultant:', error);
      alert('Fehler beim Löschen des Beraters');
    }
  };

  const openCreateModal = () => {
    resetForm();
    setEditingId(null);
    setShowModal(true);
  };

  const openEditModal = (consultant: Consultant) => {
    setFormData({
      name: consultant.name,
      email: consultant.email,
      calendlyUrl: consultant.calendlyUrl,
      isActive: consultant.isActive,
      maxLeadsPerDay: consultant.maxLeadsPerDay || 10,
    });
    setEditingId(consultant.id);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      calendlyUrl: '',
      isActive: true,
      maxLeadsPerDay: 10,
    });
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

  return (
    <CrmLayout>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Users size={20} className="text-[#D4AF37]" />
              Berater-Verwaltung
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Verwalten Sie Berater für Erstgespräche
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-[#D4AF37] hover:bg-[#B8960C] text-black font-bold rounded flex items-center gap-2"
          >
            <Plus size={16} />
            Neuer Berater
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b-2 border-[#D4AF37]/20">
              <tr>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                  Calendly URL
                </th>
                <th className="px-4 py-3 text-center text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                  Leads zugewiesen
                </th>
                <th className="px-4 py-3 text-center text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                  Max/Tag
                </th>
                <th className="px-4 py-3 text-center text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                  Erstellt
                </th>
                <th className="px-4 py-3 text-center text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    Lade Berater...
                  </td>
                </tr>
              ) : consultants.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    Noch keine Berater vorhanden
                  </td>
                </tr>
              ) : (
                consultants.map((consultant) => (
                  <tr
                    key={consultant.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <strong className="text-gray-900">{consultant.name}</strong>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{consultant.email}</td>
                    <td className="px-4 py-3">
                      <a
                        href={consultant.calendlyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#D4AF37] hover:underline text-xs"
                      >
                        {consultant.calendlyUrl.substring(0, 40)}...
                      </a>
                    </td>
                    <td className="px-4 py-3 text-center font-semibold">
                      {consultant.assignedLeads}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">
                      {consultant.maxLeadsPerDay || '∞'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          consultant.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {consultant.isActive ? 'Aktiv' : 'Inaktiv'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">
                      {formatDate(consultant.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(consultant)}
                          className="p-2 text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(consultant.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => {
            setShowModal(false);
            setEditingId(null);
          }}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-lg w-full m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {editingId ? 'Berater bearbeiten' : 'Neuer Berater'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none"
                    placeholder="Thomas Gross"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none"
                    placeholder="thomas@beispiel.de"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Calendly URL *
                  </label>
                  <input
                    type="url"
                    value={formData.calendlyUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, calendlyUrl: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none"
                    placeholder="https://calendly.com/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Max Leads pro Tag
                  </label>
                  <input
                    type="number"
                    value={formData.maxLeadsPerDay}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxLeadsPerDay: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none"
                    placeholder="10"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-4 h-4"
                  />
                  <label htmlFor="isActive" className="text-sm font-semibold text-gray-700">
                    Aktiv
                  </label>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 font-bold rounded hover:bg-gray-300"
                >
                  Abbrechen
                </button>
                <button
                  onClick={editingId ? handleUpdate : handleCreate}
                  className="flex-1 px-4 py-2 bg-[#D4AF37] hover:bg-[#B8960C] text-black font-bold rounded"
                >
                  {editingId ? 'Aktualisieren' : 'Erstellen'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </CrmLayout>
  );
}
