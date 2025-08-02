import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { BlockChain } from '@/const/const';
import { useCryptoApi, useServerApi, useSwapApi } from '@/hooks';
import {
  setSwapPayToken,
  setSwapReceiveToken,
} from '@/toolkit/slice/swapSlice';
import React, { useRef, useState } from 'react';
import { IoIosArrowDown, IoMdSearch } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';

const SwapTokenSelect = ({ status = '', onClick }) => {
  const [search, setSearch] = useState();

  const swapTokenSelectRef = useRef();

  const dispatch = useDispatch();

  const { swapLoading, swapPayToken, swapReceiveToken, tokenList } =
    useSelector((state) => state.swap);

  const { tokens, tokenLoading } = useSelector((state) => state.token);

  const { walletChain } = useSelector((state) => state.wallet);

  const { getTokens } = useCryptoApi();

  const { getTokenList } = useServerApi();

  const { getSelectedSwapTokenPrice } = useSwapApi();

  const filteredTokenList = tokenList?.filter((token) => {
    const tokenSymbol = token?.symbol?.toLowerCase() || '';
    const tokenName = token?.name?.toLowerCase() || '';
    const query = search?.toLowerCase() || '';
    return tokenSymbol.includes(query) || tokenName.includes(query);
  });

  return (
    <Dialog>
      <DialogTrigger
        asChild
        onClick={() => setSearch('')}
        ref={swapTokenSelectRef}
      >
        <div
          onClick={() => {
            if (!tokenList?.length) {
              getTokenList();
            }
            if (!tokens?.length) {
              getTokens();
            }
          }}
          className="flex items-center gap-1 rounded-full p-1 border border-neutral-500/30 shadow cursor-pointer line-clamp-1 overflow-hidden max-w-[200px] "
        >
          {status == 'Pay' && swapPayToken?.symbol ? (
            <>
              <Avatar className="md:h-7 md:w-7 h-6 w-6 rounded-full flex items-center justify-center">
                <AvatarImage
                  className="md:h-7 md:w-7 h-6 w-6 rounded-full"
                  src={
                    swapPayToken?.logo ||
                    swapPayToken?.thumbnail ||
                    swapPayToken?.logoURI
                  }
                />
                <AvatarFallback>
                  {swapPayToken?.symbol?.slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-stone-500 px-1 py-0.5">
                {swapPayToken?.symbol}
              </span>
            </>
          ) : status == 'Receive' && swapReceiveToken?.symbol ? (
            <>
              <Avatar className="md:h-7 md:w-7 h-6 w-6 rounded-full flex items-center justify-center">
                <AvatarImage
                  className="md:h-7 md:w-7 h-6 w-6 rounded-full"
                  src={
                    swapReceiveToken?.logo ||
                    swapReceiveToken?.thumbnail ||
                    swapReceiveToken?.logoURI
                  }
                />
                <AvatarFallback>
                  {swapReceiveToken?.symbol?.slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-stone-500 px-1">
                {swapReceiveToken?.symbol}
              </span>
            </>
          ) : (
            <span className="text-stone-500 font-bold px-2 py-0.5">Select</span>
          )}
          <i className="text-zinc-500 px-0.5">
            <IoIosArrowDown />
          </i>
        </div>
      </DialogTrigger>
      <DialogContent className="p-3 flex flex-col gap-3 h-[85vh] overflow-hidden w-full md:w-[400px]">
        <DialogHeader className="flex flex-col gap-0">
          <DialogTitle className="text-lg">Select Token</DialogTitle>
          <DialogDescription>
            Choose a token from the list below to swap.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-500/10">
          <i className="text-xl text-zinc-500">
            <IoMdSearch />
          </i>
          <input
            type="text"
            placeholder="Search tokens..."
            className="outline-0 text-sm placeholder:text-zinc-500 p-1 bg-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {!swapLoading && !tokenLoading ? (
          <div className="flex-1 overflow-y-auto flex flex-col gap-3 scrollbar-hide">
            {tokens?.length > 0 && (
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-neutral-500 font-medium">
                  Your Tokens
                </span>
                <div className="flex items-center gap-3 overflow-x-auto custom-scroll">
                  {tokens?.map((token) => (
                    <div
                      key={`${token?.token_address}-${token?.usd_value}`}
                      onClick={() => {
                        if (status == 'Pay') {
                          dispatch(
                            setSwapPayToken({
                              address: token?.token_address || token?.address,
                              logo:
                                token?.logo ||
                                token?.thumbnail ||
                                token?.logoURI,
                              symbol: token?.symbol,
                              usdPrice: null,
                              value: '0.00',
                              decimal: token?.decimals || null,
                            })
                          );
                          getSelectedSwapTokenPrice(token, swapReceiveToken);
                        } else {
                          dispatch(
                            setSwapReceiveToken({
                              address: token?.token_address || token?.address,
                              logo:
                                token?.logo ||
                                token?.thumbnail ||
                                token?.logoURI,
                              symbol: token?.symbol,
                              usdPrice: null,
                              value: '0.00',
                              decimal: token?.decimals || null,
                            })
                          );
                          getSelectedSwapTokenPrice(swapPayToken, token);
                        }
                        swapTokenSelectRef.current.click();
                      }}
                      className="min-w-16 max-w-16 overflow-hidden flex flex-col gap-1 px-3 py-1.5 rounded-lg bg-zinc-500/5 items-center justify-center cursor-pointer"
                    >
                      <Avatar className="h-7 w-7 rounded-full flex items-center justify-center">
                        <AvatarImage
                          className="rounded-full"
                          src={
                            token?.logo || token?.thumbnail || token?.logoURI
                          }
                        />
                        <AvatarFallback>
                          {token?.symbol?.slice(0, 1).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-[10px] font-medium text-stone-500 line-clamp-1">
                        {token?.symbol}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-neutral-500 font-medium">
                All {walletChain?.name} Tokens
              </span>
              <div className="flex flex-col gap-1">
                {filteredTokenList?.map((token) => (
                  <div
                    key={token?.address}
                    onClick={() => {
                      if (status == 'Pay') {
                        dispatch(
                          setSwapPayToken({
                            address: token?.token_address || token?.address,
                            logo:
                              token?.logo || token?.thumbnail || token?.logoURI,
                            symbol: token?.symbol,
                            usdPrice: null,
                            value: '0.00',
                            decimal: token?.decimals || null,
                          })
                        );
                        getSelectedSwapTokenPrice(token, swapReceiveToken);
                      } else {
                        dispatch(
                          setSwapReceiveToken({
                            address: token?.token_address || token?.address,
                            logo:
                              token?.logo || token?.thumbnail || token?.logoURI,
                            symbol: token?.symbol,
                            usdPrice: null,
                            value: '0.00',
                            decimal: token?.decimals || null,
                          })
                        );
                        getSelectedSwapTokenPrice(swapPayToken, token);
                      }
                      swapTokenSelectRef.current.click();
                    }}
                    className="flex items-center justify-between gap-3 hover:bg-zinc-500/20 p-2 rounded-md cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 rounded-full flex items-center justify-center">
                        <AvatarImage
                          className="h-8 w-8 rounded-full"
                          src={
                            token?.logo || token?.thumbnail || token?.logoURI
                          }
                        />
                        <AvatarFallback>
                          {token?.symbol?.slice(0, 1).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-stone-500 line-clamp-1">
                          {token?.symbol}
                        </span>
                        <span className="text-xs text-zinc-500 line-clamp-1">
                          {token?.name}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-4 w-4 rounded-full flex items-center justify-center">
                        <AvatarImage
                          className="rounded-full"
                          src={
                            BlockChain.find(
                              (chain) => chain?.chainId === token?.chainId
                            )?.logo
                          }
                        />
                        <AvatarFallback>
                          {BlockChain.find(
                            (chain) => chain?.chainId === token?.chainId
                          )
                            ?.symbol.slice(0, 1)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto flex flex-col gap-3 scrollbar-hide">
              <div className="flex flex-col gap-1">
                <Skeleton className="h-3 w-20" />
                <div className="flex items-center gap-2 overflow-x-auto">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="flex flex-col gap-1 px-3 py-1.5 rounded-lg bg-zinc-500/5 items-center justify-center"
                    >
                      <Skeleton className="h-7 w-7 rounded-full" />
                      <Skeleton className="h-2 w-8" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1 scrollbar-hide">
                <Skeleton className="h-3 w-32" />
                <div className="flex flex-col gap-2">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-3 hover:bg-zinc-500/20 p-2 rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="flex flex-col gap-1">
                          <Skeleton className="h-3 w-12" />
                          <Skeleton className="h-2 w-24" />
                        </div>
                      </div>
                      <Skeleton className="h-5 w-5 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SwapTokenSelect;
