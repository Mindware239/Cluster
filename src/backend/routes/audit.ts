import { Router } from 'express';

const router = Router();

// TODO: Implement audit log endpoints
router.get('/', (req, res) => {
  res.status(501).json({ message: 'Get audit logs - implement here' });
});

export default router;
