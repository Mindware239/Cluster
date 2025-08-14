import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/database';

const router = Router();

// Helper function to check if database is available
const isDatabaseAvailable = () => {
  return AppDataSource.isInitialized;
};

// Get dashboard data
router.get('/', async (_req: Request, res: Response) => {
  try {
    if (!isDatabaseAvailable()) {
      // Return mock dashboard data if database is not available
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
        ],
        recentActivity: [
          { store: 'Downtown Mall', activity: 'New Sale', amount: 1250, time: '2 minutes ago' },
          { store: 'Westside Store', activity: 'Low Stock Alert', amount: null, time: '5 minutes ago' },
          { store: 'Central Plaza', activity: 'New Sale', amount: 890, time: '8 minutes ago' }
        ]
      };

      return res.json({
        success: true,
        data: mockDashboardData,
        message: 'Using mock data (database not connected)'
      });
    }

    // TODO: Implement real database queries for dashboard data
    return res.json({
      success: true,
      message: 'Dashboard data - implement database queries here',
      data: {}
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
