import { Router } from 'express';
import authRouter from './auth.route';
import positionRouter from './position.route';


const router = Router();

router.use('/auth',authRouter);
router.use('/position',positionRouter);


export default router; 