import { Router } from 'express';

const router = Router();

// TODO: Implement role management endpoints
router.get('/', (req, res) => {
  res.status(501).json({ message: 'Get roles - implement here' });
});

router.post('/', (req, res) => {
  res.status(501).json({ message: 'Create role - implement here' });
});

export default router;
