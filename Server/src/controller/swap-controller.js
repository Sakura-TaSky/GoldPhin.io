import { ethers } from "ethers";
import axios from "axios";
import { validateFields } from "../utils/validateFields.js";

const getSwapTokenList = async (req, res) => {
  const { chainId } = req.params;
  if (!chainId || chainId == undefined) {
    return res.status(400).json({
      success: false,
      message: "BlockChain id not Found",
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
    return res.status(200).json({
      success: true,
      message: "Token list fetched successfully",
      data: tokensArray,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error please try later",
      devMessage: error.message,
    });
  }
};

// token swap

// oneInchBaseUrl = 'https://api.1inch.dev/swap/v6.1'

// checkApprovel
// GET `${oneInchBaseUrl}/${chainId}/approve/allowance?tokenAddress=${payTokenAddresh}&walletAddress=${walletAddresh}`

// swap
// GET `${oneInchBaseUrl}/${chainId}/swap?fromTokenAddress=${payTokenAddresh}&toTokenAddress=${receiveTokenAddress}&amount=${payAmountInWei}&fromAddress=0x${walletAddreshg}&slippage=${slippage}`

const postSwapApprove = async (req, res) => {
  const { chainId } = req.params;
  const { walletAddress, payTokenAddress, payAmount } = req.body;
  const is = validateFields(res, {
    chainId,
    walletAddress,
    payTokenAddress,
    payAmount,
  });
  if (!is) return;
  try {
    const decimals = 18;
    const amountInWei = ethers
      .parseUnits(payAmount, Number(decimals))
      .toString();
    try {
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
      const msg = error.response?.data?.description || error.message;
      return res.status(500).json({
        success: false,
        message: "Token swap error, please try later",
        devMessage: msg,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error, please try later",
    });
  }
};

const postSwapDoSwap = async (req, res) => {
  const { chainId } = req.params;
  const {
    walletAddress,
    payTokenAddress,
    receiveTokenAddress,
    payAmount,
    slippage,
  } = req.body;
  const is = validateFields(res, {
    walletAddress,
    payAmount,
    payTokenAddress,
    receiveTokenAddress,
  });
  if (!is) return;
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
          message: "Token swap error, please try later",
          devMessage: error.message,
        });
      }
    } catch (error) {
      const msg = error.response?.data?.description || error.message;
      return res.status(500).json({
        success: false,
        message: "Token swap error, please try later",
        devMessage: msg,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error, please try later",
    });
  }
};

export { getSwapTokenList, postSwapApprove, postSwapDoSwap };
