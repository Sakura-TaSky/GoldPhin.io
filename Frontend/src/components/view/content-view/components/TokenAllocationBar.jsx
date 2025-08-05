import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const TokenAllocationBar = ({ tokens }) => {
  return (
    <div className="w-full h-2 rounded-full flex items-stretch overflow-hidden">
      {tokens.map((token, index) => {
        const isLast = index === tokens.length - 1;
        return (
          <Tooltip key={token.symbol || token.name || index}>
            <TooltipTrigger asChild>
              <div
                className="h-full cursor-pointer rounded-sm transition-opacity hover:opacity-50 opacity-70 border border-zinc-500/30"
                style={{
                  backgroundColor: token.color,
                  width: `${token.portfolio_percentage}%`,
                  marginRight: isLast ? '0px' : '3px', // spacing between segments
                }}
              ></div>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs px-3 py-2">
              <span>
                {token.symbol || token.name}:{' '}
                {token.portfolio_percentage.toFixed(2)}%
              </span>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default TokenAllocationBar;
