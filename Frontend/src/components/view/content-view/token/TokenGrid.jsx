import React from 'react';
import TokenCard from '../components/TokenCard';
import { useSelector } from 'react-redux';
import { Skeleton } from '@/components/ui/skeleton';

const TokenGrid = ({ tokens = [], filter }) => {
  const { tokenLoading } = useSelector((state) => state.token);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {tokenLoading
        ? Array.from({ length: 16 }).map((_, idx) => (
            <div
              key={idx}
              className="flex flex-col gap-8 p-4 rounded-md text-sm w-full h-full shadow-md font-medium border border-zinc-500/10 dark:bg-[#212121] smooth"
            >
              <div className="flex gap-8 items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-md shrink-0 border border-zinc-500/20 dark:bg-[#2c2c2c]">
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <Skeleton className="w-12 h-3" />
                    <Skeleton className="w-20 h-2" />
                  </div>
                </div>
                <Skeleton className="w-12 h-4 rounded-full" />
              </div>

              <div className="flex flex-col gap-3 items-start">
                <Skeleton className="w-8 h-2 rounded-full" />
                <div className="flex justify-between items-center gap-4 w-full">
                  <Skeleton className="w-16 h-4" />
                  <div className="flex items-center gap-1">
                    <Skeleton className="w-12 h-2" />
                    <Skeleton className="w-6 h-2" />
                  </div>
                </div>
              </div>
            </div>
          ))
        : tokens?.map((token) => (
            <TokenCard
              key={token.token_address}
              token={token}
              filter={filter}
            />
          ))}
    </div>
  );
};

export default TokenGrid;
