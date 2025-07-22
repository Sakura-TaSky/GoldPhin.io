import React, { useEffect, useState } from 'react';
import Headers from '../components/Headers';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import SwapHolder from '../components/SwapHolder';
import { Button } from '@/components/ui/button';
import { AiOutlineSwap } from 'react-icons/ai';
import {
  setSwapPayToken,
  setSwapReceiveToken,
} from '@/toolkit/slice/swapSlice';
import { FiRotateCw } from 'react-icons/fi';
import { useServerApi, useSwapApi } from '@/hooks';
import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';

const Swaps = () => {
  const { walletChain, walletAddress } = useSelector((state) => state.wallet);
  const { swapPayToken, swapReceiveToken, swapLoading, makingSwap } =
    useSelector((state) => state.swap);
  const { getSelectedSwapTokenPrice } = useSwapApi();
  const { getSwapAllowance } = useServerApi();
  const [payAmount, setPayAmount] = useState(0);
  const [receiveAmount, setReceiveAmount] = useState(0);
  const [payUsdPrice, setPayUsdPrice] = useState(0);
  const [receiveUsdPrice, setReceiveUsdPrice] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    if (
      payAmount > 0 &&
      swapPayToken?.usdPrice > 0 &&
      swapReceiveToken?.usdPrice > 0
    ) {
      setReceiveAmount(
        (payAmount * swapPayToken.usdPrice) / swapReceiveToken.usdPrice
      );
      setReceiveUsdPrice(receiveAmount * swapReceiveToken.usdPrice);
      setPayUsdPrice(payAmount * swapPayToken.usdPrice);
    } else {
      setReceiveAmount(0);
      setReceiveUsdPrice(0);
      setPayUsdPrice(0);
    }
  }, [payAmount, receiveAmount, swapPayToken, swapReceiveToken]);

  let data = {
    status: 'Pay',
    payAmount: 0.0,
    receiveAmount: 0.0,
    usdPrice: payUsdPrice,
  };

  let data2 = {
    status: 'Receive',
    payAmount: 0.0,
    receiveAmount: receiveAmount,
    usdPrice: receiveUsdPrice,
  };

  return (
    <div className="flex flex-col gap-3">
      <Headers title="Swaps" description="Swap your tokens to other tokens." />
      <div className="flex items-center justify-center w-full mt-10">
        <div className="sawap-card flex flex-col gap-3 w-full max-w-120 rounded-xl p-2 relative">
          <div className="flex items-center justify-between gap-3 px-1">
            <span className="text-lg font-bold">Swap</span>
            <div className="flex items-center gap-2">
              <button
                disabled={
                  (!swapPayToken?.address && !swapReceiveToken?.address) ||
                  swapLoading
                }
                onClick={() => {
                  if (
                    (swapPayToken?.address || swapPayToken?.token_address) &&
                    (swapReceiveToken?.address ||
                      swapReceiveToken?.token_address)
                  ) {
                    getSelectedSwapTokenPrice(swapPayToken, swapReceiveToken);
                  }
                }}
              >
                <FiRotateCw
                  className={`w-3.5 h-3.5 mr-1  cursor-pointer disabled:cursor-not-allowed smooth ${
                    swapLoading ? 'animate-spin' : 'text-zinc-500'
                  }`}
                />
              </button>
              <span className="text-xs font-medium text-zinc-500">
                {walletChain.name}
              </span>
              <Avatar className="h-4 w-4 rounded-full shrink-0">
                <AvatarImage className="rounded-full" src={walletChain.logo} />
                <AvatarFallback>
                  {walletChain.name.slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div className="relative flex flex-col gap-1 items-center justify-center">
            <SwapHolder data={data} setPayAmount={setPayAmount} />
            <div
              onClick={() => {
                if (swapPayToken?.address || swapReceiveToken?.address) {
                  dispatch(setSwapPayToken(swapReceiveToken));
                  dispatch(setSwapReceiveToken(swapPayToken));
                  setPayAmount(receiveAmount);
                  setReceiveAmount(payAmount);
                  setPayUsdPrice(receiveUsdPrice);
                  setReceiveUsdPrice(payUsdPrice);
                }
              }}
              className="flex smooth cursor-pointer items-center group justify-center p-1 rounded-lg w-[max-content] absolute z-10 bg-white dark:bg-[#1a1a1a]"
            >
              <div className="p-1 rounded-md border bg-zinc-500/5 border-zinc-500/20">
                <AiOutlineSwap className=" w-4 h-4  group-hover:rotate-90 smooth text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100" />
              </div>
            </div>
            <SwapHolder data={data2} bg={true} />
          </div>
          <Button
            onClick={() => {
              if (
                !swapPayToken ||
                !swapPayToken?.value ||
                swapPayToken?.value == '0'
              ) {
                toast.error('Enert the value of pay token');
                return;
              } else {
                getSwapAllowance();
              }
            }}
            disabled={makingSwap || !walletAddress}
            className="w-full rounded-xl h-10 text-md mt-1 font-semibold"
          >
            {makingSwap && (
              <i className="animate-spin">
                <LoaderCircle />
              </i>
            )}
            {!walletAddress ? 'Wallet not connected !' : 'Make Swap'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Swaps;
