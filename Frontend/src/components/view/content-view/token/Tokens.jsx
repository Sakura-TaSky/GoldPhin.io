import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import TokenTable from './TokenTable';
import Headers from '../components/Headers';
import useUiState from '@/context/UiStateContext';
import TokenGrid from './TokenGrid';
import { Button } from '@/components/ui/button';
import { HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IoCloseCircleOutline } from 'react-icons/io5';
import NoData from '../components/NoData';
import { useLoadMoreApiCrypto } from '@/hooks';
import { Loader2 } from 'lucide-react';

const Tokens = () => {
  const { tokens, tokenLoading, tokenFetchMore, tokenSecondaryLoading } =
    useSelector((state) => state.token);
  const { isList } = useUiState();
  const { loadMoreTokens } = useLoadMoreApiCrypto();
  const [filter, setFilter] = useState(null);

  const [search, setSearch] = useState('');

  const filterTokens = () => {
    if (!tokens?.length) return [];
    let sortedTokens = [...tokens];
    switch (filter) {
      case 'alphabetical':
        sortedTokens.sort((a, b) => a.symbol.localeCompare(b.symbol));
        break;
      case 'token-price-high-low':
        sortedTokens.sort((a, b) => b.usd_price - a.usd_price);
        break;
      case 'token-price-low-high':
        sortedTokens.sort((a, b) => a.usd_price - b.usd_price);
        break;
      case 'balance-value-high-low':
        sortedTokens.sort((a, b) => b.usd_value - a.usd_value);
        break;
      case 'balance-value-low-high':
        sortedTokens.sort((a, b) => a.usd_value - b.usd_value);
        break;
      case 'portfolio-high-low':
        sortedTokens.sort(
          (a, b) => b.portfolio_percentage - a.portfolio_percentage
        );
        break;
      case 'portfolio-low-high':
        sortedTokens.sort(
          (a, b) => a.portfolio_percentage - b.portfolio_percentage
        );
        break;
      default:
        break;
    }
    if (search.trim() !== '') {
      sortedTokens = sortedTokens.filter((token) => {
        const term = search.toLowerCase();
        return (
          token?.symbol?.toLowerCase().includes(term) ||
          token?.name?.toLowerCase().includes(term)
        );
      });
    }
    return sortedTokens;
  };

  return (
    <div className="flex flex-col gap-3">
      <Headers
        title="Tokens"
        description="A detailed overview of your wallet's token holdings."
      />
      {tokens.length > 0 || tokenLoading ? (
        <>
          <div className="flex w-full justify-between flex-wrap gap-2">
            <div className=" flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`${
                      filter ? 'border-zinc-500/20 shadow' : 'border-zinc-500/0'
                    } w-[max-content] border `}
                  >
                    <HiOutlineAdjustmentsHorizontal />
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-2 pb-3 pr-3  flex flex-col gap-1 w-[220px] ml-4">
                  <DropdownMenuItem
                    onClick={() => setFilter(null)}
                    className="bg-zinc-500/5 p-0.5"
                  >
                    <Button
                      variant="ghost"
                      className={`text-xs w-full ${
                        !filter &&
                        'bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800'
                      }`}
                    >
                      Default
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuLabel>
                    <span className="text-xs text-gray-500">
                      Alphabetical (ab...)
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuGroup className="flex flex-col gap-1 ml-4">
                    <DropdownMenuItem
                      onClick={() => setFilter('alphabetical')}
                      className=" bg-zinc-500/5 p-0.5"
                    >
                      <Button
                        variant="ghost"
                        className={`text-xs w-full ${
                          filter === 'alphabetical' &&
                          'bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800'
                        }`}
                      >
                        A - Z
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuLabel>
                    <span className="text-xs  text-gray-500">
                      Token-Price ($)
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuGroup className="flex flex-col gap-1 ml-4">
                    <DropdownMenuItem
                      onClick={() => setFilter('token-price-high-low')}
                      className=" bg-zinc-500/5 p-0.5"
                    >
                      <Button
                        variant="ghost"
                        className={`text-xs w-full ${
                          filter === 'token-price-high-low' &&
                          'bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800'
                        }`}
                      >
                        High - Low
                      </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilter('token-price-low-high')}
                      className=" bg-zinc-500/5 p-0.5"
                    >
                      <Button
                        variant="ghost"
                        className={`text-xs w-full ${
                          filter === 'token-price-low-high' &&
                          'bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800'
                        }`}
                      >
                        Low - High
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuLabel>
                    <span className="text-xs text-gray-500">
                      Balance-Value ($)
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuGroup className="flex flex-col gap-1 ml-4">
                    <DropdownMenuItem
                      onClick={() => setFilter('balance-value-high-low')}
                      className=" bg-zinc-500/5 p-0.5"
                    >
                      <Button
                        variant="ghost"
                        className={`text-xs w-full ${
                          filter === 'balance-value-high-low' &&
                          'bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800'
                        }`}
                      >
                        High - Low
                      </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilter('balance-value-low-high')}
                      className=" bg-zinc-500/5 p-0.5"
                    >
                      <Button
                        variant="ghost"
                        className={`text-xs w-full ${
                          filter === 'balance-value-low-high' &&
                          'bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800'
                        }`}
                      >
                        Low - High
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuLabel>
                    <span className="text-xs text-gray-500">Portfolio (%)</span>
                  </DropdownMenuLabel>
                  <DropdownMenuGroup className="flex flex-col gap-1 ml-4">
                    <DropdownMenuItem
                      onClick={() => setFilter('portfolio-high-low')}
                      className=" bg-zinc-500/5 p-0.5"
                    >
                      <Button
                        variant="ghost"
                        className={`text-xs w-full ${
                          filter === 'portfolio-high-low' &&
                          'bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800'
                        }`}
                      >
                        High - Low
                      </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilter('portfolio-low-high')}
                      className=" bg-zinc-500/5 p-0.5"
                    >
                      <Button
                        variant="ghost"
                        className={`text-xs w-full ${
                          filter === 'portfolio-low-high' &&
                          'bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800'
                        }`}
                      >
                        Low - High
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              {filter && (
                <Button
                  onClick={() => setFilter(null)}
                  variant="ghost"
                  className="w-[max-content] "
                >
                  <IoCloseCircleOutline />
                  Clear Filter
                </Button>
              )}
            </div>
            <input
              type="text"
              placeholder="Search tokens . . . ."
              className="w-full max-w-[220px] rounded-md border border-zinc-500/20 dark:bg-[#212121] px-3 py-1.5 placeholder:text-zinc-500 focus:border-zinc-500/50 outline-0 text-sm shadow"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {isList ? (
            <TokenTable tokens={filterTokens() || []} filter={filter} />
          ) : (
            <TokenGrid tokens={filterTokens() || []} filter={filter} />
          )}
        </>
      ) : (
        <NoData
          title="Tokens not found !"
          description="We not found any tokens in your wallet ."
        />
      )}
      {tokenSecondaryLoading && (
        <div className="flex justify-center h-10 items-center">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      )}
      {tokenFetchMore && !tokenSecondaryLoading && !tokenLoading && (
        <div className="flex w-full justify-center h-20 items-center">
          <Button
            variant="loadMore"
            className="w-[max-content]"
            onClick={() => loadMoreTokens()}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};

export default Tokens;
