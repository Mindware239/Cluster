import { Router } from 'express';

const router = Router();

// TODO: Implement authentication endpoints
router.post('/login', (req, res) => {
  res.status(501).json({ message: 'Login - implement here' });
});

router.post('/logout', (req, res) => {
  res.status(501).json({ message: 'Logout - implement here' });
});

export default router;
