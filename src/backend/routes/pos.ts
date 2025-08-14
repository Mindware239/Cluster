import { Router } from 'express';

const router = Router();

// TODO: Implement POS endpoints
router.get('/', (req, res) => {
  res.status(501).json({ message: 'POS - implement here' });
});

export default router;
