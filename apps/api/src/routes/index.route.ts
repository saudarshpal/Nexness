import { Router } from 'express';
import authRouter from './auth.route';
import positionRouter from './position.route';
import balanceRouter from './blanace.route';


const router = Router();

router.use('/auth',authRouter);
router.use('/position',positionRouter);
router.use('/balance',balanceRouter);


export default router; 