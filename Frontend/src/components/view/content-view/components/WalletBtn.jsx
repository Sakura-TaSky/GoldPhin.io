import React, { useEffect } from 'react';
import IconBtn from '@/components/ui/IconBtn';
import { CgProfile } from 'react-icons/cg';
import { MdColorLens } from 'react-icons/md';
import { LuLogOut } from 'react-icons/lu';
import { IoSunnyOutline } from 'react-icons/io5';
import { PiMoonFill } from 'react-icons/pi';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuGroup,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDispatch, useSelector } from 'react-redux';
import { ShortCutKey } from './ShortCutKey';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useConnect, useDisconnect, useAccount } from 'wagmi';
import {
  setWalletAddress,
  setWalletProfileImg,
} from '@/toolkit/slice/walletSlice';
import makeBlockie from 'ethereum-blockies-base64';
import { setTokens } from '@/toolkit/slice/tokenSlice';
import { setNfts } from '@/toolkit/slice/nftSlice';
import { setTransactions } from '@/toolkit/slice/transactionSlice';

const walletLogos = {
  metaMask: '/svgs/metamask.png',
  coinbaseWallet: '/svgs/coinbase.svg',
  walletConnect: '/svgs/walletconnect.svg',
};

const WalletBtn = () => {
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { address } = useAccount();

  const { walletAddress, walletChain, walletProfileImg } = useSelector(
    (state) => state.wallet
  );

  const { lightTheme, darkTheme } = useTheme();

  const dispatch = useDispatch();

  useEffect(() => {
    if (address) {
      dispatch(setWalletAddress(address));
      try {
        const blockie = makeBlockie(address.toLowerCase());
        dispatch(setWalletProfileImg(blockie));
      } catch (err) {
        console.error('Failed to generate blockie:', err);
      }
    }
  }, [address, dispatch]);

  return walletAddress ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="profile" className="p-2">
          <span className="text-sm font-medium ml-0.5 hidden md:block">
            {walletAddress.slice(0, 6)}....
            {walletAddress.slice(-4)}
          </span>
          <Avatar className="w-4.5 h-4.5">
            <AvatarImage src={walletProfileImg} alt="you" />
            <AvatarFallback>
              {walletAddress.slice(-1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="m-2">
        <DropdownMenuLabel>
          <div className="flex items-center gap-3">
            <Avatar className="w-6 h-6">
              <AvatarImage src={walletProfileImg} alt="you" />
              <AvatarFallback>
                {walletAddress.slice(-1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium tracking-wider">
                {walletAddress.slice(0, 6)}....
                {walletAddress.slice(-4)}
              </span>
              <span className="text-xs text-zinc-500 font-medium -mt-0.5">
                {walletChain ? walletChain.name : 'Unknown Chain'}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {[
            {
              name: 'Profile',
              icon: <CgProfile className="text-zinc-500" />,
              path: `/wallet/Crypto-profile/${walletAddress}`,
            },
          ].map((menu) => (
            <Link to={menu.path} key={menu.path}>
              <DropdownMenuItem className="hover:bg-zinc-500/10 group">
                <IconBtn icon={menu.icon} text={menu.name} />
              </DropdownMenuItem>
            </Link>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="hover:bg-zinc-500/10 group cursor-pointer">
              <IconBtn
                icon={<MdColorLens size={18} className="text-zinc-500" />}
                text={
                  <>
                    Theme <ShortCutKey keys={['shift', 't']} />
                  </>
                }
              />
            </DropdownMenuSubTrigger>

            <DropdownMenuSubContent className="mr-4">
              {[
                {
                  name: 'Light',
                  icon: <IoSunnyOutline className="text-zinc-500" />,
                  onClick: lightTheme,
                },
                {
                  name: 'Dark',
                  icon: <PiMoonFill className="text-zinc-500" />,
                  onClick: darkTheme,
                },
              ].map((menu) => (
                <DropdownMenuItem
                  key={menu.name}
                  className="hover:bg-zinc-500/10 group"
                  onClick={menu.onClick}
                >
                  <IconBtn icon={menu.icon} text={menu.name} />
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="hover:bg-red-500/20 group"
          onClick={() => {
            disconnect();
            dispatch(setWalletAddress(null));
            dispatch(setWalletProfileImg(null));
            dispatch(setTokens([]));
            dispatch(setNfts([]));
            dispatch(setTransactions([]));
          }}
        >
          <IconBtn
            icon={
              <LuLogOut className="text-zinc-500 group-hover:text-red-500" />
            }
            text="Disconnect"
            isDanger={true}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="connect" className="text-yellow-900 smooth">
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect wallet</DialogTitle>
          <DialogDescription>
            Choose a wallet from the list below to connect with GoldPhin.io
          </DialogDescription>
        </DialogHeader>
        {connectors.map((c) => (
          <button
            key={c.id}
            onClick={() => connect({ connector: c })}
            className="cursor-pointer w-full px-3 py-2 flex gap-4 text-sm font-semibold hover:shadow-lg hover:bg-zinc-500/10 items-center border rounded-md"
          >
            <Avatar>
              <AvatarImage src={walletLogos[c.type]} />
              <AvatarFallback>{c.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            {c.name}
          </button>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default WalletBtn;
