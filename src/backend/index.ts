import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3001;
const API_VERSION = process.env.API_VERSION || 'v1';

// Basic middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for development
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Multi-Store Cluster Admin Panel API is running',
    timestamp: new Date().toISOString(),
    version: API_VERSION
  });
});

// API root
app.get(`/api/${API_VERSION}`, (_req, res) => {
  res.json({ status: 'running', version: API_VERSION })
});

// ===== STORES API =====
app.get(`/api/${API_VERSION}/stores`, (_req, res) => {
  const mockStores = [
    {
      id: '1',
      name: 'Downtown Mall',
      location: '123 Main Street, Downtown',
      managerName: 'John Smith',
      contactNumber: '+1-555-0123',
      status: 'open',
      totalSales: 45000,
      ordersCount: 1250,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Westside Store',
      location: '456 West Avenue, Westside',
      managerName: 'Sarah Johnson',
      contactNumber: '+1-555-0456',
      status: 'open',
      totalSales: 38000,
      ordersCount: 980,
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: '3',
      name: 'Central Plaza',
      location: '789 Central Blvd, Midtown',
      managerName: 'Mike Davis',
      contactNumber: '+1-555-0789',
      status: 'maintenance',
      totalSales: 52000,
      ordersCount: 1450,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10')
    }
  ];

  res.json({
    success: true,
    data: mockStores,
    count: mockStores.length,
    message: 'Using mock data (database not connected)'
  });
});

app.get(`/api/${API_VERSION}/stores/:id`, (req, res) => {
  const storeId = req.params.id;
  const mockStores = [
    { id: '1', name: 'Downtown Mall', location: '123 Main Street, Downtown', managerName: 'John Smith', contactNumber: '+1-555-0123', status: 'open', totalSales: 45000, ordersCount: 1250 },
    { id: '2', name: 'Westside Store', location: '456 West Avenue, Westside', managerName: 'Sarah Johnson', contactNumber: '+1-555-0456', status: 'open', totalSales: 38000, ordersCount: 980 },
    { id: '3', name: 'Central Plaza', location: '789 Central Blvd, Midtown', managerName: 'Mike Davis', contactNumber: '+1-555-0789', status: 'maintenance', totalSales: 52000, ordersCount: 1450 }
  ];
  
  const store = mockStores.find(s => s.id === storeId);
  if (store) {
    res.json({ success: true, data: store });
  } else {
    res.status(404).json({ success: false, message: 'Store not found' });
  }
});

app.post(`/api/${API_VERSION}/stores`, (req, res) => {
  const newStore = { ...req.body, id: Date.now().toString(), createdAt: new Date(), updatedAt: new Date() };
  res.status(201).json({ success: true, data: newStore, message: 'Store created successfully' });
});

app.put(`/api/${API_VERSION}/stores/:id`, (req, res) => {
  const storeId = req.params.id;
  const updatedStore = { ...req.body, id: storeId, updatedAt: new Date() };
  res.json({ success: true, data: updatedStore, message: 'Store updated successfully' });
});

app.delete(`/api/${API_VERSION}/stores/:id`, (req, res) => {
  const storeId = req.params.id;
  res.json({ success: true, message: `Store ${storeId} deleted successfully` });
});

// ===== INVENTORY API =====
app.get(`/api/${API_VERSION}/inventory`, (_req, res) => {
  const mockInventory = [
    { id: '1', storeId: '1', productName: 'Laptop', sku: 'LAP001', quantity: 15, price: 999.99, status: 'available', lowStockThreshold: 10 },
    { id: '2', storeId: '1', productName: 'Mouse', sku: 'MOU001', quantity: 8, price: 29.99, status: 'lowStock', lowStockThreshold: 10 },
    { id: '3', storeId: '2', productName: 'Keyboard', sku: 'KEY001', quantity: 0, price: 79.99, status: 'outOfStock', lowStockThreshold: 10 },
    { id: '4', storeId: '2', productName: 'Monitor', sku: 'MON001', quantity: 12, price: 299.99, status: 'available', lowStockThreshold: 10 },
    { id: '5', storeId: '3', productName: 'Headphones', sku: 'HEA001', quantity: 25, price: 149.99, status: 'available', lowStockThreshold: 10 }
  ];

  res.json({
    success: true,
    data: mockInventory,
    count: mockInventory.length,
    message: 'Using mock data (database not connected)'
  });
});

app.get(`/api/${API_VERSION}/inventory/:storeId`, (req, res) => {
  const storeId = req.params.storeId;
  const mockInventory = [
    { id: '1', storeId: '1', productName: 'Laptop', sku: 'LAP001', quantity: 15, price: 999.99, status: 'available', lowStockThreshold: 10 },
    { id: '2', storeId: '1', productName: 'Mouse', sku: 'MOU001', quantity: 8, price: 29.99, status: 'lowStock', lowStockThreshold: 10 }
  ];
  
  const storeInventory = mockInventory.filter(item => item.storeId === storeId);
  res.json({ success: true, data: storeInventory, count: storeInventory.length });
});

app.post(`/api/${API_VERSION}/inventory`, (req, res) => {
  const newItem = { ...req.body, id: Date.now().toString(), createdAt: new Date(), updatedAt: new Date() };
  res.status(201).json({ success: true, data: newItem, message: 'Inventory item created successfully' });
});

app.put(`/api/${API_VERSION}/inventory/:id`, (req, res) => {
  const itemId = req.params.id;
  const updatedItem = { ...req.body, id: itemId, updatedAt: new Date() };
  res.json({ success: true, data: updatedItem, message: 'Inventory item updated successfully' });
});

app.delete(`/api/${API_VERSION}/inventory/:id`, (req, res) => {
  const itemId = req.params.id;
  res.json({ success: true, message: `Inventory item ${itemId} deleted successfully` });
});

// ===== SALES API =====
app.get(`/api/${API_VERSION}/sales`, (_req, res) => {
  const mockSales = [
    { id: '1', storeId: '1', date: '2024-01-15', totalSales: 1250.00, ordersCount: 8, paymentCash: 300.00, paymentCard: 800.00, paymentUpi: 150.00 },
    { id: '2', storeId: '2', date: '2024-01-15', totalSales: 890.00, ordersCount: 5, paymentCash: 200.00, paymentCard: 500.00, paymentUpi: 190.00 },
    { id: '3', storeId: '1', date: '2024-01-14', totalSales: 2100.00, ordersCount: 12, paymentCash: 500.00, paymentCard: 1200.00, paymentUpi: 400.00 }
  ];

  res.json({
    success: true,
    data: mockSales,
    count: mockSales.length,
    message: 'Using mock data (database not connected)'
  });
});

app.get(`/api/${API_VERSION}/sales/:storeId`, (req, res) => {
  const storeId = req.params.storeId;
  const mockSales = [
    { id: '1', storeId: '1', date: '2024-01-15', totalSales: 1250.00, ordersCount: 8, paymentCash: 300.00, paymentCard: 800.00, paymentUpi: 150.00 },
    { id: '3', storeId: '1', date: '2024-01-14', totalSales: 2100.00, ordersCount: 12, paymentCash: 500.00, paymentCard: 1200.00, paymentUpi: 400.00 }
  ];
  
  const storeSales = mockSales.filter(sale => sale.storeId === storeId);
  res.json({ success: true, data: storeSales, count: storeSales.length });
});

app.get(`/api/${API_VERSION}/sales/reports`, (req, res) => {
  const { startDate, endDate, storeId } = req.query;
  const mockSales = [
    { id: '1', storeId: '1', date: '2024-01-15', totalSales: 1250.00, ordersCount: 8, paymentCash: 300.00, paymentCard: 800.00, paymentUpi: 150.00 },
    { id: '2', storeId: '2', date: '2024-01-15', totalSales: 890.00, ordersCount: 5, paymentCash: 200.00, paymentCard: 500.00, paymentUpi: 190.00 }
  ];
  
  res.json({ 
    success: true, 
    data: mockSales, 
    filters: { startDate, endDate, storeId },
    message: 'Sales report generated successfully' 
  });
});

// ===== STAFF API =====
app.get(`/api/${API_VERSION}/staff`, (_req, res) => {
  const mockStaff = [
    { id: '1', storeId: '1', name: 'John Smith', role: 'Manager', salesCount: 45, attendanceDays: 22, status: 'active' },
    { id: '2', storeId: '1', name: 'Alice Johnson', role: 'Cashier', salesCount: 32, attendanceDays: 20, status: 'active' },
    { id: '3', storeId: '2', name: 'Bob Wilson', role: 'Manager', salesCount: 38, attendanceDays: 21, status: 'active' },
    { id: '4', storeId: '2', name: 'Carol Davis', role: 'Cashier', salesCount: 28, attendanceDays: 19, status: 'active' },
    { id: '5', storeId: '3', name: 'David Brown', role: 'Manager', salesCount: 42, attendanceDays: 23, status: 'active' }
  ];

  res.json({
    success: true,
    data: mockStaff,
    count: mockStaff.length,
    message: 'Using mock data (database not connected)'
  });
});

app.post(`/api/${API_VERSION}/staff`, (req, res) => {
  const newStaff = { ...req.body, id: Date.now().toString(), createdAt: new Date(), updatedAt: new Date() };
  res.status(201).json({ success: true, data: newStaff, message: 'Staff member created successfully' });
});

app.put(`/api/${API_VERSION}/staff/:id`, (req, res) => {
  const staffId = req.params.id;
  const updatedStaff = { ...req.body, id: staffId, updatedAt: new Date() };
  res.json({ success: true, data: updatedStaff, message: 'Staff member updated successfully' });
});

app.delete(`/api/${API_VERSION}/staff/:id`, (req, res) => {
  const staffId = req.params.id;
  res.json({ success: true, message: `Staff member ${staffId} deleted successfully` });
});

// ===== PROMOTIONS API =====
app.get(`/api/${API_VERSION}/promotions`, (_req, res) => {
  const mockPromotions = [
    { id: '1', storeId: '1', title: 'Summer Sale', discountPercent: 20, startDate: '2024-06-01', endDate: '2024-08-31', status: 'active' },
    { id: '2', storeId: '2', title: 'Holiday Special', discountPercent: 15, startDate: '2024-12-01', endDate: '2024-12-31', status: 'active' },
    { id: '3', storeId: '1', title: 'Clearance Event', discountPercent: 30, startDate: '2024-01-01', endDate: '2024-01-31', status: 'inactive' }
  ];

  res.json({
    success: true,
    data: mockPromotions,
    count: mockPromotions.length,
    message: 'Using mock data (database not connected)'
  });
});

app.post(`/api/${API_VERSION}/promotions`, (req, res) => {
  const newPromotion = { ...req.body, id: Date.now().toString(), createdAt: new Date(), updatedAt: new Date() };
  res.status(201).json({ success: true, data: newPromotion, message: 'Promotion created successfully' });
});

app.put(`/api/${API_VERSION}/promotions/:id`, (req, res) => {
  const promotionId = req.params.id;
  const updatedPromotion = { ...req.body, id: promotionId, updatedAt: new Date() };
  res.json({ success: true, data: updatedPromotion, message: 'Promotion updated successfully' });
});

app.delete(`/api/${API_VERSION}/promotions/:id`, (req, res) => {
  const promotionId = req.params.id;
  res.json({ success: true, message: `Promotion ${promotionId} deleted successfully` });
});

// ===== ALERTS API =====
app.get(`/api/${API_VERSION}/alerts`, (_req, res) => {
  const mockAlerts = [
    { id: '1', storeId: '1', message: 'Low stock alert: Mouse quantity below threshold', alertType: 'StockLow', status: 'unread', isUrgent: true, createdAt: new Date() },
    { id: '2', storeId: '2', message: 'POS system offline for 15 minutes', alertType: 'POSOffline', status: 'unread', isUrgent: true, createdAt: new Date() },
    { id: '3', storeId: '1', message: 'New promotion campaign started', alertType: 'Promotion', status: 'read', isUrgent: false, createdAt: new Date() }
  ];

  res.json({
    success: true,
    data: mockAlerts,
    count: mockAlerts.length,
    message: 'Using mock data (database not connected)'
  });
});

app.post(`/api/${API_VERSION}/alerts`, (req, res) => {
  const newAlert = { ...req.body, id: Date.now().toString(), createdAt: new Date() };
  res.status(201).json({ success: true, data: newAlert, message: 'Alert created successfully' });
});

// ===== DASHBOARD API =====
app.get(`/api/${API_VERSION}/dashboard`, (_req, res) => {
  const mockDashboardData = {
    kpis: {
      totalStores: 12,
      totalSales: 125000,
      topPerformingStore: 'Downtown Mall',
      lowStockAlerts: 8
    },
    salesTrend: [
      { date: 'Mon', sales: 12000 },
      { date: 'Tue', sales: 19000 },
      { date: 'Wed', sales: 15000 },
      { date: 'Thu', sales: 22000 },
      { date: 'Fri', sales: 28000 },
      { date: 'Sat', sales: 35000 },
      { date: 'Sun', sales: 18000 }
    ],
    storePerformance: [
      { store: 'Store A', sales: 25000 },
      { store: 'Store B', sales: 32000 },
      { store: 'Store C', sales: 18000 },
      { store: 'Store D', sales: 28000 },
      { store: 'Store E', sales: 22000 }
    ]
  };

  res.json({
    success: true,
    data: mockDashboardData,
    message: 'Using mock data (database not connected)'
  });
});

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API version: ${API_VERSION}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('✅ Backend started successfully with all CRUD APIs');
});

export default app;
