import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";
import { createClient } from "redis";
import { ethers } from "ethers";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3001",
    ],
    credentials: true,
  })
);

let redisClient;
redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true,
    rejectUnauthorized: false,
  },
});

redisClient.on("error", (err) => {
  console.error("🚨 Redis Client Error:", err.message);
});

(async () => {
  try {
    await redisClient.connect();
    console.log("✅ Redis connected");
  } catch (err) {
    console.log("🚨 Redis connection failed:", err.message);
  }
})();

app.use(express.json());

// swap token list for user to select token for the swap from 1Inch api

app.get("/swap/token-list/:chainId", async (req, res) => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
  const { chainId } = req.params;
  if (!chainId || chainId == undefined) {
    return res.status(400).json({
      success: false,
      message: "BlockChain id not Found",
    });
  }
  const cachedData = await redisClient.get(`swapTokenList:${chainId}`);
  if (cachedData) {
    return res.status(200).json({
      success: true,
      message: "Token list fetched successfully from cache",
      status: 200,
      data: JSON.parse(cachedData),
    });
  }
  try {
    const response = await axios.get(
      `https://api.1inch.dev/token/v1.2/${chainId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.oneINCH_API_KEY}`,
        },
        params: {
          provider: "1inch",
          country: "US",
        },
      }
    );
    const tokensObj = response.data;
    const tokensArray = Object.values(tokensObj);

    redisClient.set(`swapTokenList:${chainId}`, JSON.stringify(tokensArray), {
      EX: 60 * 60 * 5,
    });

    return res.status(200).json({
      success: true,
      message: "Token list fetched successfully",
      data: tokensArray,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error please try later",
    });
  }
});

// token swap

// oneInchBaseUrl = 'https://api.1inch.dev/swap/v6.1'

// checkApprovel
// GET `${oneInchBaseUrl}/${chainId}/approve/allowance?tokenAddress=${payTokenAddresh}&walletAddress=${walletAddresh}`

// swap
// GET `${oneInchBaseUrl}/${chainId}/swap?fromTokenAddress=${payTokenAddresh}&toTokenAddress=${receiveTokenAddress}&amount=${payAmountInWei}&fromAddress=0x${walletAddreshg}&slippage=${slippage}`

app.post("/swap/check-approval/:chainId", async (req, res) => {
  const { chainId } = req.params;
  const { walletAddress, payTokenAddress, payAmount } = req.body;
  if (!chainId || chainId == undefined) {
    return res.status(400).json({
      success: false,
      message: "BlockChain id not Found",
    });
  }
  if (!walletAddress || walletAddress == undefined) {
    return res.status(401).json({
      success: false,
      message: "Wallet Address is requird",
    });
  }
  if (!payTokenAddress || payTokenAddress == undefined) {
    return res.status(400).json({
      success: false,
      message: "pay token Address is requird",
    });
  }
  try {
    const decimals = 18;
    const amountInWei = ethers
      .parseUnits(payAmount, Number(decimals))
      .toString();
    const oneInchBaseUrl = "https://api.1inch.dev/swap/v6.1";
    const response = await axios.get(
      `${oneInchBaseUrl}/${chainId}/approve/allowance`,
      {
        headers: {
          Authorization: `Bearer ${process.env.oneINCH_API_KEY}`,
        },
        params: {
          tokenAddress: payTokenAddress,
          walletAddress: walletAddress,
        },
        paramsSerializer: {
          indexes: null,
        },
      }
    );

    const allowance = response.data.allowance;

    if (BigInt(allowance) >= BigInt(amountInWei)) {
      return res.status(200).json({
        success: true,
        data: {
          allowance: allowance,
          canNeedAllowance: false,
        },
        message: "no need for allowance !",
      });
    } else {
      const approveResponse = await axios.get(
        `${oneInchBaseUrl}/${chainId}/approve/transaction`,
        {
          headers: {
            Authorization: `Bearer ${process.env.oneINCH_API_KEY}`,
          },
          params: {
            tokenAddress: payTokenAddress,
            amount: amountInWei,
          },
        }
      );

      return res.status(200).json({
        success: true,
        data: {
          allowance,
          canNeedAllowance: true,
          approveTx: approveResponse.data,
        },
        message: "Need for allowance!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error, please try later",
    });
  }
});

app.post("/swap/doSwap/:chainId", async (req, res) => {
  const { chainId } = req.params;
  const {
    walletAddress,
    payTokenAddress,
    receiveTokenAddress,
    payAmount,
    slippage,
  } = req.body;
  if (!chainId || chainId == undefined) {
    return res.status(400).json({
      success: false,
      message: "BlockChain id not Found",
    });
  }
  if (!walletAddress || walletAddress == undefined) {
    return res.status(401).json({
      success: false,
      message: "Wallet Address is requird",
    });
  }
  if (!payTokenAddress || payTokenAddress == undefined) {
    return res.status(400).json({
      success: false,
      message: "pay token Address is requird",
    });
  }
  if (!receiveTokenAddress || receiveTokenAddress == undefined) {
    return res.status(400).json({
      success: false,
      message: "receive token Address is requird",
    });
  }
  if (!payAmount || payAmount == "0") {
    return res.status(400).json({
      success: false,
      message: "amount to pay is requird",
    });
  }

  try {
    const decimals = 18;
    const amountInWei = ethers
      .parseUnits(payAmount, Number(decimals))
      .toString();
    const oneInchBaseUrl = "https://api.1inch.dev/swap/v6.1";

    try {
      const swap = await axios.get(`${oneInchBaseUrl}/${chainId}/swap`, {
        headers: {
          Authorization: `Bearer ${process.env.oneINCH_API_KEY}`,
        },
        params: {
          src: payTokenAddress,
          dst: receiveTokenAddress,
          amount: amountInWei,
          from: walletAddress,
          origin: walletAddress,
          slippage: slippage || 1,
        },
        paramsSerializer: {
          indexes: null,
        },
      });

      const swapData = swap.data;

      if (swapData) {
        return res.status(200).json({
          success: true,
          data: swapData,
          message: "swap Data sent successfully",
        });
      } else {
        return res.status(500).json({
          success: false,
          message: error.message || "Token swap error, please try later",
        });
      }
    } catch (error) {
      const msg = error.response?.data?.description || error.message || "Error";
      return res.status(500).json({
        success: false,
        message: msg,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error, please try later",
    });
  }
});

app.listen(process.env.PORT || 8000, () => {
  console.log(`Server is running on port ${process.env.PORT || 8000}`);
});
