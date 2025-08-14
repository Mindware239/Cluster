import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, User, TrendingUp, Calendar, Users } from 'lucide-react';

interface StaffMember {
  id: string;
  storeId: string;
  name: string;
  role: string;
  salesCount: number;
  attendanceDays: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const Staff: React.FC = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<StaffMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [storeFilter, setStoreFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<StaffMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock stores for filter
  const stores = [
    { id: '1', name: 'Downtown Mall' },
    { id: '2', name: 'Westside Store' },
    { id: '3', name: 'Central Plaza' }
  ];

  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    filterStaff();
  }, [staff, searchTerm, roleFilter, storeFilter, statusFilter]);

  const fetchStaff = async () => {
    try {
      // Simulate API call
      const mockStaff: StaffMember[] = [
        {
          id: '1',
          storeId: '1',
          name: 'John Smith',
          role: 'Manager',
          salesCount: 45,
          attendanceDays: 22,
          status: 'active',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: '2',
          storeId: '1',
          name: 'Alice Johnson',
          role: 'Cashier',
          salesCount: 32,
          attendanceDays: 20,
          status: 'active',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: '3',
          storeId: '2',
          name: 'Bob Wilson',
          role: 'Manager',
          salesCount: 38,
          attendanceDays: 21,
          status: 'active',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: '4',
          storeId: '2',
          name: 'Carol Davis',
          role: 'Cashier',
          salesCount: 28,
          attendanceDays: 19,
          status: 'active',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: '5',
          storeId: '3',
          name: 'David Brown',
          role: 'Manager',
          salesCount: 42,
          attendanceDays: 23,
          status: 'active',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: '6',
          storeId: '3',
          name: 'Emma Wilson',
          role: 'Cashier',
          salesCount: 35,
          attendanceDays: 18,
          status: 'inactive',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15')
        }
      ];

      setStaff(mockStaff);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching staff:', error);
      setIsLoading(false);
    }
  };

  const filterStaff = () => {
    let filtered = staff;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(member => member.role === roleFilter);
    }

    // Store filter
    if (storeFilter !== 'all') {
      filtered = filtered.filter(member => member.storeId === storeFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(member => member.status === statusFilter);
    }

    setFilteredStaff(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = (member: StaffMember) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        // Simulate API call
        setStaff(prev => prev.filter(member => member.id !== id));
        alert('Staff member deleted successfully');
      } catch (error) {
        console.error('Error deleting staff member:', error);
        alert('Error deleting staff member');
      }
    }
  };

  const handleSave = async (memberData: Partial<StaffMember>) => {
    try {
      if (editingMember) {
        // Update existing member
        const updatedMember = { ...editingMember, ...memberData, updatedAt: new Date() };
        setStaff(prev => prev.map(member => member.id === editingMember.id ? updatedMember : prev));
        alert('Staff member updated successfully');
      } else {
        // Create new member
        const newMember: StaffMember = {
          id: Date.now().toString(),
          storeId: memberData.storeId || '1',
          name: memberData.name || '',
          role: memberData.role || '',
          salesCount: memberData.salesCount || 0,
          attendanceDays: memberData.attendanceDays || 0,
          status: memberData.status || 'active',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setStaff(prev => [...prev, newMember]);
        alert('Staff member created successfully');
      }
      setIsModalOpen(false);
      setEditingMember(null);
    } catch (error) {
      console.error('Error saving staff member:', error);
      alert('Error saving staff member');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading staff...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-lg text-gray-600 mt-2">Manage staff members across all stores</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2 px-6 py-3 text-lg"
        >
          <Plus className="w-5 h-5" />
          Add New Staff
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Staff</p>
              <p className="text-2xl font-bold text-gray-900">{staff.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3">
            <User className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Active Staff</p>
              <p className="text-2xl font-bold text-gray-900">{staff.filter(s => s.status === 'active').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Managers</p>
              <p className="text-2xl font-bold text-gray-900">{staff.filter(s => s.role === 'Manager').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Attendance</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(staff.reduce((sum, s) => sum + s.attendanceDays, 0) / staff.length)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 w-full"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">All Roles</option>
            <option value="Manager">Manager</option>
            <option value="Cashier">Cashier</option>
            <option value="Sales Associate">Sales Associate</option>
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

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Results Count */}
          <div className="flex items-center justify-center bg-gray-50 rounded-lg px-4 py-2">
            <span className="text-lg font-medium text-gray-700">
              {filteredStaff.length} staff
            </span>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Staff Member</th>
                <th className="table-header">Role</th>
                <th className="table-header">Store</th>
                <th className="table-header">Sales Count</th>
                <th className="table-header">Attendance</th>
                <th className="table-header">Status</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStaff.map((member) => {
                const store = stores.find(s => s.id === member.storeId);
                return (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-lg">{member.name}</div>
                          <div className="text-sm text-gray-500">ID: {member.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {member.role}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className="text-lg">{store?.name || 'Unknown Store'}</span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-lg font-medium text-gray-900">{member.salesCount}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="text-lg font-medium text-gray-900">{member.attendanceDays} days</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(member.status)}`}>
                        {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(member)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(member.id)}
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
                {editingMember ? 'Edit Staff Member' : 'Add New Staff Member'}
              </h2>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleSave({
                  storeId: formData.get('storeId') as string,
                  name: formData.get('name') as string,
                  role: formData.get('role') as string,
                  salesCount: parseInt(formData.get('salesCount') as string),
                  attendanceDays: parseInt(formData.get('attendanceDays') as string),
                  status: formData.get('status') as 'active' | 'inactive'
                });
              }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Store</label>
                    <select
                      name="storeId"
                      defaultValue={editingMember?.storeId || '1'}
                      className="input-field w-full"
                      required
                    >
                      {stores.map(store => (
                        <option key={store.id} value={store.id}>{store.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={editingMember?.name || ''}
                      className="input-field w-full"
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <select
                      name="role"
                      defaultValue={editingMember?.role || ''}
                      className="input-field w-full"
                      required
                    >
                      <option value="">Select role</option>
                      <option value="Manager">Manager</option>
                      <option value="Cashier">Cashier</option>
                      <option value="Sales Associate">Sales Associate</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sales Count</label>
                    <input
                      type="number"
                      name="salesCount"
                      defaultValue={editingMember?.salesCount || 0}
                      className="input-field w-full"
                      min="0"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Attendance Days</label>
                    <input
                      type="number"
                      name="attendanceDays"
                      defaultValue={editingMember?.attendanceDays || 0}
                      className="input-field w-full"
                      min="0"
                      max="31"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      name="status"
                      defaultValue={editingMember?.status || 'active'}
                      className="input-field w-full"
                      required
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingMember(null);
                    }}
                    className="btn-secondary px-6 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary px-6 py-2"
                  >
                    {editingMember ? 'Update Staff' : 'Add Staff'}
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

export default Staff;
