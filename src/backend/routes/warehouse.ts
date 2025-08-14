import { Router } from 'express';

const router = Router();

// TODO: Implement warehouse endpoints
router.get('/', (req, res) => {
  res.status(501).json({ message: 'Warehouse - implement here' });
});

export default router;
