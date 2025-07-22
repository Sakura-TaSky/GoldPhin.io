import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTrim } from '@/hooks';

const NftCard = ({ nft, loading = false }) => {
  const trim = useTrim();

  return (
    <div className="w-full max-w-xs rounded-lg border border-zinc-300 dark:border-zinc-700 shadow p-2 bg-white dark:bg-zinc-900">
      <div className="w-full aspect-square mb-0">
        {loading ? (
          <Skeleton className="w-full h-full aspect-square rounded-md" />
        ) : (
          <Avatar className="w-full h-auto aspect-square rounded-md">
            <AvatarImage
              src={nft._image}
              alt={nft._name}
              className="object-cover w-full h-full aspect-square rounded-md"
            />
            <AvatarFallback className="w-full h-full aspect-square rounded-md text-3xl flex items-center justify-center">
              {nft._mainName?.charAt(0).toUpperCase() ||
                nft._name?.charAt(0).toUpperCase() ||
                '@'}
            </AvatarFallback>
          </Avatar>
        )}
      </div>

      <div className="mt-3">
        {loading ? (
          <>
            <Skeleton className="h-4 w-3/4 mb-1" />
            <Skeleton className="h-3 w-1/2 mb-2" />
          </>
        ) : (
          <>
            <div>
              <h3 className="text-sm font-semibold line-clamp-2">
                {nft?._mainName}
              </h3>
              <span className="text-xs text-zinc-500"> {nft?._name}</span>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-between items-center text-xs text-zinc-600 dark:text-zinc-400 mt-2">
        {loading ? (
          <>
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-12" />
          </>
        ) : (
          <>
            <div className="flex items-center gap-1">
              <span>{nft._floorPrice ? `${trim(nft._floorPrice)}` : '-'}</span>
              <span className="text-xs text-zinc-500">
                {nft._floorPriceCurrency?.toUpperCase()}
              </span>
            </div>
            <div className="text-xs text-zinc-500">
              <span>
                {nft._floorPriceUsd ? `${trim(nft._floorPriceUsd)}` : '-'}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NftCard;
