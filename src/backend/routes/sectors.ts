import { Router } from 'express';

const router = Router();

// TODO: Implement sector management endpoints
router.get('/', (req, res) => {
  res.status(501).json({ message: 'Get sectors - implement here' });
});

export default router;
