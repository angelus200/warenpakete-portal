'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ecommercerente.com';

interface KnowledgeProduct {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number | null;
  isFree: boolean;
  fileUrl: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminKnowledgePage() {
  const router = useRouter();
  const [products, setProducts] = useState<KnowledgeProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<KnowledgeProduct | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'guide',
    price: '',
    isFree: false,
    fileUrl: '',
    isActive: true,
    sortOrder: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchProducts(token);
  }, [router]);

  const fetchProducts = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/admin/knowledge`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Unauthorized');
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load knowledge products:', error);
      localStorage.removeItem('adminToken');
      router.push('/admin/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const payload = {
        ...formData,
        price: formData.isFree ? null : Number(formData.price),
        sortOrder: Number(formData.sortOrder),
      };

      const url = editingProduct
        ? `${API_URL}/knowledge/${editingProduct.id}`
        : `${API_URL}/knowledge`;

      const method = editingProduct ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save product');
      }

      await fetchProducts(token);
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Fehler beim Speichern des Produkts');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Möchten Sie dieses Produkt wirklich deaktivieren?')) return;

    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/knowledge/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      await fetchProducts(token);
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Fehler beim Löschen des Produkts');
    }
  };

  const openCreateModal = () => {
    resetForm();
    setEditingProduct(null);
    setShowModal(true);
  };

  const openEditModal = (product: KnowledgeProduct) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      category: product.category,
      price: product.price ? String(product.price) : '',
      isFree: product.isFree,
      fileUrl: product.fileUrl,
      isActive: product.isActive,
      sortOrder: product.sortOrder,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'guide',
      price: '',
      isFree: false,
      fileUrl: '',
      isActive: true,
      sortOrder: 0,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#ebebeb] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Lade Knowledge Products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ebebeb]">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Knowledge Products</h1>
            <p className="text-gray-600">{products.length} Produkte</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-900 rounded-lg transition-all"
            >
              ← Dashboard
            </Link>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-gold hover:bg-gold-dark text-dark font-medium rounded-lg transition-all"
            >
              + Neues Produkt
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-white border-gold/20">
            <h3 className="text-sm text-gray-600 font-medium mb-2">Gesamt</h3>
            <p className="text-2xl font-bold text-gray-900">{products.length}</p>
          </Card>
          <Card className="p-4 bg-white border-gold/20">
            <h3 className="text-sm text-gray-600 font-medium mb-2">Aktiv</h3>
            <p className="text-2xl font-bold text-green-600">
              {products.filter(p => p.isActive).length}
            </p>
          </Card>
          <Card className="p-4 bg-white border-gold/20">
            <h3 className="text-sm text-gray-600 font-medium mb-2">Kostenlos</h3>
            <p className="text-2xl font-bold text-gold">
              {products.filter(p => p.isFree).length}
            </p>
          </Card>
          <Card className="p-4 bg-white border-gold/20">
            <h3 className="text-sm text-gray-600 font-medium mb-2">Premium</h3>
            <p className="text-2xl font-bold text-blue-600">
              {products.filter(p => !p.isFree).length}
            </p>
          </Card>
        </div>

        {/* Products Table */}
        <Card className="bg-white border-gold/20">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Titel</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Kategorie</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Preis</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Sortierung</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{product.title}</p>
                      <p className="text-xs text-gray-600 line-clamp-1">{product.description}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-gold/10 text-gold text-xs rounded-full uppercase">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {product.isFree ? (
                        <span className="text-green-600 font-medium">Kostenlos</span>
                      ) : (
                        <span className="font-medium">€{Number(product.price).toFixed(2)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        product.isActive
                          ? 'bg-green-500/20 text-green-600'
                          : 'bg-gray-500/20 text-gray-600'
                      }`}>
                        {product.isActive ? 'Aktiv' : 'Inaktiv'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {product.sortOrder}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openEditModal(product)}
                        className="text-gold hover:text-gold-dark mr-3 text-sm font-medium"
                      >
                        Bearbeiten
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Deaktivieren
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingProduct ? 'Produkt bearbeiten' : 'Neues Produkt'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titel</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Beschreibung</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kategorie</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  >
                    <option value="guide">Guide</option>
                    <option value="template">Template</option>
                    <option value="academy">Academy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sortierung</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isFree}
                    onChange={(e) => setFormData({ ...formData, isFree: e.target.checked })}
                    className="w-5 h-5 text-gold border-gray-300 rounded focus:ring-gold"
                  />
                  <span className="text-sm font-medium text-gray-700">Kostenlos</span>
                </label>
              </div>

              {!formData.isFree && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preis (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    required={!formData.isFree}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Datei URL</label>
                <input
                  type="text"
                  required
                  value={formData.fileUrl}
                  onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="/downloads/knowledge/..."
                />
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-5 h-5 text-gold border-gray-300 rounded focus:ring-gold"
                  />
                  <span className="text-sm font-medium text-gray-700">Aktiv</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gold hover:bg-gold-dark text-dark font-bold rounded-lg transition-colors"
                >
                  {editingProduct ? 'Speichern' : 'Erstellen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
