import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { depositBalance, getBalance } from '../controllers/balance.controller';

const router = Router();

router.use(authMiddleware);
router.get('/',getBalance);
router.post('/deposit',depositBalance);

export default router;