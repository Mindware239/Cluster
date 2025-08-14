import { Router } from 'express';

const router = Router();

// TODO: Implement tenant management endpoints
router.get('/', (req, res) => {
  res.status(501).json({ message: 'Get tenants - implement here' });
});

router.post('/', (req, res) => {
  res.status(501).json({ message: 'Create tenant - implement here' });
});

export default router;
