import React from 'react';
import NftCard from '../components/NftCard';
import { useSelector } from 'react-redux';

const NftGrid = ({ nfts = [] }) => {
  const { nftLoading } = useSelector((state) => state.nft);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-2">
      {nftLoading
        ? Array.from({ length: 12 }).map((_, idx) => (
            <NftCard key={idx} loading />
          ))
        : nfts.map((nft, idx) => <NftCard key={nft.id || idx} nft={nft} />)}
    </div>
  );
};

export default NftGrid;
