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

const NftTable = ({ nfts = [] }) => {
  const trim = useTrim();
  const { nftLoading } = useSelector((state) => state.nft);

  const skeletonRows = Array.from({ length: 12 });

  return (
    <div className="rounded border border-zinc-500/15 overflow-x-auto smooth shadow">
      <Table>
        <TableHeader className="smooth capitalize">
          <TableRow className="bg-zinc-500/10 smooth">
            <TableHead className="text-zinc-500 ">NFT</TableHead>
            <TableHead className="text-zinc-500 text-right">
              floorPrice($)
            </TableHead>
            <TableHead className="text-zinc-500 text-right">
              floorPrice
            </TableHead>
            <TableHead className="text-zinc-500 text-right">category</TableHead>
            <TableHead className="text-zinc-500 text-right">total</TableHead>
            <TableHead className="text-zinc-500 text-right">
              collection
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {nftLoading
            ? skeletonRows.map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="p-3">
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-10 h-10 rounded-md" />
                      <div>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="p-3 text-right">
                    <Skeleton className="h-4 w-12 ml-auto" />
                  </TableCell>
                  <TableCell className="p-3 text-right">
                    <Skeleton className="h-4 w-16 ml-auto" />
                  </TableCell>
                  <TableCell className="p-3 text-right">
                    <Skeleton className="h-4 w-20 ml-auto" />
                  </TableCell>
                  <TableCell className="p-3 text-right">
                    <Skeleton className="h-4 w-20 ml-auto" />
                  </TableCell>
                  <TableCell className="p-3 flex items-center justify-end">
                    <Skeleton className="w-8 h-8 rounded-full" />
                  </TableCell>
                </TableRow>
              ))
            : nfts.map((nft, index) => (
                <TableRow key={index}>
                  <TableCell className="p-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-10 h-10 rounded-md">
                        <AvatarImage src={nft._image} />
                        <AvatarFallback>
                          {nft._mainName?.charAt(0).toUpperCase() ||
                            nft._name?.charAt(0).toUpperCase() ||
                            '@'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{nft._mainName}</p>
                        <p className="text-xs text-zinc-500">{nft._name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="p-3 text-right">
                    {nft._floorPriceUsd ? `${trim(nft._floorPriceUsd)}$` : '-'}
                  </TableCell>
                  <TableCell className="p-3 text-right">
                    {nft._floorPrice ? (
                      <span className="flex items-end gap-1 justify-end">
                        {trim(nft._floorPrice)}
                        <span className="text-[10px] font-semibold text-zinc-500 mb-0.5">
                          {nft._floorPriceCurrency?.toUpperCase()}
                        </span>
                      </span>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell className="p-3 text-right">
                    {nft._category || '-'}
                  </TableCell>
                  <TableCell className="p-3 text-right">
                    {nft._total || '-'}
                  </TableCell>
                  <TableCell className="p-3 flex items-center justify-end">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={nft._collectionImage} />
                      <AvatarFallback>?</AvatarFallback>
                    </Avatar>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default NftTable;
