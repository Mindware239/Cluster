import { Router } from 'express';

const router = Router();

// TODO: Implement user management endpoints
router.get('/', (req, res) => {
  res.status(501).json({ message: 'Get users - implement here' });
});

router.post('/', (req, res) => {
  res.status(501).json({ message: 'Create user - implement here' });
});

export default router;
