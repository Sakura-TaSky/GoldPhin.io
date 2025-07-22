import React, { useState } from 'react';
import Headers from '../components/Headers';
import { useSelector } from 'react-redux';
import { getNftFilterData } from '@/hooks/utils-hooks/getNftFilterData';
import NoData from '../components/NoData';
import NftTable from './NftTable';
import NftGrid from './NftGrid';
import useUiState from '@/context/UiStateContext';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLoadMoreApiCrypto } from '@/hooks';

const Nfts = () => {
  const { isList } = useUiState();
  const { nfts, nftLoading, nftFetchMore, nftSecondaryLoading } = useSelector(
    (state) => state.nft
  );
  const [search, setSearch] = useState('');
  const nftData = getNftFilterData(nfts || []);
  const { loadMoreNfts } = useLoadMoreApiCrypto();

  const filterNfts = () => {
    let sortedNfts = [...nftData];
    if (search.trim() !== '') {
      sortedNfts = sortedNfts.filter((nft) => {
        const term = search.toLowerCase();
        return (
          nft._mainName?.toLowerCase().includes(term) ||
          nft._name?.toLowerCase().includes(term)
        );
      });
    }
    return sortedNfts;
  };

  return (
    <div className="flex flex-col gap-3">
      <Headers
        title="NFTs"
        description="A detailed overview of your wallet's NFT holdings."
      />
      {nftData.length > 0 && (
        <div className="flex gap-2 items-center w-full">
          <div className="flex items-center justify-end w-full">
            <input
              type="text"
              placeholder="Search NFTs . . . ."
              className="w-full max-w-[220px] rounded-md border border-zinc-500/20 dark:bg-[#212121] px-3 py-1.5 placeholder:text-zinc-500 focus:border-zinc-500/50 outline-0 text-sm shadow"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      )}
      {nftData.length > 0 || nftLoading ? (
        isList ? (
          <NftTable nfts={filterNfts() || []} />
        ) : (
          <NftGrid nfts={filterNfts() || []} />
        )
      ) : (
        <NoData
          title="NFTs not found !"
          description="We not found any NFTs in your wallet ."
        />
      )}
      {nftSecondaryLoading && (
        <div className="flex justify-center h-10 items-center">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      )}
      {nftFetchMore && !nftSecondaryLoading && !nftLoading && (
        <div className="flex w-full justify-center h-20 items-center">
          <Button
            variant="loadMore"
            className="w-[max-content]"
            onClick={() => loadMoreNfts()}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};

export default Nfts;
