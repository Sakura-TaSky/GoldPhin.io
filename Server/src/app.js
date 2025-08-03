import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { swapRoute } from "./router/swap-router.js";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 8000;

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3001",
  "https://gold-phin-io.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true,
  })
);

// Optional: Handle preflight requests
app.options("*", cors());

app.use(express.json());

app.use("/swap", swapRoute);

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
