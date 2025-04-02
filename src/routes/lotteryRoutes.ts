import express from "express";
import { purchaseTicket } from "../controllers/lotteryController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/purchase", authMiddleware, purchaseTicket);

export default router;
