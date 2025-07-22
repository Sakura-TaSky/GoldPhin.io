import React, { useMemo, useState } from 'react';
import Headers from '../components/Headers';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { RiFilter2Fill } from 'react-icons/ri';
import { useSelector } from 'react-redux';
import Txtable from './Txtable';
import NoData from '../components/NoData';
import { getTxFilterData, useLoadMoreApiCrypto } from '@/hooks';
import { MdCallMade } from 'react-icons/md';
import { MdCallReceived } from 'react-icons/md';
import { MdSwapHoriz } from 'react-icons/md';
import { IoMdDoneAll } from 'react-icons/io';
import { PiQuestionMarkBold } from 'react-icons/pi';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { Loader2 } from 'lucide-react';

const Transactions = () => {
  const {
    transactions,
    transactionLoading,
    transactionFetchMore,
    transactionSecondaryLoading,
  } = useSelector((state) => state.transaction);
  const { loadMoreTransactions } = useLoadMoreApiCrypto();
  const { walletAddress } = useSelector((state) => state.wallet);

  const [filter, setFilter] = useState(null);

  const [search, setSearch] = useState('');

  const txData = getTxFilterData(transactions, walletAddress);

  const filteredTxData = useMemo(() => {
    let data = txData;
    if (filter) {
      switch (filter) {
        case 'send':
          data = data.filter(
            (tx) => tx._category === 'send' || tx._category === 'token send'
          );
          break;
        case 'receive':
          data = data.filter(
            (tx) =>
              tx._category === 'receive' || tx._category === 'token receive'
          );
          break;
        case 'token-swap':
          data = data.filter((tx) => tx._category === 'token swap');
          break;
        case 'approve':
          data = data.filter((tx) => tx._category === 'approve');
          break;
        case 'revoke':
          data = data.filter((tx) => tx._category === 'revoke');
          break;
        case '1week': {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          data = data.filter((tx) => new Date(tx._time) >= oneWeekAgo);
          break;
        }
        case '1month': {
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
          data = data.filter((tx) => new Date(tx._time) >= oneMonthAgo);
          break;
        }
        case '3month': {
          const threeMonthsAgo = new Date();
          threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
          data = data.filter((tx) => new Date(tx._time) >= threeMonthsAgo);
          break;
        }
        case '1year': {
          const oneYearAgo = new Date();
          oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
          data = data.filter((tx) => new Date(tx._time) >= oneYearAgo);
          break;
        }
        default:
          break;
      }
    }
    if (search.trim()) {
      const term = search.trim().toLowerCase();
      data = data.filter((tx) =>
        tx._tokens?.some(
          (t) =>
            t.token_symbol?.toLowerCase().includes(term) ||
            t.token_name?.toLowerCase().includes(term)
        )
      );
    }
    return data;
  }, [txData, search, filter]);

  return (
    <div className="flex flex-col gap-3">
      <Headers
        title="Transactions"
        description="Your wallet's transactions history."
      />
      {transactions.length > 0 || transactionLoading ? (
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
                    <RiFilter2Fill />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-2 pb-3 pr-3 w-[220px] flex flex-col gap-1 ml-4">
                  <DropdownMenuLabel>
                    <span className="text-xs text-zinc-500">Category</span>
                  </DropdownMenuLabel>
                  <DropdownMenuGroup className="flex flex-col gap-1 ml-4">
                    <DropdownMenuItem
                      onClick={() => setFilter('send')}
                      className={`bg-zinc-500/5 p-0.5 ${
                        filter === 'send' &&
                        'bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800'
                      }`}
                    >
                      <Button variant="ghost" className="text-xs">
                        <MdCallMade />
                        Send
                      </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilter('receive')}
                      className={`bg-zinc-500/5 p-0.5 ${
                        filter === 'receive' &&
                        'bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800'
                      }`}
                    >
                      <Button variant="ghost" className="text-xs">
                        <MdCallReceived />
                        Receive
                      </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilter('token-swap')}
                      className={`bg-zinc-500/5 p-0.5 ${
                        filter === 'token-swap' &&
                        'bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800'
                      }`}
                    >
                      <Button variant="ghost" className="text-xs">
                        <MdSwapHoriz />
                        Token Swap
                      </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilter('approve')}
                      className={`bg-zinc-500/5 p-0.5 ${
                        filter === 'approve' &&
                        'bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800'
                      }`}
                    >
                      <Button variant="ghost" className="text-xs">
                        <IoMdDoneAll />
                        Approve
                      </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilter('revoke')}
                      className={`bg-zinc-500/5 p-0.5 ${
                        filter === 'revoke' &&
                        'bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800'
                      }`}
                    >
                      <Button variant="ghost" className="text-xs">
                        <PiQuestionMarkBold />
                        Revoke
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuLabel>
                    <span className="text-xs text-zinc-500">Time</span>
                  </DropdownMenuLabel>
                  <DropdownMenuGroup className="flex flex-col gap-1 ml-4">
                    <DropdownMenuItem
                      onClick={() => setFilter('1week')}
                      className={`bg-zinc-500/5 p-0.5 ${
                        filter === '1week' &&
                        'bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800'
                      }`}
                    >
                      <Button variant="ghost" className="text-xs">
                        1 week
                      </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilter('1month')}
                      className={`bg-zinc-500/5 p-0.5 ${
                        filter === '1month' &&
                        'bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800'
                      }`}
                    >
                      <Button variant="ghost" className="text-xs">
                        1 month
                      </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilter('3month')}
                      className={`bg-zinc-500/5 p-0.5 ${
                        filter === '3month' &&
                        'bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800'
                      }`}
                    >
                      <Button variant="ghost" className="text-xs">
                        3 month
                      </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilter('1year')}
                      className={`bg-zinc-500/5 p-0.5 ${
                        filter === '1year' &&
                        'bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800'
                      }`}
                    >
                      <Button variant="ghost" className="text-xs">
                        1 year
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Transactions by token . . . ."
              className="w-full max-w-[220px] rounded-md border border-zinc-500/20 dark:bg-[#212121] px-3 py-1.5 placeholder:text-zinc-500 focus:border-zinc-500/50 outline-0 text-sm shadow"
            />
          </div>
          <Txtable transactions={filteredTxData} />
        </>
      ) : (
        <NoData
          title="No Transactions history found !"
          description="We not found any transactions history in your wallet ."
        />
      )}
      {transactionSecondaryLoading && (
        <div className="flex justify-center h-10 items-center">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      )}
      {transactionFetchMore &&
        !transactionSecondaryLoading &&
        !transactionLoading && (
          <div className="flex w-full justify-center h-20 items-center">
            <Button
              variant="loadMore"
              className="w-[max-content]"
              onClick={() => loadMoreTransactions()}
            >
              Load More
            </Button>
          </div>
        )}
    </div>
  );
};

export default Transactions;
