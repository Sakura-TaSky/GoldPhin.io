import React from 'react';
import { useTrim, useSlice, useFormatDate } from '@/hooks';
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
import { FcOk, FcCancel } from 'react-icons/fc';

const Txtable = ({ transactions, hideDetails = false }) => {
  const trim = useTrim(6);
  const slice = useSlice();
  const formatDate = useFormatDate();
  const { transactionLoading } = useSelector((state) => state.transaction);

  return (
    <div className="rounded  overflow-x-auto smooth">
      <Table>
        <TableHeader>
          <TableRow className="bg-zinc-500/10 smooth">
            <TableHead className="text-zinc-500 text-xs font-medium">
              Hash/time
            </TableHead>
            <TableHead className="text-zinc-500 text-xs font-medium ">
              Platform
            </TableHead>
            <TableHead className="text-zinc-500 text-xs font-medium ">
              Activity
            </TableHead>
            {!hideDetails && (
              <>
                <TableHead className="text-zinc-500 text-xs font-medium ">
                  Gas Fee
                </TableHead>
                <TableHead className="text-zinc-500 text-xs font-medium ">
                  Status
                </TableHead>
              </>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactionLoading
            ? Array.from({ length: 10 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell className="p-4">
                    <div className="flex flex-col gap-1">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </TableCell>
                  <TableCell className="p-4">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-7 w-7 rounded-full" />
                      <div className="flex flex-col gap-1">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-2 w-12" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="p-4">
                    <div className="flex flex-col gap-1">
                      <Skeleton className="h-2 w-12" />
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <Skeleton className="h-3 w-12" />
                      </div>
                    </div>
                  </TableCell>
                  {!hideDetails && (
                    <>
                      <TableCell className="p-4">
                        <div className="flex flex-col gap-1">
                          <Skeleton className="h-2 w-8" />
                          <Skeleton className="h-3 w-12" />
                        </div>
                      </TableCell>
                      <TableCell className="p-4">
                        <Skeleton className="h-4 w-4 rounded-full" />
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))
            : transactions.map((tx) => (
                <TableRow key={tx._hash + tx._time}>
                  <TableCell className="p-3">
                    <a
                      href={`https://blockscan.com/tx/${tx._hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col text-xs text-zinc-500 group"
                    >
                      <span className="text-[10px]">
                        {formatDate(tx._time)}
                      </span>
                      <span className="group-hover:underline group-hover:text-blue-500">
                        {slice(tx._hash)}
                      </span>
                    </a>
                  </TableCell>
                  <TableCell className="w-[200px] line-clamp-1 break-all p-3">
                    <div className=" flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={tx._entryImage} />
                        <AvatarFallback>
                          {(tx._entryName || tx._entryLabel || '')
                            .slice(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {tx._entryName}
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          {tx._entryLabel}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="p-3 text-sm">
                    <div className="flex flex-col gap-2">
                      <span className="text-[9px] font-medium capitalize">
                        {tx._category}
                      </span>
                      <div className="flex flex-col gap-1">
                        {tx._tokens?.map((t, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1.5 tracking-tight"
                          >
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={t?.token_logo} />
                              <AvatarFallback>
                                {t?.token_symbol?.slice(0, 1).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span
                              className={`${
                                t?.direction == 'receive' &&
                                'text-[#00C18B] font-medium'
                              } text-xs`}
                            >
                              {t?.value_formatted &&
                                (t?.direction == 'receive' ? '+' : '-') +
                                  trim(t?.value_formatted)}{' '}
                              <span className="text-[10px] tracking-tight">
                                {t?.token_symbol}
                              </span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TableCell>
                  {!hideDetails && (
                    <>
                      <TableCell className="p-3">
                        {tx._fee && (
                          <div className="flex flex-col text-xs">
                            <span className="text-[10px]">gasFee</span>
                            <span>{trim(tx?._fee)} Eth</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="p-3">
                        <span>
                          {tx._status == 'Success' ? (
                            <FcOk size={16} />
                          ) : (
                            <FcCancel size={16} />
                          )}
                        </span>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Txtable;
