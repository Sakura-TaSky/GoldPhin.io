import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { BlockChain } from '@/const/const';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { useShortCuts, useCryptoApi } from '@/hooks';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useDispatch, useSelector } from 'react-redux';
import { PiListBold, PiGridFourFill } from 'react-icons/pi';
import useUiState from '@/context/UiStateContext';
import { MdOutlineRotateRight } from 'react-icons/md';
import { toast } from 'sonner';
import { setWalletChain } from '@/toolkit/slice/walletSlice';
import {
  setSwapPayToken,
  setSwapReceiveToken,
  setTokenList,
} from '@/toolkit/slice/swapSlice';
import { setTokenFetched, setTokens } from '@/toolkit/slice/tokenSlice';
import {
  setTransactionFetched,
  setTransactions,
} from '@/toolkit/slice/transactionSlice';
import { setNftFetched, setNfts } from '@/toolkit/slice/nftSlice';
import WalletBtn from '../content-view/components/walletBtn';

const Topbar = () => {
  const { theme, lightTheme, darkTheme } = useTheme();
  const { isList, setIsList, isSidebarOpen } = useUiState();
  const {
    walletAddress,
    walletChain,
    walletProfileImg,
    walletBalance,
    walletLoading,
    globelLoading,
    walletNativeBalance,
  } = useSelector((state) => state.wallet);

  const dispatch = useDispatch();

  const { syncWallet } = useCryptoApi();
  const location = useLocation();

  useShortCuts('shift + t', () => {
    if (theme === 'light') {
      darkTheme();
    } else {
      lightTheme();
    }
  });

  const isRouteActive =
    location.pathname.includes('tokens') || location.pathname.includes('nfts');

  const isSwapRouteActive = location.pathname.includes('swap');

  return (
    <div
      className={`fixed top-0 right-0 gap-2 p-1.5 dark:bg-[#1a1a1a] bg-white flex items-center justify-between w-full smooth z-30
     ${isSidebarOpen ? 'pl-62' : 'pl-10'}
    `}
    >
      <div>
        {isSwapRouteActive && (
          <div className="flex items-center gap-2 bg-gray-500/15 shadow rounded-full p-1 pr-3 justify-center">
            <Avatar className="w-5.5 h-5.5 rounded-full">
              <AvatarImage src="https://1inch.io/img/pressRoom/1inch_without_text.webp" />
              <AvatarFallback>1</AvatarFallback>
            </Avatar>
            <span className="text-[10px] text-zinc-500">
              Powered by{' '}
              <span className="text-xs font-medium text-[#4a6483]">1Inch</span>
            </span>
          </div>
        )}
        {isRouteActive && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setIsList(true);
              }}
              className={`${isList && 'bg-zinc-500/8 shadow smooth'}`}
            >
              <PiListBold className={`${isList && 'text-blue-500 smooth'}`} />
              List
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setIsList(false);
              }}
              className={`${!isList && 'bg-zinc-500/8 shadow smooth'}`}
            >
              <PiGridFourFill
                className={`${!isList && 'text-blue-500 smooth'}`}
              />
              Grid
            </Button>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        {walletAddress && (
          <>
            <div className="hidden md:flex items-center gap-3">
              <div className="text-xs font-medium text-gray-500 ">
                ${walletBalance ? walletBalance : '0'}
              </div>
              <div className="text-xs font-medium text-gray-500 ">
                {walletNativeBalance
                  ? walletNativeBalance
                  : `0 ${walletChain?.nativeToken}`}
              </div>
            </div>
            <Button
              disabled={walletLoading || globelLoading}
              variant="ghost"
              className="flex items-center gap-1 text-xs font-medium text-gray-500"
              onClick={() =>
                syncWallet(true).then((success) => {
                  if (success) {
                    toast.success('Wallet synced successfully');
                  }
                })
              }
            >
              <MdOutlineRotateRight
                className={`${
                  globelLoading
                    ? 'animate-spin'
                    : ' hover:cursor-pointer hover:scale-110 smooth'
                }`}
                size={16}
              />
              Sync
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="profile" className="p-2 smooth">
                  <Avatar className="w-5 h-5 border-2">
                    <AvatarImage src={walletChain.logo} />
                    <AvatarFallback>
                      {walletChain.name.slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="flex flex-col gap-1 m-2">
                {BlockChain.map((c) => (
                  <DropdownMenuItem
                    key={c.hex}
                    onClick={() => {
                      if (walletChain.hex === c.hex) {
                        return;
                      }
                      dispatch(setWalletChain(c));
                      dispatch(setSwapPayToken(null));
                      dispatch(setSwapReceiveToken(null));
                      dispatch(setTokenList(null));
                      dispatch(setNfts([]));
                      dispatch(setNftFetched(false));
                      dispatch(setTransactions([]));
                      dispatch(setTokens([]));
                      dispatch(setTokenFetched(false));
                      dispatch(setTransactionFetched(false));
                      toast.success(
                        <div className="flex items-center gap-2">
                          <span>{c.name} selected successfully</span>
                          <img
                            src={c.logo}
                            alt={c.name}
                            className="h-6 w-6 p-0.5 rounded-full border border-zinc-300 dark:border-zinc-600"
                          />
                        </div>
                      );
                      localStorage.setItem('blockChain', JSON.stringify(c));
                    }}
                    className={`items-start p-2.5 smooth ${
                      walletChain.hex === c.hex
                        ? 'text-black dark:text-white bg-zinc-500/30'
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-4 text-xs font-semibold">
                      <Avatar className="w-5 h-5 border-2">
                        <AvatarImage src={c?.logo} />
                        <AvatarFallback>
                          {c.name.slice(0, 1).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{c.name}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
        <WalletBtn />
      </div>
    </div>
  );
};

export default Topbar;
