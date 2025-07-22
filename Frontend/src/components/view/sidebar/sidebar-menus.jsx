import React from 'react';
import { MdDashboard, MdToken } from 'react-icons/md';
import MenuIcon from '@/components/ui/menuIcon';
import { useSelector } from 'react-redux';
import { GrTransaction } from 'react-icons/gr';
import { useLocation } from 'react-router-dom';
import { RiTokenSwapFill, RiNftFill, RiQrCodeFill } from 'react-icons/ri';
import useCryptoApi from '@/hooks/api-hooks/api-crypto';

const SidebarMenus = () => {
  const location = useLocation();

  const { getTokens, getWalletTransactions, getNfts } = useCryptoApi();

  const { walletAddress } = useSelector((state) => state.wallet);

  const address = walletAddress ? walletAddress : 'connect-wallet';

  const menus = [
    {
      name: 'Dashboard',
      icon: <MdDashboard />,
      link: `/wallet/dashboard/${address}`,
      onClick: () => {},
    },
    {
      name: 'Tokens',
      icon: <MdToken />,
      link: `/wallet/tokens/${address}`,
      onClick: () => getTokens(false),
    },
    {
      name: 'NFTs',
      icon: <RiNftFill />,
      link: `/wallet/nfts/${address}`,
      onClick: () => getNfts(false),
    },
    {
      name: 'Transactions',
      icon: <GrTransaction />,
      link: `/wallet/transactions/${address}`,
      onClick: () => getWalletTransactions(false),
    },
  ];

  const menusTrade = [
    {
      name: 'Swap',
      icon: <RiTokenSwapFill />,
      link: `/wallet/swap/${address}`,
    },
    {
      name: 'Send-Receive',
      icon: <RiQrCodeFill />,
      link: `/wallet/send-receive/${address}`,
    },
  ];

  return (
    <div className="flex flex-col gap-2 dark:font-light">
      <span className="text-xs font-medium text-zinc-500">Wallet-Overview</span>
      <div className="flex flex-col gap-1 ml-1">
        {menus.map((menu) => (
          <MenuIcon
            onClick={menu.onClick}
            className={`${
              location.pathname.includes(menu.link.split('/')[2])
                ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-800 shadow-md'
                : 'hover:bg-zinc-500/20 hover:shadow'
            }`}
            key={menu.name}
            {...menu}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-zinc-500 mt-2">Trade</span>
      <div className="flex flex-col gap-1 ml-1">
        {menusTrade.map((menu) => (
          <MenuIcon
            className={`${
              location.pathname.includes(menu.link.split('/')[2])
                ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-800 shadow-md'
                : 'hover:bg-zinc-500/20 hover:shadow'
            }`}
            key={menu.name}
            {...menu}
          />
        ))}
      </div>
    </div>
  );
};

export default SidebarMenus;
