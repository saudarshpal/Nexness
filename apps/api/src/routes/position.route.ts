import { Router } from "express";
import { closePosition, getClosedPositions, getOpenPositions, openPosition } from "../controllers/position.controller";
import { authMiddleware } from "../middlewares/authMiddleware";


const router = Router();

router.use(authMiddleware);
router.post('/open',openPosition);
router.post('/close',closePosition);
router.get('/open-positions',getOpenPositions);
router.get('/closed-positions',getClosedPositions);

export default router;