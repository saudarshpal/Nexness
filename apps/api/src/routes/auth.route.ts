import { Router } from 'express';
import { Signin, Signup, Logout, Me} from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/signup',Signup);
router.post('/signin',Signin);
router.post('/logout',Logout);
router.get('/me',authMiddleware,Me);

export default router
