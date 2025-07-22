import React from 'react';
import { useTrim } from '@/hooks';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const TokenCard = ({ token, filter }) => {
  const trim = useTrim();

  return (
    <div className="flex flex-col gap-8 p-4 rounded-md text-sm w-full h-full shadow-md font-medium border border-zinc-500/20 dark:bg-[#1c1c1c] overflow-hidden">
      <div className="flex gap-8 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-md shrink-0 border border-zinc-500/20 dark:bg-[#212121] shadow">
            <Avatar className="w-6 h-6">
              <AvatarImage src={token?.logo || token?.thumbnail} alt="Token" />
              <AvatarFallback>
                {token?.symbol.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col items-start ">
            <span
              className={`font-semibold ${
                filter === 'alphabetical' ? 'text-green-500' : ''
              }`}
            >
              {token?.symbol}
            </span>
            <span className="text-xs text-zinc-500 line-clamp-1 break-all">
              {token?.name}
            </span>
          </div>
        </div>
        <div
          className={`px-3 py-2 rounded-full w-[max-content] text-xs shadow font-semibold border border-zinc-500/20 dark:bg-[#212121] ${
            filter?.startsWith('token-price') ? 'text-green-500' : ''
          }`}
        >
          <span>
            {token?.usd_price == 0 ? 'N/A' : `$${trim(token?.usd_price)}`}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-3 items-start">
        <div
          className={`px-3 py-1.5 rounded-full text-[10px] shadow font-bold border border-zinc-500/20 dark:bg-[#212121] ${
            filter?.startsWith('portfolio') ? 'text-green-500' : ''
          }`}
        >
          <span>{trim(token.portfolio_percentage)}%</span>
        </div>
        <div className="flex justify-between items-center gap-x-4 w-full flex-wrap gap-y-1">
          <div
            className={`text-lg font-bold ${
              filter?.startsWith('balance-value') ? 'text-green-500' : ''
            }`}
          >
            ${trim(token.usd_value)}
          </div>
          <div className="flex items-center gap-1">
            <span>{trim(token.balance_formatted)}</span>
            <span className="text-xs mt-0.5 text-zinc-500">
              {token?.symbol}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenCard;
