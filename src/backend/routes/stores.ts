import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Store } from '../models/Store';

const router = Router();

// Helper function to check if database is available
const isDatabaseAvailable = () => {
  return AppDataSource.isInitialized;
};

// Get all stores
router.get('/', async (_req: Request, res: Response) => {
  try {
    if (!isDatabaseAvailable()) {
      // Return mock data if database is not available
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

      return res.json({
        success: true,
        data: mockStores,
        count: mockStores.length,
        message: 'Using mock data (database not connected)'
      });
    }

    const storeRepository = AppDataSource.getRepository(Store);
    const stores = await storeRepository.find({
      order: { createdAt: 'DESC' }
    });

    return res.json({
      success: true,
      data: stores,
      count: stores.length
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch stores',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get store by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    if (!isDatabaseAvailable()) {
      return res.status(503).json({
        success: false,
        message: 'Database not available'
      });
    }

    const { id } = req.params;
    const storeRepository = AppDataSource.getRepository(Store);
    
    const store = await storeRepository.findOne({
      where: { id }
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    return res.json({
      success: true,
      data: store
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch store',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Create new store
router.post('/', async (req: Request, res: Response) => {
  try {
    if (!isDatabaseAvailable()) {
      return res.status(503).json({
        success: false,
        message: 'Database not available - cannot create store'
      });
    }

    const { name, location, managerName, contactNumber, status } = req.body;
    
    if (!name || !location) {
      return res.status(400).json({
        success: false,
        message: 'Name and location are required'
      });
    }

    const storeRepository = AppDataSource.getRepository(Store);
    
    const store = storeRepository.create({
      name,
      location,
      managerName,
      contactNumber,
      status: status || 'open'
    });

    const savedStore = await storeRepository.save(store);

    return res.status(201).json({
      success: true,
      message: 'Store created successfully',
      data: savedStore
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create store',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update store
router.put('/:id', async (req: Request, res: Response) => {
  try {
    if (!isDatabaseAvailable()) {
      return res.status(503).json({
        success: false,
        message: 'Database not available - cannot update store'
      });
    }

    const { id } = req.params;
    const updateData = req.body;
    
    const storeRepository = AppDataSource.getRepository(Store);
    
    const store = await storeRepository.findOne({
      where: { id }
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    Object.assign(store, updateData);
    store.updatedAt = new Date();
    
    const updatedStore = await storeRepository.save(store);

    return res.json({
      success: true,
      message: 'Store updated successfully',
      data: updatedStore
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update store',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Delete store
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    if (!isDatabaseAvailable()) {
      return res.status(503).json({
        success: false,
        message: 'Database not available - cannot delete store'
      });
    }

    const { id } = req.params;
    const storeRepository = AppDataSource.getRepository(Store);
    
    const store = await storeRepository.findOne({
      where: { id }
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    await storeRepository.remove(store);

    return res.json({
      success: true,
      message: 'Store deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete store',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
