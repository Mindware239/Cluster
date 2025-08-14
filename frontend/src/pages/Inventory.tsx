import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, AlertTriangle, Package, DollarSign } from 'lucide-react';

interface InventoryItem {
  id: string;
  storeId: string;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
  status: 'available' | 'lowStock' | 'outOfStock';
  lowStockThreshold: number;
  createdAt: Date;
  updatedAt: Date;
}

const Inventory: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [storeFilter, setStoreFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock stores for filter
  const stores = [
    { id: '1', name: 'Downtown Mall' },
    { id: '2', name: 'Westside Store' },
    { id: '3', name: 'Central Plaza' }
  ];

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    filterInventory();
  }, [inventory, searchTerm, statusFilter, storeFilter]);

  const fetchInventory = async () => {
    try {
      // Simulate API call
      const mockInventory: InventoryItem[] = [
        {
          id: '1',
          storeId: '1',
          productName: 'Laptop',
          sku: 'LAP001',
          quantity: 15,
          price: 999.99,
          status: 'available',
          lowStockThreshold: 10,
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: '2',
          storeId: '1',
          productName: 'Mouse',
          sku: 'MOU001',
          quantity: 8,
          price: 29.99,
          status: 'lowStock',
          lowStockThreshold: 10,
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: '3',
          storeId: '2',
          productName: 'Keyboard',
          sku: 'KEY001',
          quantity: 0,
          price: 79.99,
          status: 'outOfStock',
          lowStockThreshold: 10,
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: '4',
          storeId: '2',
          productName: 'Monitor',
          sku: 'MON001',
          quantity: 12,
          price: 299.99,
          status: 'available',
          lowStockThreshold: 10,
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: '5',
          storeId: '3',
          productName: 'Headphones',
          sku: 'HEA001',
          quantity: 25,
          price: 149.99,
          status: 'available',
          lowStockThreshold: 10,
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15')
        }
      ];

      setInventory(mockInventory);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setIsLoading(false);
    }
  };

  const filterInventory = () => {
    let filtered = inventory;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    // Store filter
    if (storeFilter !== 'all') {
      filtered = filtered.filter(item => item.storeId === storeFilter);
    }

    setFilteredInventory(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'lowStock':
        return 'bg-yellow-100 text-yellow-800';
      case 'outOfStock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <Package className="w-4 h-4" />;
      case 'lowStock':
        return <AlertTriangle className="w-4 h-4" />;
      case 'outOfStock':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        // Simulate API call
        setInventory(prev => prev.filter(item => item.id !== id));
        alert('Item deleted successfully');
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Error deleting item');
      }
    }
  };

  const handleSave = async (itemData: Partial<InventoryItem>) => {
    try {
      if (editingItem) {
        // Update existing item
        const updatedItem = { ...editingItem, ...itemData, updatedAt: new Date() };
        setInventory(prev => prev.map(item => item.id === editingItem.id ? updatedItem : item));
        alert('Item updated successfully');
      } else {
        // Create new item
        const newItem: InventoryItem = {
          id: Date.now().toString(),
          storeId: itemData.storeId || '1',
          productName: itemData.productName || '',
          sku: itemData.sku || '',
          quantity: itemData.quantity || 0,
          price: itemData.price || 0,
          status: itemData.status || 'available',
          lowStockThreshold: itemData.lowStockThreshold || 10,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setInventory(prev => [...prev, newItem]);
        alert('Item created successfully');
      }
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Error saving item');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading inventory...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-lg text-gray-600 mt-2">Manage product inventory across all stores</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2 px-6 py-3 text-lg"
        >
          <Plus className="w-5 h-5" />
          Add New Item
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
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
            <option value="available">Available</option>
            <option value="lowStock">Low Stock</option>
            <option value="outOfStock">Out of Stock</option>
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
              {filteredInventory.length} items
            </span>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Product</th>
                <th className="table-header">SKU</th>
                <th className="table-header">Store</th>
                <th className="table-header">Quantity</th>
                <th className="table-header">Price</th>
                <th className="table-header">Status</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInventory.map((item) => {
                const store = stores.find(s => s.id === item.storeId);
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="table-cell">
                      <div>
                        <div className="font-medium text-gray-900 text-lg">{item.productName}</div>
                        <div className="text-sm text-gray-500">ID: {item.id}</div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="font-mono text-lg">{item.sku}</span>
                    </td>
                    <td className="table-cell">
                      <span className="text-lg">{store?.name || 'Unknown Store'}</span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-medium ${
                          item.quantity <= item.lowStockThreshold ? 'text-red-600' : 'text-gray-900'
                        }`}>
                          {item.quantity}
                        </span>
                        {item.quantity <= item.lowStockThreshold && (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-lg font-medium text-gray-900">
                          {item.price.toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
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
                {editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}
              </h2>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleSave({
                  storeId: formData.get('storeId') as string,
                  productName: formData.get('productName') as string,
                  sku: formData.get('sku') as string,
                  quantity: parseInt(formData.get('quantity') as string),
                  price: parseFloat(formData.get('price') as string),
                  status: formData.get('status') as 'available' | 'lowStock' | 'outOfStock',
                  lowStockThreshold: parseInt(formData.get('lowStockThreshold') as string)
                });
              }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Store</label>
                    <select
                      name="storeId"
                      defaultValue={editingItem?.storeId || '1'}
                      className="input-field w-full"
                      required
                    >
                      {stores.map(store => (
                        <option key={store.id} value={store.id}>{store.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                    <input
                      type="text"
                      name="productName"
                      defaultValue={editingItem?.productName || ''}
                      className="input-field w-full"
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                    <input
                      type="text"
                      name="sku"
                      defaultValue={editingItem?.sku || ''}
                      className="input-field w-full"
                      placeholder="Enter SKU"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      defaultValue={editingItem?.quantity || 0}
                      className="input-field w-full"
                      min="0"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                    <input
                      type="number"
                      name="price"
                      defaultValue={editingItem?.price || 0}
                      className="input-field w-full"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      name="status"
                      defaultValue={editingItem?.status || 'available'}
                      className="input-field w-full"
                      required
                    >
                      <option value="available">Available</option>
                      <option value="lowStock">Low Stock</option>
                      <option value="outOfStock">Out of Stock</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Low Stock Threshold</label>
                    <input
                      type="number"
                      name="lowStockThreshold"
                      defaultValue={editingItem?.lowStockThreshold || 10}
                      className="input-field w-full"
                      min="0"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingItem(null);
                    }}
                    className="btn-secondary px-6 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary px-6 py-2"
                  >
                    {editingItem ? 'Update Item' : 'Add Item'}
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

export default Inventory;
