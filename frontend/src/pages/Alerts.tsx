import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Bell, AlertTriangle, CheckCircle, Clock, Store, Filter } from 'lucide-react';

interface Alert {
  id: string;
  storeId: string;
  message: string;
  alertType: 'StockLow' | 'POSOffline' | 'Promotion' | 'System' | 'Security';
  status: 'unread' | 'read' | 'resolved';
  isUrgent: boolean;
  createdAt: Date;
}

const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [storeFilter, setStoreFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock stores for filter
  const stores = [
    { id: '1', name: 'Downtown Mall' },
    { id: '2', name: 'Westside Store' },
    { id: '3', name: 'Central Plaza' }
  ];

  useEffect(() => {
    fetchAlerts();
  }, []);

  useEffect(() => {
    filterAlerts();
  }, [alerts, searchTerm, typeFilter, statusFilter, storeFilter, urgencyFilter]);

  const fetchAlerts = async () => {
    try {
      // Simulate API call
      const mockAlerts: Alert[] = [
        {
          id: '1',
          storeId: '1',
          message: 'Low stock alert: Mouse quantity below threshold (8 remaining)',
          alertType: 'StockLow',
          status: 'unread',
          isUrgent: true,
          createdAt: new Date('2024-01-15T10:30:00')
        },
        {
          id: '2',
          storeId: '2',
          message: 'POS system offline for 15 minutes - requires immediate attention',
          alertType: 'POSOffline',
          status: 'unread',
          isUrgent: true,
          createdAt: new Date('2024-01-15T09:15:00')
        },
        {
          id: '3',
          storeId: '1',
          message: 'New promotion campaign "Summer Sale" has started successfully',
          alertType: 'Promotion',
          status: 'read',
          isUrgent: false,
          createdAt: new Date('2024-01-15T08:00:00')
        },
        {
          id: '4',
          storeId: '3',
          message: 'System maintenance scheduled for tonight at 2:00 AM',
          alertType: 'System',
          status: 'unread',
          isUrgent: false,
          createdAt: new Date('2024-01-15T07:45:00')
        },
        {
          id: '5',
          storeId: '2',
          message: 'Multiple failed login attempts detected from unknown IP',
          alertType: 'Security',
          status: 'unread',
          isUrgent: true,
          createdAt: new Date('2024-01-15T06:30:00')
        },
        {
          id: '6',
          storeId: '1',
          message: 'Inventory sync completed - 15 items updated',
          alertType: 'System',
          status: 'read',
          isUrgent: false,
          createdAt: new Date('2024-01-15T05:20:00')
        }
      ];

      setAlerts(mockAlerts);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      setIsLoading(false);
    }
  };

  const filterAlerts = () => {
    let filtered = alerts;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(alert =>
        alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.alertType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(alert => alert.alertType === typeFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(alert => alert.status === statusFilter);
    }

    // Store filter
    if (storeFilter !== 'all') {
      filtered = filtered.filter(alert => alert.storeId === storeFilter);
    }

    // Urgency filter
    if (urgencyFilter !== 'all') {
      filtered = filtered.filter(alert => 
        urgencyFilter === 'urgent' ? alert.isUrgent : !alert.isUrgent
      );
    }

    setFilteredAlerts(filtered);
  };

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case 'StockLow':
        return 'bg-yellow-100 text-yellow-800';
      case 'POSOffline':
        return 'bg-red-100 text-red-800';
      case 'Promotion':
        return 'bg-green-100 text-green-800';
      case 'System':
        return 'bg-blue-100 text-blue-800';
      case 'Security':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'StockLow':
        return <AlertTriangle className="w-4 h-4" />;
      case 'POSOffline':
        return <AlertTriangle className="w-4 h-4" />;
      case 'Promotion':
        return <CheckCircle className="w-4 h-4" />;
      case 'System':
        return <Clock className="w-4 h-4" />;
      case 'Security':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread':
        return 'bg-blue-100 text-blue-800';
      case 'read':
        return 'bg-gray-100 text-gray-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const handleEdit = (alert: Alert) => {
    setEditingAlert(alert);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      try {
        // Simulate API call
        setAlerts(prev => prev.filter(alert => alert.id !== id));
        alert('Alert deleted successfully');
      } catch (error) {
        console.error('Error deleting alert:', error);
        alert('Error deleting alert');
      }
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      setAlerts(prev => prev.map(alert => 
        alert.id === id ? { ...alert, status: 'read' as const } : alert
      ));
    } catch (error) {
      console.error('Error updating alert:', error);
    }
  };

  const handleResolve = async (id: string) => {
    try {
      setAlerts(prev => prev.map(alert => 
        alert.id === id ? { ...alert, status: 'resolved' as const } : alert
      ));
    } catch (error) {
      console.error('Error updating alert:', error);
    }
  };

  const handleSave = async (alertData: Partial<Alert>) => {
    try {
      if (editingAlert) {
        // Update existing alert
        const updatedAlert = { ...editingAlert, ...alertData };
        setAlerts(prev => prev.map(alert => alert.id === editingAlert.id ? updatedAlert : alert));
        alert('Alert updated successfully');
      } else {
        // Create new alert
        const newAlert: Alert = {
          id: Date.now().toString(),
          storeId: alertData.storeId || '1',
          message: alertData.message || '',
          alertType: alertData.alertType || 'System',
          status: 'unread',
          isUrgent: alertData.isUrgent || false,
          createdAt: new Date()
        };
        setAlerts(prev => [...prev, newAlert]);
        alert('Alert created successfully');
      }
      setIsModalOpen(false);
      setEditingAlert(null);
    } catch (error) {
      console.error('Error saving alert:', error);
      alert('Error saving alert');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading alerts...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alerts & Notifications</h1>
          <p className="text-lg text-gray-600 mt-2">Monitor and manage system alerts across all stores</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2 px-6 py-3 text-lg"
        >
          <Plus className="w-5 h-5" />
          Create Alert
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Urgent Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{alerts.filter(a => a.isUrgent).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-gray-900">{alerts.filter(a => a.status === 'unread').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-gray-900">{alerts.filter(a => a.status === 'resolved').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 w-full"
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">All Types</option>
            <option value="StockLow">Stock Low</option>
            <option value="POSOffline">POS Offline</option>
            <option value="Promotion">Promotion</option>
            <option value="System">System</option>
            <option value="Security">Security</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="resolved">Resolved</option>
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

          {/* Urgency Filter */}
          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="normal">Normal</option>
          </select>

          {/* Results Count */}
          <div className="flex items-center justify-center bg-gray-50 rounded-lg px-4 py-2">
            <span className="text-lg font-medium text-gray-700">
              {filteredAlerts.length} alerts
            </span>
          </div>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Alert</th>
                <th className="table-header">Type</th>
                <th className="table-header">Store</th>
                <th className="table-header">Priority</th>
                <th className="table-header">Status</th>
                <th className="table-header">Time</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAlerts.map((alert) => {
                const store = stores.find(s => s.id === alert.storeId);
                return (
                  <tr key={alert.id} className={`hover:bg-gray-50 ${alert.status === 'unread' ? 'bg-blue-50' : ''}`}>
                    <td className="table-cell">
                      <div className="max-w-md">
                        <div className="font-medium text-gray-900 text-lg">{alert.message}</div>
                        <div className="text-sm text-gray-500">ID: {alert.id}</div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getAlertTypeColor(alert.alertType)}`}>
                        {getAlertTypeIcon(alert.alertType)}
                        {alert.alertType.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <Store className="w-4 h-4 text-blue-600" />
                        <span className="text-lg">{store?.name || 'Unknown Store'}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        alert.isUrgent 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {alert.isUrgent ? 'Urgent' : 'Normal'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(alert.status)}`}>
                        {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="text-lg text-gray-900">
                        {formatTimeAgo(alert.createdAt)}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        {alert.status === 'unread' && (
                          <>
                            <button
                              onClick={() => handleMarkAsRead(alert.id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Mark as Read"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleResolve(alert.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Resolve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleEdit(alert)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(alert.id)}
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
                {editingAlert ? 'Edit Alert' : 'Create New Alert'}
              </h2>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleSave({
                  storeId: formData.get('storeId') as string,
                  message: formData.get('message') as string,
                  alertType: formData.get('alertType') as 'StockLow' | 'POSOffline' | 'Promotion' | 'System' | 'Security',
                  isUrgent: formData.get('isUrgent') === 'true'
                });
              }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Store</label>
                    <select
                      name="storeId"
                      defaultValue={editingAlert?.storeId || '1'}
                      className="input-field w-full"
                      required
                    >
                      {stores.map(store => (
                        <option key={store.id} value={store.id}>{store.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Alert Type</label>
                    <select
                      name="alertType"
                      defaultValue={editingAlert?.alertType || 'System'}
                      className="input-field w-full"
                      required
                    >
                      <option value="StockLow">Stock Low</option>
                      <option value="POSOffline">POS Offline</option>
                      <option value="Promotion">Promotion</option>
                      <option value="System">System</option>
                      <option value="Security">Security</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      name="message"
                      defaultValue={editingAlert?.message || ''}
                      className="input-field w-full"
                      rows={3}
                      placeholder="Enter alert message"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      name="isUrgent"
                      defaultValue={editingAlert?.isUrgent?.toString() || 'false'}
                      className="input-field w-full"
                      required
                    >
                      <option value="false">Normal</option>
                      <option value="true">Urgent</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingAlert(null);
                    }}
                    className="btn-secondary px-6 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary px-6 py-2"
                  >
                    {editingAlert ? 'Update Alert' : 'Create Alert'}
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

export default Alerts;
