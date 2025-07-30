import axios from 'axios';
import { backendUrl } from '@/const/const';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { setMakingSwap, setTokenList } from '@/toolkit/slice/swapSlice';
import { setSwapLoading } from '@/toolkit/slice/swapSlice';
import {
  setWalletUser,
  setWalletUserFetched,
  setWalletUserLoading,
} from '@/toolkit/slice/walletSlice';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function useServerApi() {
  const location = useLocation();
  const { walletChain, walletAddress, walletUserFetched } = useSelector(
    (state) => state.wallet
  );
  const { swapPayToken, swapReceiveToken } = useSelector((state) => state.swap);
  const dispatch = useDispatch();

  const getTokenList = async () => {
    dispatch(setSwapLoading(true));
    try {
      const response = await axios.get(
        `${backendUrl}/swap/token-list/${walletChain.chainId}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      dispatch(setTokenList(response.data.data));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      dispatch(setSwapLoading(false));
    }
  };

  // swapPayToken: {
  //   address: '';
  //   logo: '';
  //   symbol: '';
  //   usdPrice: '';
  //   value:0.0
  // }

  const getSwapAllowance = async () => {
    if (!walletAddress || !swapPayToken?.address) {
      toast.error('Some Information is not full field');
      return;
    }
    const swapAllowanceData = {
      walletAddress: walletAddress,
      payTokenAddress: swapPayToken?.address,
      payAmount: swapPayToken?.value,
    };
    try {
      dispatch(setMakingSwap(true));
      const response = await axios.post(
        `${backendUrl}/swap/check-approval/${walletChain.chainId}`,
        swapAllowanceData
      );

      if (response.data) {
        const needsApproval = response?.data?.data?.canNeedAllowance;
        const allowanceTx = response?.data?.data?.approveTx;

        if (needsApproval) {
          if (allowanceTx) {
            const tx = {
              from: walletAddress,
              to: allowanceTx.to,
              data: allowanceTx.data,
              value: allowanceTx.value,
              gasPrice: allowanceTx.gasPrice,
            };
            try {
              const txHash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [tx],
              });

              toast.success('Approval transaction sent');
            } catch (error) {
              toast.error(error?.message || 'Approval failed');
            }
          }
        } else {
          await getSwap();
        }
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          'something went wrong'
      );
    } finally {
      dispatch(setMakingSwap(false));
    }
  };

  const getSwap = async () => {
    if (
      !walletAddress ||
      !swapPayToken?.address ||
      !swapReceiveToken?.address ||
      !swapPayToken?.value
    ) {
      toast.error('Some Information is not full field');
      return;
    }

    const swapData = {
      walletAddress: walletAddress,
      payTokenAddress: swapPayToken?.address,
      receiveTokenAddress: swapReceiveToken?.address,
      payAmount: swapPayToken?.value,
      slippage: 1,
    };

    try {
      dispatch(setMakingSwap(true));
      const response = await axios.post(
        `${backendUrl}/swap/doSwap/${walletChain.chainId}`,
        swapData
      );
      if (response.data) {
        const txPayload = response.data.data.tx;
        if (txPayload) {
          const tx = {
            from: txPayload.from.toLowerCase(),
            to: txPayload.to.toLowerCase(),
            data: txPayload.data,
            value: `0x${BigInt(txPayload.value).toString(16)}`,
            gasPrice: `0x${BigInt(txPayload.gasPrice).toString(16)}`,
            gas: `0x${BigInt(txPayload.gas).toString(16)}`,
          };
          try {
            const txHash = await window.ethereum.request({
              method: 'eth_sendTransaction',
              params: [tx],
            });

            toast.success(`Swap tx sent: ${txHash}`);
          } catch (error) {
            toast.error(error?.message || 'Swap failed');
          }
        } else {
          toast.error(error?.message || 'Swap faild');
        }
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          'something went wrong'
      );
    } finally {
      dispatch(setMakingSwap(false));
    }
  };

  return {
    getTokenList,
    getSwapAllowance,
  };
}
