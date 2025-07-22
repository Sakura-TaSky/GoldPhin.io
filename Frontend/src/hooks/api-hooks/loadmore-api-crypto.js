import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { apiKey, baseUrl } from '@/const/const';
import {
  setNftError,
  setNftFetchMore,
  setNfts,
  setNftSecondaryLoading,
} from '@/toolkit/slice/nftSlice';
import { toast } from 'sonner';
import {
  setTokenError,
  setTokenFetchMore,
  setTokens,
  setTokenSecondaryLoading,
} from '@/toolkit/slice/tokenSlice';
import {
  setTransactionError,
  setTransactionFetchMore,
  setTransactions,
  setTransactionSecondaryLoading,
} from '@/toolkit/slice/transactionSlice';

export default function useLoadMoreApiCrypto() {
  const dispatch = useDispatch();
  const { walletAddress, walletChain } = useSelector((state) => state.wallet);
  const { nfts, nftFetchMore } = useSelector((state) => state.nft);
  const { tokens, tokenFetchMore } = useSelector((state) => state.token);
  const { transactions, transactionFetchMore } = useSelector(
    (state) => state.transaction
  );

  const headers = {
    'X-API-Key': apiKey,
  };

  const chainHex = walletChain.hex;

  const loadMoreTokens = async () => {
    if (!walletAddress || !walletChain) return;
    if (!chainHex) {
      toast.error('This Blockchain is not supported !');
      return;
    }
    if (!tokenFetchMore) {
      toast.error('No more tokens to load');
      return;
    }
    const url = `${baseUrl}/wallets/${walletAddress}/tokens?chain=${chainHex}&cursor=${tokenFetchMore}`;
    try {
      dispatch(setTokenSecondaryLoading(true));
      const response = await axios.get(url, { headers });
      dispatch(setTokens([...tokens, ...response.data.result]));
      dispatch(setTokenFetchMore(response.data.cursor || null));
    } catch (error) {
      dispatch(setTokenError(error.message || 'Failed to load more tokens'));
      toast.error(error.message || 'Failed to load more tokens');
    } finally {
      dispatch(setTokenSecondaryLoading(false));
    }
  };

  const loadMoreNfts = async () => {
    if (!walletAddress || !walletChain) return;
    if (!chainHex) {
      toast.error('This Blockchain is not supported !');
      return;
    }
    if (!nftFetchMore) {
      toast.error('No more NFTs to load');
      return;
    }
    const url = `${baseUrl}/${walletAddress}/nft?chain=${chainHex}&cursor=${nftFetchMore}`;
    try {
      dispatch(setNftSecondaryLoading(true));
      const response = await axios.get(url, { headers });
      dispatch(setNfts([...nfts, ...response.data.result]));
      dispatch(setNftFetchMore(response.data.cursor || null));
    } catch (error) {
      dispatch(setNftError(error.message || 'Failed to load more nfts'));
      toast.error(error.message || 'Failed to load more nfts');
    } finally {
      dispatch(setNftSecondaryLoading(false));
    }
  };

  const loadMoreTransactions = async () => {
    if (!walletAddress || !walletChain) return;
    if (!chainHex) {
      toast.error('This Blockchain is not supported !');
      return;
    }
    if (!transactionFetchMore) {
      toast.error('No more transactions to load');
      return;
    }
    const url = `${baseUrl}/wallets/${walletAddress}/history?chain=${chainHex}&cursor=${transactionFetchMore}`;
    try {
      dispatch(setTransactionSecondaryLoading(true));
      const response = await axios.get(url, { headers });
      dispatch(setTransactions([...transactions, ...response.data.result]));
      dispatch(setTransactionFetchMore(response.data.cursor || null));
    } catch (error) {
      dispatch(
        setTransactionError(error.message || 'Failed to load more transactions')
      );
      toast.error(error.message || 'Failed to load more transactions');
    } finally {
      dispatch(setTransactionSecondaryLoading(false));
    }
  };

  return {
    loadMoreNfts,
    loadMoreTokens,
    loadMoreTransactions,
  };
}
