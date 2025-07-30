import { useState, useRef, useEffect } from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import { useDispatch, useSelector } from 'react-redux';
import {
  setWalletAddress,
  setWalletProfileImg,
  setWalletUser,
  setWalletUserFetched,
} from '@/toolkit/slice/walletSlice';
import { setTokens } from '@/toolkit/slice/tokenSlice';
import { setTransactions } from '@/toolkit/slice/transactionSlice';
import { setNfts } from '@/toolkit/slice/nftSlice';

export const useWallet = () => {
  const dispatch = useDispatch();
  const { walletAddress } = useSelector((state) => state.wallet);
  const [isConnecting, setIsConnecting] = useState(false);

  const ethereum = useRef(
    typeof window !== 'undefined' ? window.ethereum : null
  ).current;

  const setWalletData = (address) => {
    if (address) {
      dispatch(setWalletAddress(address));
      dispatch(setWalletProfileImg(makeBlockie(address)));
      localStorage.removeItem('walletDisconnected');
      localStorage.removeItem('wallet');
    } else {
      dispatch(setWalletAddress(null));
      dispatch(setWalletProfileImg(null));
      dispatch(setTokens([]));
      dispatch(setTransactions([]));
      dispatch(setNfts([]));
      dispatch(setWalletUser(null));
      dispatch(setWalletUserFetched(false));
      localStorage.setItem('walletDisconnected', true);
    }
  };

  const connectWallet = async () => {
    if (!ethereum) {
      alert('MetaMask not detected. Please install MetaMask.');
      return;
    }

    if (isConnecting) return;

    setIsConnecting(true);

    try {
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      if (accounts && accounts.length > 0) {
        setWalletData(accounts[0]);
        localStorage.setItem('wallet', accounts[0]);
      }
    } catch (err) {
      if (
        err?.code === -32002 ||
        (typeof err.message === 'string' &&
          err.message.toLowerCase().includes('already processing'))
      ) {
        alert('A wallet connection request is already pending in MetaMask.');
      } else {
        alert(err?.message || 'Failed to connect wallet');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletData(null);
  };

  const checkExistingConnection = async () => {
    if (!ethereum) return;
    const manuallyDisconnected = localStorage.getItem(
      'walletDisconnected' == true
    );
    if (manuallyDisconnected) {
      setWalletData(null);
      return;
    }
    if (localStorage.getItem('wallet')) {
      dispatch(setWalletAddress(localStorage.getItem('wallet')));
    }
    try {
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (accounts && accounts.length > 0) {
        setWalletData(accounts[0]);
      } else {
        setWalletData(null);
      }
    } catch (err) {
      console.error('Failed to check wallet connection:', err);
    }
  };

  useEffect(() => {
    if (!ethereum) return;
    if (localStorage.getItem('walletDisconnected')) return;
    checkExistingConnection();
    const handleAccountsChanged = (accounts) => {
      if (accounts && accounts.length > 0) {
        setWalletData(accounts[0]);
      } else {
        setWalletData(null);
      }
    };
    ethereum.on('accountsChanged', handleAccountsChanged);
    return () => {
      ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, []);

  return {
    connectWallet,
    disconnectWallet,
    isConnecting,
    walletAddress,
  };
};
