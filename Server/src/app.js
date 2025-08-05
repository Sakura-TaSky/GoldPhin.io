import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { swapRoute } from "./router/swap-router.js";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 8000;

const app = express();

app.use(
  cors({
    origin: "https://gold-phin-io.vercel.app",
    credentials: true,
  })
);
app.use(express.json());

app.use("/swap", swapRoute);

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
