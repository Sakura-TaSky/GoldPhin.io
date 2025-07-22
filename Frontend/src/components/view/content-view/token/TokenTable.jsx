import React from 'react';
import { useTrim } from '@/hooks';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const skeletonRows = Array.from({ length: 12 });

const TokenTable = ({ tokens = [], filter }) => {
  const trim = useTrim();
  const { tokenLoading } = useSelector((state) => state.token);

  return (
    <div className="rounded border border-zinc-500/15 overflow-x-auto smooth shadow">
      <Table>
        <TableHeader>
          <TableRow className="bg-zinc-500/10 smooth">
            <TableHead className="text-zinc-500  w-[40px] text-center">
              #
            </TableHead>
            <TableHead className="text-zinc-500  ">Token</TableHead>
            <TableHead className="text-zinc-500  text-right">
              USD Price
            </TableHead>
            <TableHead className="text-zinc-500  text-right">Balance</TableHead>
            <TableHead className="text-zinc-500 text-right">
              USD Value
            </TableHead>
            <TableHead className="text-zinc-500  text-right">
              Portfolio %
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tokenLoading
            ? skeletonRows.map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell className="text-center">
                    <Skeleton className="w-4 h-4 mx-auto" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-6 h-6 rounded-full" />
                      <div className="flex flex-col gap-1">
                        <Skeleton className="w-12 h-4" />
                        <Skeleton className="w-24 h-3" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="w-16 h-4 ml-auto" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="w-16 h-4 ml-auto" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="w-16 h-4 ml-auto" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="w-12 h-4 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            : tokens.map((token, idx) => (
                <TableRow
                  key={token?.token_address || idx}
                  className="hover:bg-muted/50 even:bg-muted/10 transition-colors border-zinc-500/15"
                >
                  <TableCell className="font-semibold text-muted-foreground text-center">
                    {idx + 1}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3 truncate">
                      <Avatar className="w-6 h-6">
                        <AvatarImage
                          src={token?.logo || token?.thumbnail}
                          alt="Token"
                        />
                        <AvatarFallback>
                          {token?.symbol.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col ">
                        <span
                          className={`font-medium truncate ${
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
                  </TableCell>

                  <TableCell
                    className={`text-right text-zinc-500 ${
                      filter?.startsWith('token-price') ? 'text-green-500' : ''
                    }`}
                  >
                    {token?.usd_price == 0
                      ? 'N/A'
                      : `$${trim(token?.usd_price)}`}
                  </TableCell>

                  <TableCell className="text-right ">
                    {trim(token?.balance_formatted)}
                  </TableCell>

                  <TableCell
                    className={`text-right ${
                      filter?.startsWith('balance-value')
                        ? 'text-green-500'
                        : ''
                    }`}
                  >
                    ${trim(token?.usd_value)}
                  </TableCell>

                  <TableCell
                    className={`text-right text-sm ${
                      filter?.startsWith('portfolio') ? 'text-green-500' : ''
                    }`}
                  >
                    {trim(token?.portfolio_percentage)}%
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TokenTable;
