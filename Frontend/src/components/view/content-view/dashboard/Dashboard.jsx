import React from 'react';
import Headers from '../components/Headers';
import { useSelector } from 'react-redux';
import { useTrim, getDominantColor, getTxFilterData } from '@/hooks';
import TokenAllocation from './TokenAllocation';
import { LuHistory } from 'react-icons/lu';
import Txtable from '../transaction/Txtable';
import { Link, useNavigate } from 'react-router-dom';
import { SlArrowDown } from 'react-icons/sl';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const navigate = useNavigate();

  const trim = useTrim();

  const { walletBalance, walletNativeBalance, walletAddress } = useSelector(
    (state) => state.wallet
  );

  const { tokens, tokenLoading } = useSelector((state) => state.token);

  const { transactions, transactionLoading } = useSelector(
    (state) => state.transaction
  );

  const txData = getTxFilterData(transactions).slice(0, 8);

  const topTokens = tokens
    .filter((t) => t.portfolio_percentage >= 2)
    .map((token) => ({
      ...token,
      color: getDominantColor(),
    }));

  const otherTokens = tokens.filter((t) => t.portfolio_percentage < 2);

  const otherToken = {
    name: 'Others',
    portfolio_percentage: otherTokens.reduce(
      (acc, token) => acc + (parseFloat(token.portfolio_percentage) || 0),
      0
    ),
    usd_value: otherTokens.reduce(
      (acc, token) => acc + (parseFloat(token.usd_value) || 0),
      0
    ),
    color: '#727272',
  };

  const tokenData = [
    ...topTokens,
    ...(otherToken.portfolio_percentage > 0 ? [otherToken] : []),
  ];

  const TokenCard = ({ token }) => {
    return (
      <div
        onClick={() => {
          if (token.name === 'Others') {
            navigate(`/wallet/tokens/${walletAddress}`);
          }
        }}
        className={`w-full p-2  flex items-start border-2 border-zinc-500/20 rounded-lg gap-5 overflow-hidden ${
          token.name === 'Others' ? 'cursor-pointer' : ''
        }`}
      >
        <div
          style={{ backgroundColor: token.color }}
          className="h-[45%] mt-1 w-[2.5px] rounded-full shrink-0"
        ></div>
        <div className="flex flex-col gap-1 text-sm w-full">
          <span className="text-zinc-600 dark:text-zinc-400">
            {token?.symbol || token?.name}
          </span>
          <span className="text-zinc-500 text-xs flex items-center gap-1 justify-between w-full flex-wrap">
            <span>
              {token.portfolio_percentage
                ? trim(token.portfolio_percentage)
                : '0.00'}
              %
            </span>
            <span>{token.usd_value ? trim(token.usd_value) : '0.00'} USD</span>
          </span>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        <Headers title="Dashboard" />
        <div className="m-4 flex flex-col gap-3">
          <div className="pl-5 border-l-2 border-zinc-500/40 text-xs text-zinc-500">
            Total Value
          </div>
          <div className="flex flex-col pl-5 border-l-2 border-zinc-500/15 gap-1">
            <div className="flex gap-2 text-2xl items-end">
              <span>{walletBalance ? trim(walletBalance) : '0.00'}</span>
              <span className="text-sm mb-[3.5px]">USD</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span>{walletNativeBalance ? walletNativeBalance : '0.00'}</span>
            </div>
          </div>
        </div>
        <div className="dark:bg-[#1f1f1f] bg-zinc-50 border-zinc-500/15 border rounded-md md:p-10 p-4 shadow-md flex flex-col gap-10">
          <TokenAllocation tokens={tokenData || []} />
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 w-full gap-3">
            {tokenLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-lg" />
                ))
              : tokenData?.map((token) => (
                  <TokenCard
                    key={token.symbol || token.token_address}
                    token={token}
                  />
                ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-6 overflow-auto h-full w-full">
          <span className="text-xs text-zinc-500 flex items-center gap-1.5">
            <LuHistory size={15} />
            Recent Transactions
          </span>
          <div>
            {transactionLoading ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-md" />
                ))}
              </div>
            ) : (
              <>
                <Txtable transactions={txData || []} hideDetails={true} />
                <div className="flex items-center justify-center">
                  <Link
                    to={`/wallet/transactions/${walletAddress}`}
                    className="p-1 flex flex-col items-center justify-center font-light opacity-50 hover:opacity-100"
                  >
                    <span>More</span>
                    <SlArrowDown />
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
