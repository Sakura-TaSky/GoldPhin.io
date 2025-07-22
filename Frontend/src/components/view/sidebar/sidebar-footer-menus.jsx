import React from 'react';
import { MdSettings } from 'react-icons/md';
import MenuIcon from '@/components/ui/menuIcon';
import { SiHiveBlockchain } from 'react-icons/si';
import { useLocation } from 'react-router-dom';

const SidebarFooterMenus = () => {
  const location = useLocation();

  const menus = [
    {
      name: 'BlockChains',
      icon: <SiHiveBlockchain />,
      link: '/wallet/block-chains',
    },
    {
      name: 'Settings',
      icon: <MdSettings />,
      link: '/wallet/settings',
    },
  ];

  return (
    <div className="flex flex-col gap-1 dark:font-light">
      {menus.map((menu) => (
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
  );
};

export default SidebarFooterMenus;
