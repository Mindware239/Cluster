import React, { useState } from 'react';
import { 
  Store, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign,
  Calendar,
  Filter
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Dashboard = () => {
  const [selectedDateRange, setSelectedDateRange] = useState('7d');
  const [selectedStore, setSelectedStore] = useState('all');

  // Mock data - replace with real API calls
  const kpiData = {
    totalStores: 12,
    totalSales: 125000,
    topPerformingStore: 'Downtown Mall',
    lowStockAlerts: 8
  };

  const salesData = [
    { date: 'Mon', sales: 12000 },
    { date: 'Tue', sales: 19000 },
    { date: 'Wed', sales: 15000 },
    { date: 'Thu', sales: 22000 },
    { date: 'Fri', sales: 28000 },
    { date: 'Sat', sales: 35000 },
    { date: 'Sun', sales: 18000 },
  ];

  const storeComparisonData = [
    { store: 'Store A', sales: 25000 },
    { store: 'Store B', sales: 32000 },
    { store: 'Store C', sales: 18000 },
    { store: 'Store D', sales: 28000 },
    { store: 'Store E', sales: 22000 },
  ];

  return (
    <div className="p-8 dashboard-container overlay-prevention no-overlay stack-context">
      {/* Overlay Prevention Wrapper */}
      <div className="overlay-prevention content-visible no-overlay floating-fix">
        {/* Header with Filters */}
        <div className="mb-8 dashboard-section">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Dashboard Overview</h1>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <select 
                value={selectedDateRange} 
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="input-field w-auto"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="1y">Last Year</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-3">
              <Store className="w-5 h-5 text-gray-500" />
              <select 
                value={selectedStore} 
                onChange={(e) => setSelectedStore(e.target.value)}
                className="input-field w-auto"
              >
                <option value="all">All Stores</option>
                <option value="store1">Store 1</option>
                <option value="store2">Store 2</option>
                <option value="store3">Store 3</option>
              </select>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 dashboard-section">
          <div className="card dashboard-element">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Store className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Stores</p>
                <p className="text-3xl font-bold text-gray-900">{kpiData.totalStores}</p>
              </div>
            </div>
          </div>

          <div className="card dashboard-element">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-3xl font-bold text-gray-900">${kpiData.totalSales.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="card dashboard-element">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Top Store</p>
                <p className="text-xl font-bold text-gray-900">{kpiData.topPerformingStore}</p>
              </div>
            </div>
          </div>

          <div className="card dashboard-element">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-3xl font-bold text-gray-900">{kpiData.lowStockAlerts}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 dashboard-section">
          {/* Sales Trend Chart */}
          <div className="card chart-container dashboard-element">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Sales Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Store Comparison Chart */}
          <div className="card chart-container dashboard-element">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Store Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={storeComparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="store" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="card dashboard-section dashboard-element">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header">Store</th>
                  <th className="table-header">Activity</th>
                  <th className="table-header">Amount</th>
                  <th className="table-header">Time</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="table-cell">Downtown Mall</td>
                  <td className="table-cell">New Sale</td>
                  <td className="table-cell">$1,250</td>
                  <td className="table-cell">2 minutes ago</td>
                </tr>
                <tr>
                  <td className="table-cell">Westside Store</td>
                  <td className="table-cell">Low Stock Alert</td>
                  <td className="table-cell">-</td>
                  <td className="table-cell">5 minutes ago</td>
                </tr>
                <tr>
                  <td className="table-cell">Central Plaza</td>
                  <td className="table-cell">New Sale</td>
                  <td className="table-cell">$890</td>
                  <td className="table-cell">8 minutes ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
