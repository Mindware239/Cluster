import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Tag, Calendar, TrendingUp, Store } from 'lucide-react';

interface Promotion {
  id: string;
  storeId: string;
  title: string;
  discountPercent: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive' | 'expired';
  createdAt: Date;
  updatedAt: Date;
}

const Promotions: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [filteredPromotions, setFilteredPromotions] = useState<Promotion[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [storeFilter, setStoreFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock stores for filter
  const stores = [
    { id: '1', name: 'Downtown Mall' },
    { id: '2', name: 'Westside Store' },
    { id: '3', name: 'Central Plaza' }
  ];

  useEffect(() => {
    fetchPromotions();
  }, []);

  useEffect(() => {
    filterPromotions();
  }, [promotions, searchTerm, statusFilter, storeFilter]);

  const fetchPromotions = async () => {
    try {
      // Simulate API call
      const mockPromotions: Promotion[] = [
        {
          id: '1',
          storeId: '1',
          title: 'Summer Sale',
          discountPercent: 20,
          startDate: '2024-06-01',
          endDate: '2024-08-31',
          status: 'active',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: '2',
          storeId: '2',
          title: 'Holiday Special',
          discountPercent: 15,
          startDate: '2024-12-01',
          endDate: '2024-12-31',
          status: 'active',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: '3',
          storeId: '1',
          title: 'Clearance Event',
          discountPercent: 30,
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          status: 'expired',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: '4',
          storeId: '3',
          title: 'New Year Discount',
          discountPercent: 25,
          startDate: '2024-01-01',
          endDate: '2024-01-15',
          status: 'expired',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: '5',
          storeId: '2',
          title: 'Spring Collection',
          discountPercent: 18,
          startDate: '2024-03-01',
          endDate: '2024-05-31',
          status: 'inactive',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15')
        }
      ];

      setPromotions(mockPromotions);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching promotions:', error);
      setIsLoading(false);
    }
  };

  const filterPromotions = () => {
    let filtered = promotions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(promotion =>
        promotion.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(promotion => promotion.status === statusFilter);
    }

    // Store filter
    if (storeFilter !== 'all') {
      filtered = filtered.filter(promotion => promotion.storeId === storeFilter);
    }

    setFilteredPromotions(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <TrendingUp className="w-4 h-4" />;
      case 'inactive':
        return <Tag className="w-4 h-4" />;
      case 'expired':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Tag className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  const handleEdit = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this promotion?')) {
      try {
        // Simulate API call
        setPromotions(prev => prev.filter(promotion => promotion.id !== id));
        alert('Promotion deleted successfully');
      } catch (error) {
        console.error('Error deleting promotion:', error);
        alert('Error deleting promotion');
      }
    }
  };

  const handleSave = async (promotionData: Partial<Promotion>) => {
    try {
      if (editingPromotion) {
        // Update existing promotion
        const updatedPromotion = { ...editingPromotion, ...promotionData, updatedAt: new Date() };
        setPromotions(prev => prev.map(promotion => promotion.id === editingPromotion.id ? updatedPromotion : promotion));
        alert('Promotion updated successfully');
      } else {
        // Create new promotion
        const newPromotion: Promotion = {
          id: Date.now().toString(),
          storeId: promotionData.storeId || '1',
          title: promotionData.title || '',
          discountPercent: promotionData.discountPercent || 0,
          startDate: promotionData.startDate || '',
          endDate: promotionData.endDate || '',
          status: promotionData.status || 'inactive',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setPromotions(prev => [...prev, newPromotion]);
        alert('Promotion created successfully');
      }
      setIsModalOpen(false);
      setEditingPromotion(null);
    } catch (error) {
      console.error('Error saving promotion:', error);
      alert('Error saving promotion');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading promotions...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Promotions Management</h1>
          <p className="text-lg text-gray-600 mt-2">Manage promotional campaigns across all stores</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2 px-6 py-3 text-lg"
        >
          <Plus className="w-5 h-5" />
          Add New Promotion
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3">
            <Tag className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Promotions</p>
              <p className="text-2xl font-bold text-gray-900">{promotions.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Active Promotions</p>
              <p className="text-2xl font-bold text-gray-900">{promotions.filter(p => p.status === 'active').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3">
            <Store className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Stores with Promotions</p>
              <p className="text-2xl font-bold text-gray-900">{new Set(promotions.map(p => p.storeId)).size}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Expired Promotions</p>
              <p className="text-2xl font-bold text-gray-900">{promotions.filter(p => p.status === 'expired').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search promotions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 w-full"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
          </select>

          {/* Store Filter */}
          <select
            value={storeFilter}
            onChange={(e) => setStoreFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">All Stores</option>
            {stores.map(store => (
              <option key={store.id} value={store.id}>{store.name}</option>
            ))}
          </select>

          {/* Results Count */}
          <div className="flex items-center justify-center bg-gray-50 rounded-lg px-4 py-2">
            <span className="text-lg font-medium text-gray-700">
              {filteredPromotions.length} promotions
            </span>
          </div>
        </div>
      </div>

      {/* Promotions Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Promotion</th>
                <th className="table-header">Store</th>
                <th className="table-header">Discount</th>
                <th className="table-header">Duration</th>
                <th className="table-header">Status</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPromotions.map((promotion) => {
                const store = stores.find(s => s.id === promotion.storeId);
                return (
                  <tr key={promotion.id} className="hover:bg-gray-50">
                    <td className="table-cell">
                      <div>
                        <div className="font-medium text-gray-900 text-lg">{promotion.title}</div>
                        <div className="text-sm text-gray-500">ID: {promotion.id}</div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <Store className="w-4 h-4 text-blue-600" />
                        <span className="text-lg">{store?.name || 'Unknown Store'}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {promotion.discountPercent}% OFF
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="text-lg">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span>{formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}</span>
                        </div>
                        {isExpired(promotion.endDate) && (
                          <div className="text-sm text-red-600 mt-1">Expired</div>
                        )}
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(promotion.status)}`}>
                        {getStatusIcon(promotion.status)}
                        {promotion.status.charAt(0).toUpperCase() + promotion.status.slice(1)}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(promotion)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(promotion.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingPromotion ? 'Edit Promotion' : 'Add New Promotion'}
              </h2>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleSave({
                  storeId: formData.get('storeId') as string,
                  title: formData.get('title') as string,
                  discountPercent: parseInt(formData.get('discountPercent') as string),
                  startDate: formData.get('startDate') as string,
                  endDate: formData.get('endDate') as string,
                  status: formData.get('status') as 'active' | 'inactive' | 'expired'
                });
              }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Store</label>
                    <select
                      name="storeId"
                      defaultValue={editingPromotion?.storeId || '1'}
                      className="input-field w-full"
                      required
                    >
                      {stores.map(store => (
                        <option key={store.id} value={store.id}>{store.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Promotion Title</label>
                    <input
                      type="text"
                      name="title"
                      defaultValue={editingPromotion?.title || ''}
                      className="input-field w-full"
                      placeholder="Enter promotion title"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount Percentage</label>
                    <input
                      type="number"
                      name="discountPercent"
                      defaultValue={editingPromotion?.discountPercent || 0}
                      className="input-field w-full"
                      min="0"
                      max="100"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      defaultValue={editingPromotion?.startDate || ''}
                      className="input-field w-full"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      defaultValue={editingPromotion?.endDate || ''}
                      className="input-field w-full"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      name="status"
                      defaultValue={editingPromotion?.status || 'inactive'}
                      className="input-field w-full"
                      required
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingPromotion(null);
                    }}
                    className="btn-secondary px-6 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary px-6 py-2"
                  >
                    {editingPromotion ? 'Update Promotion' : 'Add Promotion'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Promotions;
