import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, ShoppingCart, Calendar, Store } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface Sale {
  id: string;
  storeId: string;
  date: string;
  totalSales: number;
  ordersCount: number;
  paymentCash: number;
  paymentCard: number;
  paymentUpi: number;
}

const Sales: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock stores
  const stores = [
    { id: '1', name: 'Downtown Mall' },
    { id: '2', name: 'Westside Store' },
    { id: '3', name: 'Central Plaza' }
  ];

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      // Simulate API call
      const mockSales: Sale[] = [
        {
          id: '1',
          storeId: '1',
          date: '2024-01-15',
          totalSales: 1250.00,
          ordersCount: 8,
          paymentCash: 300.00,
          paymentCard: 800.00,
          paymentUpi: 150.00
        },
        {
          id: '2',
          storeId: '2',
          date: '2024-01-15',
          totalSales: 890.00,
          ordersCount: 5,
          paymentCash: 200.00,
          paymentCard: 500.00,
          paymentUpi: 190.00
        },
        {
          id: '3',
          storeId: '1',
          date: '2024-01-14',
          totalSales: 2100.00,
          ordersCount: 12,
          paymentCash: 500.00,
          paymentCard: 1200.00,
          paymentUpi: 400.00
        }
      ];

      setSales(mockSales);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching sales:', error);
      setIsLoading(false);
    }
  };

  const totalSales = sales.reduce((sum, sale) => sum + sale.totalSales, 0);
  const totalOrders = sales.reduce((sum, sale) => sum + sale.ordersCount, 0);
  const totalCash = sales.reduce((sum, sale) => sum + sale.paymentCash, 0);
  const totalCard = sales.reduce((sum, sale) => sum + sale.paymentCard, 0);
  const totalUpi = sales.reduce((sum, sale) => sum + sale.paymentUpi, 0);

  const salesTrendData = [
    { date: 'Mon', sales: 12000 },
    { date: 'Tue', sales: 19000 },
    { date: 'Wed', sales: 15000 },
    { date: 'Thu', sales: 22000 },
    { date: 'Fri', sales: 28000 },
    { date: 'Sat', sales: 35000 },
    { date: 'Sun', sales: 18000 }
  ];

  const storePerformanceData = stores.map(store => {
    const storeSales = sales.filter(sale => sale.storeId === store.id);
    const totalStoreSales = storeSales.reduce((sum, sale) => sum + sale.totalSales, 0);
    return {
      store: store.name,
      sales: totalStoreSales
    };
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading sales data...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales & Finance</h1>
          <p className="text-lg text-gray-600 mt-2">Monitor sales performance and financial metrics</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary px-4 py-2">
            <Calendar className="w-4 h-4 mr-2" />
            Date Range
          </button>
          <button className="btn-primary px-4 py-2">
            <TrendingUp className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900">${totalSales.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3">
            <Store className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Active Stores</p>
              <p className="text-2xl font-bold text-gray-900">{stores.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : '0.00'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend (This Week)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
              <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Store Performance Chart */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={storePerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="store" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
              <Bar dataKey="sales" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payment Methods Breakdown */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Cash</p>
            <p className="text-2xl font-bold text-gray-900">${totalCash.toFixed(2)}</p>
            <p className="text-sm text-gray-500">
              {totalSales > 0 ? ((totalCash / totalSales) * 100).toFixed(1) : '0'}%
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <ShoppingCart className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Card</p>
            <p className="text-2xl font-bold text-gray-900">${totalCard.toFixed(2)}</p>
            <p className="text-sm text-gray-500">
              {totalSales > 0 ? ((totalCard / totalSales) * 100).toFixed(1) : '0'}%
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">UPI</p>
            <p className="text-2xl font-bold text-gray-900">${totalUpi.toFixed(2)}</p>
            <p className="text-sm text-gray-500">
              {totalSales > 0 ? ((totalUpi / totalSales) * 100).toFixed(1) : '0'}%
            </p>
          </div>
        </div>
      </div>

      {/* Recent Sales Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Sales</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Date</th>
                <th className="table-header">Store</th>
                <th className="table-header">Total Sales</th>
                <th className="table-header">Orders</th>
                <th className="table-header">Payment Methods</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sales.map((sale) => {
                const store = stores.find(s => s.id === sale.storeId);
                return (
                  <tr key={sale.id} className="hover:bg-gray-50">
                    <td className="table-cell">
                      <div className="text-lg">{new Date(sale.date).toLocaleDateString()}</div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <Store className="w-4 h-4 text-blue-600" />
                        <span className="text-lg">{store?.name || 'Unknown Store'}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="text-lg font-medium text-gray-900">${sale.totalSales.toFixed(2)}</span>
                    </td>
                    <td className="table-cell">
                      <span className="text-lg">{sale.ordersCount}</span>
                    </td>
                    <td className="table-cell">
                      <div className="flex gap-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Cash: ${sale.paymentCash.toFixed(2)}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Card: ${sale.paymentCard.toFixed(2)}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          UPI: ${sale.paymentUpi.toFixed(2)}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Sales;
