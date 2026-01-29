'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '@/hooks/useApi';
import { Product, ProductStatus, PaginatedResponse } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState } from 'react';

export default function AdminProductsPage() {
  const api = useApi();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    retailValue: '',
    stock: '',
    palletCount: '',
  });

  const { data, isLoading } = useQuery<PaginatedResponse<Product>>({
    queryKey: ['products', 'admin'],
    queryFn: () => api.get('/products?limit=100'),
  });

  const createMutation = useMutation({
    mutationFn: (productData: any) => api.post('/products', productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setShowForm(false);
      setFormData({
        name: '',
        description: '',
        price: '',
        retailValue: '',
        stock: '',
        palletCount: '',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      retailValue: parseFloat(formData.retailValue),
      stock: parseInt(formData.stock),
      palletCount: parseInt(formData.palletCount),
      status: ProductStatus.AVAILABLE,
      images: [],
    });
  };

  const products = data?.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Product'}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Product</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Price (€) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Retail Value / UVP (€) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.retailValue}
                  onChange={(e) =>
                    setFormData({ ...formData, retailValue: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Stock *
                </label>
                <input
                  type="number"
                  required
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Pallet Count *
                </label>
                <input
                  type="number"
                  required
                  value={formData.palletCount}
                  onChange={(e) =>
                    setFormData({ ...formData, palletCount: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Product'}
            </Button>

            {createMutation.error && (
              <div className="text-red-600 text-sm">
                Error: {createMutation.error.message}
              </div>
            )}
          </form>
        </Card>
      )}

      {isLoading && <div className="text-center py-8">Loading...</div>}

      {!isLoading && products.length > 0 && (
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  UVP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-500">
                      {product.description?.slice(0, 50)}
                    </div>
                  </td>
                  <td className="px-6 py-4">€{Number(product.price || 0).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    €{Number(product.retailValue || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        product.status === ProductStatus.AVAILABLE
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMutation.mutate(product.id)}
                      disabled={deleteMutation.isPending}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
