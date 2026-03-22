import { Router } from "express";
import { closePosition, openPosition } from "../controllers/position.controller";
import { authMiddleware } from "../middlewares/authMiddleware";


const router = Router();

router.use(authMiddleware);
router.post('/open',openPosition);
router.post('/close',closePosition);

export default router;