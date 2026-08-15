import express from 'express';
import cors from "cors";
import router from './routes/index.js';
import { errorHandler } from './middlewares/error-handler.js';
import { generalLimiter } from './middlewares/rate-limit.middleware.js';

const app: express.Application = express();

app.use(cors({
  origin: "http://localhost:3003",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(generalLimiter);
app.use('/api', router);
app.use(errorHandler);

export default app;