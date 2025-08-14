import { Router } from 'express';

const router = Router();

// TODO: Implement module management endpoints
router.get('/', (req, res) => {
  res.status(501).json({ message: 'Get modules - implement here' });
});

export default router;
