import { useEffect, useRef } from 'react';
import axios from 'axios';
import { apiKey, baseUrl } from '@/const/const';
import { useSelector, useDispatch } from 'react-redux';
import {
  setTokens,
  setTokenError,
  setTokenLoading,
  setTokenFetchMore,
  setTokenFetched,
} from '@/toolkit/slice/tokenSlice';
import {
  setWalletBalance,
  setWalletError,
  setWalletNativeBalance,
  setWalletLoading,
  setGlobelLoading,
} from '@/toolkit/slice/walletSlice';

import { useTrim } from '@/hooks';
import { toast } from 'sonner';
import {
  setTransactionError,
  setTransactionLoading,
  setTransactionFetchMore,
  setTransactions,
  setTransactionFetched,
} from '@/toolkit/slice/transactionSlice';
import {
  setNftError,
  setNftFetched,
  setNftFetchMore,
  setNftLoading,
  setNfts,
} from '@/toolkit/slice/nftSlice';
import { useLocation } from 'react-router-dom';

export default function useCryptoApi() {
  const location = useLocation();
  const trim = useTrim();
  const dispatch = useDispatch();
  const { walletAddress, walletChain } = useSelector((state) => state.wallet);
  const { tokenFetched } = useSelector((state) => state.token);
  const { nftFetched } = useSelector((state) => state.nft);
  const { transactionFetched } = useSelector((state) => state.transaction);

  const headers = {
    'X-API-Key': apiKey,
  };

  const chainHex = walletChain.hex;

  const lastFetchedChainRef = useRef(null);

  const getWalletNetWorth = async (
    sync,
    {
      excludeSpam = true,
      excludeUnverifiedContracts = true,
      maxTokenInactivity = 1,
      minPairSideLiquidityUsd = 1000,
    } = {}
  ) => {
    if (!walletAddress || !walletChain) return;
    if (!chainHex) {
      toast.error('This Blockchain is not supported !');
      return;
    }
    if (!sync && lastFetchedChainRef.current?.hex == walletChain.hex) {
      return;
    }
    const params = {
      chains: [chainHex],
      exclude_spam: excludeSpam,
      exclude_unverified_contracts: excludeUnverifiedContracts,
      max_token_inactivity: maxTokenInactivity,
      min_pair_side_liquidity_usd: minPairSideLiquidityUsd,
    };
    try {
      dispatch(setWalletLoading(true));
      dispatch(setGlobelLoading(true));
      const response = await axios.get(
        `${baseUrl}/wallets/${walletAddress}/net-worth?chain=${chainHex}`,
        {
          headers: headers,
          params,
        }
      );
      if (response.data) {
        const nativeBalance =
          trim(response.data.chains[0].native_balance_formatted) +
          ` ${walletChain.nativeToken}`;
        const netWorth = response.data.total_networth_usd;
        dispatch(setWalletBalance(netWorth));
        dispatch(setWalletNativeBalance(nativeBalance));
        lastFetchedChainRef.current = walletChain;
        return true;
      }
    } catch (err) {
      dispatch(
        setWalletError(err.message || 'Failed to fetch wallet net worth')
      );
      toast.error(err.message || 'Failed to fetch wallet net worth');
    } finally {
      dispatch(setWalletLoading(false));
      dispatch(setGlobelLoading(false));
    }
  };

  const getTokens = async (sync) => {
    if (!walletAddress || !walletChain) return;
    if (!chainHex) {
      toast.error('This Blockchain is not supported !');
      return;
    }
    if (
      !sync &&
      tokenFetched &&
      lastFetchedChainRef.current?.hex == walletChain.hex
    ) {
      return;
    }
    const url = `${baseUrl}/wallets/${walletAddress}/tokens?chain=${chainHex}`;
    try {
      dispatch(setTokenLoading(true));
      dispatch(setGlobelLoading(true));
      const response = await axios.get(url, { headers: headers });
      dispatch(
        setTokens(
          response.data.result.map((t) => {
            if (
              t.token_address === '0x2e9a6df78e42a30712c10a9dc4b1c8656f8f2879'
            ) {
              return {
                ...t,
                name: 'Maker',
                symbol: 'MKR',
              };
            }
            return t;
          })
        )
      );
      dispatch(setTokenFetched(true));
      lastFetchedChainRef.current = walletChain;
      if (response.data.cursor) {
        dispatch(setTokenFetchMore(response.data.cursor || null));
      }
      return true;
    } catch (err) {
      dispatch(setTokenError(err.message || 'Failed to fetch tokens'));
      toast.error(err.message || 'Failed to fetch tokens');
    } finally {
      dispatch(setTokenLoading(false));
      dispatch(setGlobelLoading(false));
    }
  };

  const getNfts = async (sync) => {
    if (!walletAddress || !walletChain) return;
    if (!chainHex) {
      toast.error('This Blockchain is not supported !');
      return;
    }
    if (
      !sync &&
      nftFetched &&
      lastFetchedChainRef.current?.hex == walletChain.hex
    ) {
      return;
    }
    const url = `${baseUrl}/${walletAddress}/nft?chain=${chainHex}`;
    try {
      dispatch(setNftLoading(true));
      dispatch(setGlobelLoading(true));
      const response = await axios.get(url, { headers: headers });
      dispatch(setNfts(response.data.result));
      dispatch(setNftFetched(true));
      lastFetchedChainRef.current = walletChain;
      if (response.data.cursor) {
        dispatch(setNftFetchMore(response.data.cursor || null));
      }
      return true;
    } catch (err) {
      dispatch(setNftError(err.message || 'Failed to fetch nfts'));
      toast.error(err.message || 'Failed to fetch nfts');
    } finally {
      dispatch(setNftLoading(false));
      dispatch(setGlobelLoading(false));
    }
  };

  const getWalletTransactions = async (sync) => {
    if (!walletAddress || !walletChain) return;
    if (!chainHex) {
      toast.error('This Blockchain is not supported !');
      return;
    }
    if (
      !sync &&
      transactionFetched &&
      lastFetchedChainRef.current?.hex == walletChain.hex
    ) {
      return;
    }
    const url = `${baseUrl}/wallets/${walletAddress}/history?chain=${chainHex}`;
    try {
      dispatch(setTransactionLoading(true));
      dispatch(setGlobelLoading(true));
      const response = await axios.get(url, { headers: headers });
      const tx = response.data.result.filter(
        (tx) => tx.category !== 'contract interaction'
      );
      dispatch(setTransactions(tx));
      dispatch(setTransactionFetched(true));
      lastFetchedChainRef.current = walletChain;
      if (response.data.cursor) {
        dispatch(setTransactionFetchMore(response.data.cursor || null));
      }
      return true;
    } catch (err) {
      dispatch(
        setTransactionError(err.message || 'Failed to fetch transactions')
      );
      toast.error(err.message || 'Failed to fetch transactions');
    } finally {
      dispatch(setTransactionLoading(false));
      dispatch(setGlobelLoading(false));
    }
  };

  useEffect(() => {
    const fetch = async () => {
      if (location.pathname.includes('wallet')) {
        await getWalletNetWorth();
        if (location.pathname.includes('tokens')) {
          await getTokens();
        } else if (location.pathname.includes('dashboard')) {
          await getTokens();
          await getWalletTransactions();
        } else if (location.pathname.includes('nfts')) {
          await getNfts();
        } else if (location.pathname.includes('transactions')) {
          await getWalletTransactions();
        } else {
          return;
        }
      }
    };
    fetch();
  }, [walletAddress, walletChain]);

  return {
    getWalletNetWorth,
    getTokens,
    getNfts,
    getWalletTransactions,
  };
}
