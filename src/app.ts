
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { IndexRoutes } from "./types/index.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Secure Note API is running!",
  });
});
app.use("/api/v1",IndexRoutes)

export default app;
