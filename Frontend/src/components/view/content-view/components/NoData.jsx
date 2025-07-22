import React from 'react';

const NoData = ({
  title = 'No data found',
  description = 'the data you are looking for is not available',
}) => {
  return (
    <div className="flex flex-col mt-20 items-center">
      <img
        src="/svgs/undraw_no-data_ig65.svg"
        alt=""
        className="h-40 w-40  dark:opacity-50"
      />
      <span className="text-sm font-medium text-zinc-500 mt-2 italic">
        {title}
      </span>
      <span className="text-xs font-medium text-zinc-500 italic">
        {description}
      </span>
    </div>
  );
};

export default NoData;
