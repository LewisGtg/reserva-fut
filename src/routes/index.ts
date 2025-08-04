import { Router } from 'express';
import { Request, Response } from 'express';

const router = Router();

// API routes

// API info endpoint
router.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Reserva Fut API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      health: '/health',
    },
  });
});

export default router;
