import 'dotenv/config'; 
import express, { Request, Response } from "express";
import cors from "cors";
import router from "./routes";
import { apikeyMiddleware } from "./middleware/authMiddleware";
import path from "path";
import errorHandler from "./middleware/errorHandler";
import morgan from "morgan";
import helmet from "helmet";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors());
app.use(helmet());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get("/", (req: Request, res: Response) => {
    res.send("API is running");
});
app.use("/api/v1", apikeyMiddleware, router);
app.use("*", (req: Request, res: Response) => {
    res.status(404).json({ success: false, message: "Route not found" });
});
app.use(errorHandler);
export default app;
