import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Store, 
  MapPin, 
  Phone, 
  User, 
  MoreVertical,
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Filter,
  SortAsc,
  Eye,
  Settings,
  Globe,
  Calendar,
  Building,
  Wifi,
  WifiOff
} from 'lucide-react';

interface Store {
  id: string;
  name: string;
  code: string;
  location: string;
  contactNumber?: string;
  type: string;
  timezone: string;
  status: 'PENDING_SETUP' | 'ACTIVE' | 'MAINTENANCE' | 'DELETED';
  posSyncStatus: 'SYNCED' | 'PENDING' | 'FAILED';
  lastSynced?: string;
  adminName?: string;
  adminEmail?: string;
  totalSales: number;
  ordersCount: number;
  createdAt: string;
}

interface StoreAdmin {
  id: string;
  name: string;
  email: string;
  phone: string;
  isAssigned: boolean;
}

const Stores = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Wizard form data
  const [wizardData, setWizardData] = useState({
    step1: {
      name: '',
      location: '',
      contactNumber: '',
      type: 'retail',
      timezone: 'UTC'
    },
    step2: {
      adminOption: 'existing',
      existingAdminId: '',
      newAdmin: {
        name: '',
        email: '',
        phone: '',
        password: ''
      }
    },
    step3: {
      autoSync: true
    }
  });

  // Mock data - replace with API calls
  useEffect(() => {
    const mockStores: Store[] = [
      {
        id: '1',
        name: 'Downtown Mall',
        code: 'DTM001',
        location: '123 Main Street, Downtown',
        contactNumber: '+1-555-0123',
        type: 'retail',
        timezone: 'America/New_York',
        status: 'ACTIVE',
        posSyncStatus: 'SYNCED',
        lastSynced: '2024-01-15T10:30:00Z',
        adminName: 'John Smith',
        adminEmail: 'john@downtown.com',
        totalSales: 45000,
        ordersCount: 1250,
        createdAt: '2024-01-15'
      },
      {
        id: '2',
        name: 'Westside Store',
        code: 'WSS002',
        location: '456 West Avenue, Westside',
        contactNumber: '+1-555-0456',
        type: 'retail',
        timezone: 'America/Los_Angeles',
        status: 'PENDING_SETUP',
        posSyncStatus: 'PENDING',
        adminName: 'Sarah Johnson',
        adminEmail: 'sarah@westside.com',
        totalSales: 0,
        ordersCount: 0,
        createdAt: '2024-01-20'
      },
      {
        id: '3',
        name: 'Central Plaza',
        code: 'CPL003',
        location: '789 Central Blvd, Midtown',
        contactNumber: '+1-555-0789',
        type: 'wholesale',
        timezone: 'America/Chicago',
        status: 'MAINTENANCE',
        posSyncStatus: 'FAILED',
        lastSynced: '2024-01-10T15:45:00Z',
        adminName: 'Mike Davis',
        adminEmail: 'mike@central.com',
        totalSales: 52000,
        ordersCount: 1450,
        createdAt: '2024-01-10'
      }
    ];
    setStores(mockStores);
    setLoading(false);
  }, []);

  // Mock store admins
  const storeAdmins: StoreAdmin[] = [
    { id: '1', name: 'John Smith', email: 'john@downtown.com', phone: '+1-555-0123', isAssigned: true },
    { id: '2', name: 'Sarah Johnson', email: 'sarah@westside.com', phone: '+1-555-0456', isAssigned: true },
    { id: '3', name: 'Mike Davis', email: 'mike@central.com', phone: '+1-555-0789', isAssigned: true },
    { id: '4', name: 'Lisa Brown', email: 'lisa@unassigned.com', phone: '+1-555-0111', isAssigned: false },
    { id: '5', name: 'Tom Wilson', email: 'tom@unassigned.com', phone: '+1-555-0222', isAssigned: false }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'PENDING_SETUP': return 'bg-yellow-100 text-yellow-800';
      case 'MAINTENANCE': return 'bg-orange-100 text-orange-800';
      case 'DELETED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Active';
      case 'PENDING_SETUP': return 'Pending Setup';
      case 'MAINTENANCE': return 'Maintenance';
      case 'DELETED': return 'Deleted';
      default: return status;
    }
  };

  const getSyncStatusIcon = (status: string) => {
    switch (status) {
      case 'SYNCED': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'PENDING': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'FAILED': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getSyncStatusColor = (status: string) => {
    switch (status) {
      case 'SYNCED': return 'text-green-600';
      case 'PENDING': return 'text-yellow-600';
      case 'FAILED': return 'text-red-600';
      default: return 'text-gray-400';
    }
  };

  const handleWizardSubmit = async (step: number) => {
    if (step === 1) {
      setWizardStep(2);
    } else if (step === 2) {
      setWizardStep(3);
    } else if (step === 3) {
      // Final step - create store
      try {
        // Simulate API calls
        const newStore: Store = {
          id: Date.now().toString(),
          name: wizardData.step1.name,
          code: `ST${Date.now().toString().slice(-3)}`,
          location: wizardData.step1.location,
          contactNumber: wizardData.step1.contactNumber,
          type: wizardData.step1.type,
          timezone: wizardData.step1.timezone,
          status: 'PENDING_SETUP',
          posSyncStatus: 'PENDING',
          totalSales: 0,
          ordersCount: 0,
          createdAt: new Date().toISOString()
        };

        // Add admin if new
        if (wizardData.step2.adminOption === 'new') {
          newStore.adminName = wizardData.step2.newAdmin.name;
          newStore.adminEmail = wizardData.step2.newAdmin.email;
        } else if (wizardData.step2.existingAdminId) {
          const admin = storeAdmins.find(a => a.id === wizardData.step2.existingAdminId);
          if (admin) {
            newStore.adminName = admin.name;
            newStore.adminEmail = admin.email;
          }
        }

        // Simulate POS sync
        if (wizardData.step3.autoSync) {
          setTimeout(() => {
            newStore.status = 'ACTIVE';
            newStore.posSyncStatus = 'SYNCED';
            newStore.lastSynced = new Date().toISOString();
            setStores(prev => prev.map(s => s.id === newStore.id ? newStore : s));
          }, 2000);
        }

        setStores([newStore, ...stores]);
        setShowWizard(false);
        setWizardStep(1);
        setWizardData({
          step1: { name: '', location: '', contactNumber: '', type: 'retail', timezone: 'UTC' },
          step2: { adminOption: 'existing', existingAdminId: '', newAdmin: { name: '', email: '', phone: '', password: '' } },
          step3: { autoSync: true }
        });
      } catch (error) {
        console.error('Error creating store:', error);
      }
    }
  };

  const handleSyncStore = async (storeId: string) => {
    // Simulate POS sync
    setStores(prev => prev.map(store => 
      store.id === storeId 
        ? { ...store, posSyncStatus: 'SYNCED', lastSynced: new Date().toISOString() }
        : store
    ));
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this store? This action cannot be undone.')) {
      setStores(prev => prev.map(store => 
        store.id === id ? { ...store, status: 'DELETED' } : store
      ));
    }
  };

  const toggleMenu = (storeId: string) => {
    setOpenMenuId(openMenuId === storeId ? null : storeId);
  };

  const closeMenu = () => {
    setOpenMenuId(null);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId && !(event.target as Element).closest('.menu-container')) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  const filteredAndSortedStores = stores
    .filter(store => 
      store.status !== 'DELETED' &&
      (statusFilter === 'all' || store.status === statusFilter) &&
      (store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       store.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
       store.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
       store.adminName?.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'sales':
          aValue = a.totalSales;
          bValue = b.totalSales;
          break;
        case 'orders':
          aValue = a.ordersCount;
          bValue = b.ordersCount;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-lg text-gray-600 mt-4">Loading stores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Store Management</h1>
          <p className="text-xl text-gray-600">Manage all stores in your cluster</p>
        </div>
        <button
          onClick={() => setShowWizard(true)}
          className="btn-primary flex items-center text-xl px-8 py-4"
        >
          <Plus className="w-6 h-6 mr-3" />
          + Add Store
        </button>
      </div>

      {/* Search, Filters, and Sorting */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search stores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-12"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="PENDING_SETUP">Pending Setup</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field"
          >
            <option value="name">Sort by Name</option>
            <option value="sales">Sort by Sales</option>
            <option value="orders">Sort by Orders</option>
            <option value="status">Sort by Status</option>
          </select>

          {/* Sort Order */}
          <button
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="input-field flex items-center justify-center hover:bg-gray-50"
          >
            <SortAsc className={`w-5 h-5 mr-2 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </button>
        </div>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAndSortedStores.map((store) => (
          <div key={store.id} className="card hover:shadow-xl transition-all duration-200">
            {/* Store Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <Store className="w-6 h-6 text-primary-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-xl font-semibold text-gray-900">{store.name}</h3>
                  <p className="text-sm text-gray-500 font-mono">{store.code}</p>
                </div>
              </div>
              
                            {/* Three-dot Menu */}
              <div className="relative menu-container">
                <button 
                  onClick={() => toggleMenu(store.id)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                {openMenuId === store.id && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                    <button
                      onClick={() => {
                        setSelectedStore(store);
                        setShowDetailsModal(true);
                        closeMenu();
                      }}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-3" />
                      View Details
                    </button>
                    <button
                      onClick={() => {
                        setEditingStore(store);
                        setShowEditModal(true);
                        closeMenu();
                      }}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <Edit className="w-4 h-4 mr-3" />
                      Edit Store
                    </button>
                    <button
                      onClick={() => {
                        handleSyncStore(store.id);
                        closeMenu();
                      }}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <RefreshCw className="w-4 h-4 mr-3" />
                      Sync to POS
                    </button>
                    <hr className="my-2" />
                    <button
                      onClick={() => {
                        handleDelete(store.id);
                        closeMenu();
                      }}
                      className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center"
                    >
                      <Trash2 className="w-4 h-4 mr-3" />
                      Delete Store
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Status and Sync Info */}
            <div className="flex items-center justify-between mb-4">
              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(store.status)}`}>
                {getStatusLabel(store.status)}
              </span>
              <div className="flex items-center space-x-2">
                {getSyncStatusIcon(store.posSyncStatus)}
                <span className={`text-sm font-medium ${getSyncStatusColor(store.posSyncStatus)}`}>
                  {store.posSyncStatus === 'SYNCED' ? 'Synced' : 
                   store.posSyncStatus === 'PENDING' ? 'Pending' : 'Failed'}
                </span>
              </div>
            </div>

            {/* Store Details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-3" />
                <span className="text-sm">{store.location}</span>
              </div>
              
              {store.adminName && (
                <div className="flex items-center text-gray-600">
                  <User className="w-4 h-4 mr-3" />
                  <span className="text-sm">{store.adminName}</span>
                </div>
              )}
              
              {store.contactNumber && (
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-3" />
                  <span className="text-sm">{store.contactNumber}</span>
                </div>
              )}

              <div className="flex items-center text-gray-600">
                <Building className="w-4 h-4 mr-3" />
                <span className="text-sm capitalize">{store.type}</span>
              </div>

              <div className="flex items-center text-gray-600">
                <Globe className="w-4 h-4 mr-3" />
                <span className="text-sm">{store.timezone}</span>
              </div>
            </div>

            {/* Last Synced */}
            {store.lastSynced && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Last Synced: {new Date(store.lastSynced).toLocaleDateString()}</span>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Sales</p>
                  <p className="text-xl font-bold text-green-600">${store.totalSales.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Orders</p>
                  <p className="text-xl font-bold text-blue-600">{store.ordersCount}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Multi-Step Add Store Wizard */}
      {showWizard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Add New Store</h2>
                  <button
                    onClick={() => {
                      setShowWizard(false);
                      setWizardStep(1);
                      setWizardData({
                        step1: { name: '', location: '', contactNumber: '', type: 'retail', timezone: 'UTC' },
                        step2: { adminOption: 'existing', existingAdminId: '', newAdmin: { name: '', email: '', phone: '', password: '' } },
                        step3: { autoSync: true }
                      });
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center ${wizardStep >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      wizardStep >= 1 ? 'border-primary-600 bg-primary-600 text-white' : 'border-gray-300'
                    }`}>
                      {wizardStep > 1 ? '✓' : '1'}
                    </div>
                    <span className="ml-2 font-medium">Store Details</span>
                  </div>
                  
                  <div className={`flex-1 h-1 ${wizardStep >= 2 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
                  
                  <div className={`flex items-center ${wizardStep >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      wizardStep >= 2 ? 'border-primary-600 bg-primary-600 text-white' : 'border-gray-300'
                    }`}>
                      {wizardStep > 2 ? '✓' : '2'}
                    </div>
                    <span className="ml-2 font-medium">Assign Admin</span>
                  </div>
                  
                  <div className={`flex-1 h-1 ${wizardStep >= 3 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
                  
                  <div className={`flex items-center ${wizardStep >= 3 ? 'text-primary-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      wizardStep >= 3 ? 'border-primary-600 bg-primary-600 text-white' : 'border-gray-300'
                    }`}>
                      3
                    </div>
                    <span className="ml-2 font-medium">Sync to POS</span>
                  </div>
                </div>
              </div>

              {/* Step 1: Store Details */}
              {wizardStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Store Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2">Store Name *</label>
                      <input
                        type="text"
                        required
                        value={wizardData.step1.name}
                        onChange={(e) => setWizardData({
                          ...wizardData,
                          step1: { ...wizardData.step1, name: e.target.value }
                        })}
                        className="input-field"
                        placeholder="Enter store name"
                      />
                    </div>

                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2">Store Type *</label>
                      <select
                        value={wizardData.step1.type}
                        onChange={(e) => setWizardData({
                          ...wizardData,
                          step1: { ...wizardData.step1, type: e.target.value }
                        })}
                        className="input-field"
                      >
                        <option value="retail">Retail</option>
                        <option value="wholesale">Wholesale</option>
                        <option value="restaurant">Restaurant</option>
                        <option value="service">Service</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2">Location *</label>
                      <input
                        type="text"
                        required
                        value={wizardData.step1.location}
                        onChange={(e) => setWizardData({
                          ...wizardData,
                          step1: { ...wizardData.step1, location: e.target.value }
                        })}
                        className="input-field"
                        placeholder="Enter store location"
                      />
                    </div>

                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2">Contact Number</label>
                      <input
                        type="tel"
                        value={wizardData.step1.contactNumber}
                        onChange={(e) => setWizardData({
                          ...wizardData,
                          step1: { ...wizardData.step1, contactNumber: e.target.value }
                        })}
                        className="input-field"
                        placeholder="Enter contact number"
                      />
                    </div>

                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2">Timezone *</label>
                      <select
                        value={wizardData.step1.timezone}
                        onChange={(e) => setWizardData({
                          ...wizardData,
                          step1: { ...wizardData.step1, timezone: e.target.value }
                        })}
                        className="input-field"
                      >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                        <option value="Europe/London">London</option>
                        <option value="Asia/Tokyo">Tokyo</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6">
                    <button
                      type="button"
                      onClick={() => setShowWizard(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleWizardSubmit(1)}
                      disabled={!wizardData.step1.name || !wizardData.step1.location}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Assign Admin */}
              {wizardStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Assign Store Administrator</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2">Admin Assignment</label>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="existing"
                            checked={wizardData.step2.adminOption === 'existing'}
                            onChange={(e) => setWizardData({
                              ...wizardData,
                              step2: { ...wizardData.step2, adminOption: e.target.value }
                            })}
                            className="mr-3"
                          />
                          Select Existing Admin
                        </label>
                        
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="new"
                            checked={wizardData.step2.adminOption === 'new'}
                            onChange={(e) => setWizardData({
                              ...wizardData,
                              step2: { ...wizardData.step2, adminOption: e.target.value }
                            })}
                            className="mr-3"
                          />
                          Create New Admin
                        </label>
                      </div>
                    </div>

                    {wizardData.step2.adminOption === 'existing' && (
                      <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">Select Admin</label>
                        <select
                          value={wizardData.step2.existingAdminId}
                          onChange={(e) => setWizardData({
                            ...wizardData,
                            step2: { ...wizardData.step2, existingAdminId: e.target.value }
                          })}
                          className="input-field"
                        >
                          <option value="">Choose an admin...</option>
                          {storeAdmins.filter(admin => !admin.isAssigned).map(admin => (
                            <option key={admin.id} value={admin.id}>
                              {admin.name} ({admin.email})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {wizardData.step2.adminOption === 'new' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-lg font-medium text-gray-700 mb-2">Name *</label>
                          <input
                            type="text"
                            required
                            value={wizardData.step2.newAdmin.name}
                            onChange={(e) => setWizardData({
                              ...wizardData,
                              step2: {
                                ...wizardData.step2,
                                newAdmin: { ...wizardData.step2.newAdmin, name: e.target.value }
                              }
                            })}
                            className="input-field"
                            placeholder="Enter admin name"
                          />
                        </div>

                        <div>
                          <label className="block text-lg font-medium text-gray-700 mb-2">Email *</label>
                          <input
                            type="email"
                            required
                            value={wizardData.step2.newAdmin.email}
                            onChange={(e) => setWizardData({
                              ...wizardData,
                              step2: {
                                ...wizardData.step2,
                                newAdmin: { ...wizardData.step2.newAdmin, email: e.target.value }
                              }
                            })}
                            className="input-field"
                            placeholder="Enter admin email"
                          />
                        </div>

                        <div>
                          <label className="block text-lg font-medium text-gray-700 mb-2">Phone</label>
                          <input
                            type="tel"
                            value={wizardData.step2.newAdmin.phone}
                            onChange={(e) => setWizardData({
                              ...wizardData,
                              step2: {
                                ...wizardData.step2,
                                newAdmin: { ...wizardData.step2.newAdmin, phone: e.target.value }
                              }
                            })}
                            className="input-field"
                            placeholder="Enter phone number"
                          />
                        </div>

                        <div>
                          <label className="block text-lg font-medium text-gray-700 mb-2">Password *</label>
                          <input
                            type="password"
                            required
                            value={wizardData.step2.newAdmin.password}
                            onChange={(e) => setWizardData({
                              ...wizardData,
                              step2: {
                                ...wizardData.step2,
                                newAdmin: { ...wizardData.step2.newAdmin, password: e.target.value }
                              }
                            })}
                            className="input-field"
                            placeholder="Enter password"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between space-x-4 pt-6">
                    <button
                      onClick={() => setWizardStep(1)}
                      className="btn-secondary"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => handleWizardSubmit(2)}
                      disabled={
                        (wizardData.step2.adminOption === 'existing' && !wizardData.step2.existingAdminId) ||
                        (wizardData.step2.adminOption === 'new' && (!wizardData.step2.newAdmin.name || !wizardData.step2.newAdmin.email || !wizardData.step2.newAdmin.password))
                      }
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Sync to POS */}
              {wizardStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Sync to POS System</h3>
                  
                  {/* Summary Card */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Store Summary</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Store Name</p>
                        <p className="font-medium">{wizardData.step1.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-medium">{wizardData.step1.location}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Type</p>
                        <p className="font-medium capitalize">{wizardData.step1.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Admin</p>
                        <p className="font-medium">
                          {wizardData.step2.adminOption === 'existing' 
                            ? storeAdmins.find(a => a.id === wizardData.step2.existingAdminId)?.name
                            : wizardData.step2.newAdmin.name
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={wizardData.step3.autoSync}
                        onChange={(e) => setWizardData({
                          ...wizardData,
                          step3: { ...wizardData.step3, autoSync: e.target.checked }
                        })}
                        className="mr-3 w-5 h-5"
                      />
                      <span className="text-lg">Auto Sync Now</span>
                    </label>
                    
                    <p className="text-gray-600">
                      {wizardData.step3.autoSync 
                        ? "Store will be automatically synced to POS system after creation."
                        : "Store will be created but you'll need to manually sync to POS later."
                      }
                    </p>
                  </div>

                  <div className="flex justify-between space-x-4 pt-6">
                    <button
                      onClick={() => setWizardStep(2)}
                      className="btn-secondary"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => handleWizardSubmit(3)}
                      className="btn-primary"
                    >
                      Create Store & Sync
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Store Details Modal */}
      {showDetailsModal && selectedStore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Store Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Store Name</p>
                    <p className="text-lg font-semibold">{selectedStore.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Store Code</p>
                    <p className="text-lg font-mono">{selectedStore.code}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedStore.status)}`}>
                      {getStatusLabel(selectedStore.status)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">POS Sync Status</p>
                    <div className="flex items-center space-x-2">
                      {getSyncStatusIcon(selectedStore.posSyncStatus)}
                      <span className={getSyncStatusColor(selectedStore.posSyncStatus)}>
                        {selectedStore.posSyncStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600">Location</p>
                  <p className="text-lg">{selectedStore.location}</p>
                </div>

                {selectedStore.adminName && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Store Admin</p>
                    <p className="text-lg">{selectedStore.adminName}</p>
                    <p className="text-sm text-gray-500">{selectedStore.adminEmail}</p>
                  </div>
                )}

                {selectedStore.lastSynced && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Last Synced</p>
                    <p className="text-lg">{new Date(selectedStore.lastSynced).toLocaleString()}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Sales</p>
                    <p className="text-2xl font-bold text-green-600">${selectedStore.totalSales.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-blue-600">{selectedStore.ordersCount}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="btn-secondary"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setEditingStore(selectedStore);
                    setShowEditModal(true);
                  }}
                  className="btn-primary"
                >
                  Edit Store
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Store Modal */}
      {showEditModal && editingStore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Store</h2>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">Store Name</label>
                    <input
                      type="text"
                      defaultValue={editingStore.name}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">Status</label>
                    <select
                      defaultValue={editingStore.status}
                      className="input-field"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="PENDING_SETUP">Pending Setup</option>
                      <option value="MAINTENANCE">Maintenance</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      defaultValue={editingStore.location}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">Contact Number</label>
                    <input
                      type="tel"
                      defaultValue={editingStore.contactNumber}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingStore(null);
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Update Store
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

export default Stores;
