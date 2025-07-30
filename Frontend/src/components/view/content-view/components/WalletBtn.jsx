import React from 'react';
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
import { useWallet } from '@/hooks';
import { useSelector } from 'react-redux';
import { ShortCutKey } from './ShortCutKey';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
const WalletBtn = () => {
  const { walletAddress, walletChain, walletProfileImg } = useSelector(
    (state) => state.wallet
  );

  const { connectWallet, disconnectWallet, isConnecting } = useWallet();

  const { lightTheme, darkTheme } = useTheme();

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
          onClick={disconnectWallet}
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
    <Button
      variant="connect"
      onClick={connectWallet}
      disabled={isConnecting}
      className="text-yellow-900 smooth"
    >
      {isConnecting ? 'Open Wallet' : 'Connect Wallet'}
    </Button>
  );
};

export default WalletBtn;
