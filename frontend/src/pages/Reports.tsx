import React, { useState, useEffect } from 'react';
import { Download, Filter, Calendar, TrendingUp, DollarSign, ShoppingCart, Store, BarChart3, PieChart, LineChart } from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

interface ReportData {
  id: string;
  type: string;
  title: string;
  generatedAt: Date;
  data: any;
}

const Reports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<string>('sales');
  const [dateRange, setDateRange] = useState<string>('7d');
  const [storeFilter, setStoreFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Mock stores for filter
  const stores = [
    { id: '1', name: 'Downtown Mall' },
    { id: '2', name: 'Westside Store' },
    { id: '3', name: 'Central Plaza' }
  ];

  // Mock sales data for charts
  const salesData = [
    { month: 'Jan', sales: 45000, orders: 1250 },
    { month: 'Feb', sales: 52000, orders: 1450 },
    { month: 'Mar', sales: 48000, orders: 1320 },
    { month: 'Apr', sales: 61000, orders: 1680 },
    { month: 'May', sales: 55000, orders: 1520 },
    { month: 'Jun', sales: 67000, orders: 1850 }
  ];

  const storePerformanceData = [
    { store: 'Downtown Mall', sales: 125000, orders: 3200, growth: 15 },
    { store: 'Westside Store', sales: 98000, orders: 2450, growth: 8 },
    { store: 'Central Plaza', sales: 112000, orders: 2800, growth: 22 }
  ];

  const categoryData = [
    { name: 'Electronics', value: 45, color: '#3B82F6' },
    { name: 'Clothing', value: 25, color: '#10B981' },
    { name: 'Home & Garden', value: 20, color: '#F59E0B' },
    { name: 'Sports', value: 10, color: '#EF4444' }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  const generateReport = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const exportReport = (format: 'pdf' | 'excel') => {
    alert(`${format.toUpperCase()} report exported successfully!`);
  };

  useEffect(() => {
    generateReport();
  }, [selectedReport, dateRange, storeFilter]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-lg text-gray-600 mt-2">Generate comprehensive reports and analyze business performance</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => exportReport('excel')}
            className="btn-secondary px-4 py-2 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Excel
          </button>
          <button
            onClick={() => exportReport('pdf')}
            className="btn-primary px-4 py-2 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Report Controls */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="input-field w-full"
            >
              <option value="sales">Sales Report</option>
              <option value="inventory">Inventory Report</option>
              <option value="staff">Staff Performance</option>
              <option value="financial">Financial Summary</option>
              <option value="customers">Customer Analytics</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="input-field w-full"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Store</label>
            <select
              value={storeFilter}
              onChange={(e) => setStoreFilter(e.target.value)}
              className="input-field w-full"
            >
              <option value="all">All Stores</option>
              {stores.map(store => (
                <option key={store.id} value={store.id}>{store.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={generateReport}
              disabled={isLoading}
              className="btn-primary w-full py-2 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Filter className="w-4 h-4" />
              )}
              {isLoading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">$335,000</p>
                <p className="text-sm text-green-600">+12.5% vs last period</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">8,250</p>
                <p className="text-sm text-blue-600">+8.2% vs last period</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3">
              <Store className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active Stores</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
                <p className="text-sm text-purple-600">All operational</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900">$40.61</p>
                <p className="text-sm text-orange-600">+4.1% vs last period</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Trend Chart */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Sales Trend</h3>
              <div className="flex gap-2">
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <LineChart className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <BarChart3 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsLineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
                <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={2} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>

          {/* Store Performance Chart */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Store Performance</h3>
              <div className="flex gap-2">
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <BarChart3 className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <PieChart className="w-4 h-4" />
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Data Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Store Performance Details</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header">Store</th>
                  <th className="table-header">Total Sales</th>
                  <th className="table-header">Orders</th>
                  <th className="table-header">Growth</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {storePerformanceData.map((store) => (
                  <tr key={store.store} className="hover:bg-gray-50">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Store className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-lg font-medium text-gray-900">{store.store}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="text-lg font-medium text-gray-900">${store.sales.toLocaleString()}</span>
                    </td>
                    <td className="table-cell">
                      <span className="text-lg">{store.orders.toLocaleString()}</span>
                    </td>
                    <td className="table-cell">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        store.growth > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {store.growth > 0 ? '+' : ''}{store.growth}%
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => exportReport('excel')}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Export Store Report"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => alert(`Detailed report for ${store.store}`)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <BarChart3 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Report Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Sales Reports</h4>
                <p className="text-sm text-gray-600">Revenue, orders, trends</p>
              </div>
            </div>
            <button className="btn-primary w-full">Generate Report</button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Inventory Reports</h4>
                <p className="text-sm text-gray-600">Stock levels, movements</p>
              </div>
            </div>
            <button className="btn-primary w-full">Generate Report</button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Store className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Store Reports</h4>
                <p className="text-sm text-gray-600">Performance, comparison</p>
              </div>
            </div>
            <button className="btn-primary w-full">Generate Report</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
