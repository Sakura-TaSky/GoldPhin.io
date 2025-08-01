import Goldphin from '@/components/logo/GoldFin';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';
import { useShortCuts } from '@/hooks';
import React from 'react';
import { Link } from 'react-router-dom';
import { GoArrowUpRight } from 'react-icons/go';
import { RiNftFill, RiTokenSwapFill } from 'react-icons/ri';
import { GrGithub, GrTransaction } from 'react-icons/gr';
import WalletBtn from '@/components/view/content-view/components/walletBtn';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { useSelector } from 'react-redux';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CgMenuLeftAlt } from 'react-icons/cg';
import { MdToken } from 'react-icons/md';
import { Moon, Sun } from 'lucide-react';

const Home = () => {
  const { theme, lightTheme, darkTheme } = useTheme();

  const { walletAddress } = useSelector((state) => state.wallet);

  useShortCuts('shift + t', () => {
    if (theme === 'light') {
      darkTheme();
    } else {
      lightTheme();
    }
  });

  return (
    <main className="w-full h-scree">
      <div className="flex items-center w-full justify-between px-2 py-1.5 text-sm font-medium">
        <div className="flex items-center gap-2">
          <Goldphin />
          <div className="md:flex hidden">
            {[
              {
                name: 'Token',
                path: '/wallet/tokens/address',
              },
              {
                name: 'NFT',
                path: '/wallet/nfts/address',
              },
              {
                name: 'Transaction',
                path: '/wallet/transactions/address',
              },
              // {
              //   name: 'Swap',
              //   path: '/wallet/swap/address',
              // },
            ].map((m) => (
              <Link key={m.name} to={m.path}>
                <Button variant="ghost">{m.name}</Button>
              </Link>
            ))}
          </div>
          <div className="flex md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <CgMenuLeftAlt />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {[
                  {
                    name: 'Token',
                    path: '/wallet/tokens/address',
                    icon: <MdToken />,
                  },
                  {
                    name: 'NFT',
                    path: '/wallet/nfts/address',
                    icon: <RiNftFill />,
                  },
                  {
                    name: 'Transaction',
                    path: '/wallet/transactions/address',
                    icon: <GrTransaction />,
                  },
                  // {
                  //   name: 'Swap',
                  //   path: '/wallet/swap/address',
                  //   icon: <RiTokenSwapFill />,
                  // },
                ].map((m) => (
                  <DropdownMenuItem className="p-1">
                    <Link key={m.name} to={m.path}>
                      <Button variant="ghost">
                        {m.icon}
                        {m.name}
                      </Button>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            onClick={() => {
              theme === 'light' ? darkTheme() : lightTheme();
            }}
            variant="ghost"
          >
            {theme === 'light' ? <Moon /> : <Sun />}
          </Button>
          <WalletBtn />
        </div>
      </div>
      <div className="md:mt-12 mt-6 p-2 flex flex-col w-full justify-center items-center gap-1">
        <a
          className="flex px-3 py-1 border rounded-full gap-1 items-center border-zinc-500/12 shadow-md"
          target="_blank"
          href="https://github.com/Sakura-TaSky"
        >
          <span className="text-[10px] font-medium">
            Built by
            <span className="text-[12px] font-bold"> Sakura</span>
          </span>
        </a>
        <div className="flex items-center justify-center flex-col text-4xl md:text-5xl font-semibold">
          <h1 className="text-center tracking-tight">
            Crypto wallet overview with Token swap
          </h1>
          <p className="text-center text-sm text-zinc-500 md:w-[70%] p-6 -mt-4">
            Effortlessly track and manage your crypto assets in one place.
            Connect your wallet to view tokens, NFTs, and history — and swap
            tokens instantly across networks.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 w-full -mt-4">
        {walletAddress ? (
          <>
            <Link to={`/wallet/swap/${walletAddress}`}>
              <Button variant="outline" className="rounded-full shadow-md">
                Swap <RiTokenSwapFill />
              </Button>
            </Link>
            <Link to={`/wallet/tokens/${walletAddress}`}>
              <Button className="rounded-full shadow-md">
                Dashboard <GoArrowUpRight strokeWidth={1} />
              </Button>
            </Link>
          </>
        ) : (
          <WalletBtn />
        )}
      </div>
    </main>
  );
};

export default Home;
