import React, { useRef } from 'react';
import useUiState from '@/context/UiStateContext';
import { SidebarControlBtn, SidebarMenus } from '@/components/view';
import Goldphin from '@/components/logo/GoldFin';
import { useClickOutSide, useWindowResize } from '@/hooks';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useUiState();
  const sidebarRef = useRef();

  const { width } = useWindowResize({
    func: setIsSidebarOpen,
    breakpoint: 768,
  });

  useClickOutSide(sidebarRef, () => {
    if (width < 768) {
      setIsSidebarOpen(false);
    }
  });

  return (
    <>
      <SidebarControlBtn />
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 w-60 h-screen border-r overflow-hidden border-gray-500/10 smooth z-40 dark:bg-[#1a1a1a] bg-white flex flex-col
         ${
           isSidebarOpen ? 'translate-x-0' : '-translate-x-full opacity-0'
         } smooth scrollbar-hide`}
      >
        {/* logo  */}
        <div className="p-1 border-b border-zinc-500/10">
          <Link to="/">
            <Goldphin />
          </Link>
        </div>

        {/* menus */}
        <div className="flex flex-col flex-grow overflow-y-auto gap-6 p-2 w-full justify-between scrollbar-hide">
          <SidebarMenus />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
