import React from 'react';
import { Sidebar, Topbar } from '@/components/view';
import { Route, Routes } from 'react-router-dom';
import useUiState from '@/context/UiStateContext';
import {
  CryptoProfile,
  Tokens,
  Nfts,
  Transactions,
  Swaps,
} from '@/components/view';
import Home from '@/components/home/homePage/Home';

const AppLayout = () => {
  const { isSidebarOpen } = useUiState();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/wallet/*"
        element={
          <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Topbar />
              <div
                className={`flex-1 p-4 smooth mt-10
                ${isSidebarOpen ? 'ml-0 md:ml-60' : 'ml-0'}
                `}
              >
                <Routes>
                  <Route path="tokens/:address" element={<Tokens />} />
                  <Route path="nfts/:address" element={<Nfts />} />
                  <Route
                    path="transactions/:address"
                    element={<Transactions />}
                  />
                  <Route path="swap/:address" element={<Swaps />} />
                  <Route
                    path="Crypto-profile/:address"
                    element={<CryptoProfile />}
                  />
                </Routes>
              </div>
            </div>
          </div>
        }
      />
    </Routes>
  );
};

export default AppLayout;
