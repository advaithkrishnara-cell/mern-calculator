import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler.js";
import calculatorRoutes from "./routes/calculatorRoutes.js";

const app = express();
const configuredOrigins = process.env.CLIENT_ORIGIN || (
  process.env.NODE_ENV === "production" ? "" : "http://localhost:5173"
);
const allowedOrigins = configuredOrigins
  ?.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins?.length ? allowedOrigins : false }));
app.use(express.json({ limit: "2kb" }));
app.get("/api/health", (_request, response) => {
  response.json({ status: "ok", database: mongoose.connection.readyState === 1 ? "connected" : "unavailable" });
});
app.use("/api/calculator", calculatorRoutes);
app.use((_request, response) => {
  response.status(404).json({ error: "Route not found" });
});
app.use(errorHandler);

export default app;
