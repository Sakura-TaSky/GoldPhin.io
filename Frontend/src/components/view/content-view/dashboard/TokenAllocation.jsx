import React, { useState } from 'react';
import TokenAllocationBar from '../components/TokenAllocationBar';
import PieChart from '../components/PieChart';
import { BiSolidDoughnutChart } from 'react-icons/bi';
import { Button } from '@/components/ui/button';
import { TbLineDashed } from 'react-icons/tb';
import { RiDonutChartFill } from 'react-icons/ri';

const TokenAllocation = ({ tokens }) => {
  const [pieChart, setPieChart] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-zinc-500 flex items-center gap-1">
          <BiSolidDoughnutChart size={16} />
          Assets Allocation
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant={pieChart ? 'outline' : 'default'}
            size="zero"
            onClick={() => setPieChart(false)}
            className={`p-1 transition-colors ${
              !pieChart
                ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600'
                : 'text-zinc-500 border-zinc-300 hover:bg-zinc-100'
            }`}
            aria-pressed={!pieChart}
          >
            <TbLineDashed
              className={`transition-colors ${
                !pieChart ? 'text-white' : 'text-zinc-500'
              }`}
            />
          </Button>

          <Button
            variant={pieChart ? 'default' : 'outline'}
            size="zero"
            onClick={() => setPieChart(true)}
            className={`p-1 transition-colors ${
              pieChart
                ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600'
                : 'text-zinc-500 border-zinc-300 hover:bg-zinc-100'
            }`}
            aria-pressed={pieChart}
          >
            <RiDonutChartFill
              className={`transition-colors ${
                pieChart ? 'text-white' : 'text-zinc-500'
              }`}
            />
          </Button>
        </div>
      </div>
      <div className="w-full items-center justify-center flex flex-col">
        {pieChart ? (
          <PieChart tokens={tokens} />
        ) : (
          <TokenAllocationBar tokens={tokens} />
        )}
      </div>
    </>
  );
};

export default TokenAllocation;
