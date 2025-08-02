import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useDispatch, useSelector } from 'react-redux';
import { LuRotateCw } from 'react-icons/lu';
import { IoIosArrowDown } from 'react-icons/io';
import { LuLoaderCircle } from 'react-icons/lu';
import SwapTokenSelect from './SwapTokenSelect';
import { useServerApi, useSwapApi, useTrim } from '@/hooks';
import {
  setSwapPayToken,
  setSwapReceiveToken,
} from '@/toolkit/slice/swapSlice';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { AiOutlineSwap } from 'react-icons/ai';

const SwapHolder = () => {
  const trim = useTrim();

  const tokenTrim = useTrim(5);

  const dispatch = useDispatch();

  const { walletChain, walletAddress } = useSelector((state) => state.wallet);

  const { swapLoading, swapPayToken, swapReceiveToken, makingSwap, swapError } =
    useSelector((state) => state.swap);

  const [payToken, setPayToken] = useState('');
  const [receiveToken, setReceiveToken] = useState('');
  const [rate, setRate] = useState(0);

  const { getSelectedSwapTokenPrice } = useSwapApi();

  const { getSwapAllowance } = useServerApi();

  useEffect(() => {
    if (!payToken) {
      setReceiveToken('');
      return;
    }
    if (
      payToken > 0 &&
      swapPayToken?.usdPrice > 0 &&
      swapReceiveToken?.usdPrice > 0
    ) {
      setReceiveToken(
        (payToken * swapPayToken?.usdPrice) / swapReceiveToken?.usdPrice
      );
    }
  }, [payToken]);

  useEffect(() => {
    setRate((1 * swapPayToken?.usdPrice) / swapReceiveToken?.usdPrice);
  }, [swapPayToken, swapReceiveToken]);

  return (
    <div className="w-full flex items-center justify-center mt-10 p-2">
      <div className="flex md:w-120 flex-col gap-3 p-3">
        <div className="flex items-center justify-between px-0.5">
          <span className="font-semibold">Swap</span>
          <div className="flex items-center gap-2">
            <Button
              onClick={() =>
                getSelectedSwapTokenPrice(swapPayToken, swapReceiveToken)
              }
              disabled={swapLoading}
              variant={'ghost'}
              size="sm"
            >
              <LuRotateCw className={`${swapLoading && 'animate-spin'}`} />
            </Button>
            <span className="text-xs font-medium">{walletChain?.name}</span>
            <span>
              <Avatar className="size-4">
                <AvatarImage src={walletChain?.logo} />
                <AvatarFallback></AvatarFallback>
              </Avatar>
            </span>
          </div>
        </div>
        <div className="flex w-full items-center justify-center flex-col gap-1">
          <div className="w-full flex items-center justify-between border p-3 rounded-2xl border-zinc-500/20 shadow-md">
            <div className="flex flex-col gap-2">
              <span className="text-xs text-zinc-500 font-medium">Pay</span>
              <input
                type="number"
                value={payToken}
                onChange={(e) => (
                  setPayToken(e.target.value),
                  dispatch(
                    setSwapPayToken({
                      ...swapPayToken,
                      value: e.target.value,
                    })
                  )
                )}
                placeholder="0.00"
                className="outline-0 placeholder:text-zinc-500 text-3xl font-semibold w-full"
              ></input>
              <span className="font-semibold text-xs text-gray-500">
                ~{`${trim(payToken * swapPayToken?.usdPrice)}`}$
              </span>
            </div>
            <div className="flex flex-col gap-1 justify-end items-end">
              <SwapTokenSelect status="Pay" />
            </div>
          </div>
          <div
            onClick={() => {
              setPayToken('');
              setReceiveToken('');
              dispatch(setSwapPayToken(swapReceiveToken));
              dispatch(setSwapReceiveToken(swapPayToken));
            }}
            className="absolute p-[5px] w-[max-content] flex bg-white rounded-md dark:bg-[#1a1a1a] smooth"
          >
            <span className="p-1 border border-zinc-500/20 rounded-md bg-white shadow dark:bg-[#1A1A1A] hover:shadow-md cursor-pointer group smooth">
              <AiOutlineSwap className="group-hover:rotate-90 smooth" />
            </span>
          </div>
          <div className="w-full flex items-center justify-between p-3 rounded-2xl bg-gray-500/15 border border-zinc-500/20 shadow-md">
            <div className="flex flex-col gap-2">
              <span className="text-xs text-zinc-500 font-medium">Receive</span>
              <input
                disabled
                value={receiveToken}
                placeholder="0.00"
                className="outline-0 text-3xl font-semibold placeholder:text-zinc-500 w-full"
              ></input>
              <span className="font-semibold text-xs text-gray-500">
                ~{`${trim(receiveToken * swapReceiveToken?.usdPrice)}`}$
              </span>
            </div>
            <div className="flex flex-col gap-1 justify-end items-end">
              <SwapTokenSelect status="Receive" />
            </div>
          </div>
        </div>
        <div className="w-full flex items-center justify-between p-3 smooth shadow-md rounded-2xl bg-gray-500/30 text-gray-600 dark:text-gray-400 border border-zinc-500/20 text-xs font-medium">
          <span className="w-full flex items-center gap-2 flex-wrap">
            Rate -
            {swapLoading ? (
              <Skeleton className="h-[20px] bg-zinc-500 w-[60%]" />
            ) : !swapPayToken.symbol || !swapReceiveToken.symbol ? (
              <span>Select tokens to see Rate !</span>
            ) : (
              <>
                <span>
                  1 {swapPayToken?.symbol} = {rate ? tokenTrim(rate) : 1}{' '}
                  {swapReceiveToken?.symbol}
                </span>
                <span className="">~{`${trim(swapPayToken?.usdPrice)}`}$</span>
              </>
            )}
          </span>
        </div>
        <Button
          onClick={() => {
            if (!payToken) {
              toast.error('Enter Pay Amount !');
              return;
            }
            getSwapAllowance();
          }}
          disabled={makingSwap || !walletAddress}
          className="w-full rounded-2xl shadow-md h-12 text-md font-bold bg-gradient-to-r from-zinc-600 via-gray-600 to-stone-600 dark:from-zinc-400 dark:via-gray-400 dark:to-stone-400 hover:opacity-90 text-white text-lg"
        >
          {makingSwap && <LuLoaderCircle className="animate-spin" />}{' '}
          {!walletAddress ? 'Wallet not Connected' : 'Swap'}
        </Button>
      </div>
    </div>
  );
};

export default SwapHolder;
