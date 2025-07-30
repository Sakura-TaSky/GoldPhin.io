import { Router } from "express";
import {
  getSwapTokenList,
  postSwapApprove,
  postSwapDoSwap,
} from "../controller/swap-controller.js";

const swapRoute = Router();

swapRoute.get("/token-list/:chainId", getSwapTokenList);

swapRoute.post("/check-approval/:chainId", postSwapApprove);

swapRoute.post("/doSwap/:chainId", postSwapDoSwap);

export { swapRoute };
