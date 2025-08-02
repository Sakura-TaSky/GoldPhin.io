import React from 'react';
import Headers from '../components/Headers';
import SwapHolder from '../components/SwapHolder';

const Swaps = () => {
  return (
    <div className="flex flex-col gap-3">
      <Headers
        title="Swap"
        description="Swap your tokens effortlessly, just like sending a message."
      />
      <SwapHolder />
    </div>
  );
};

export default Swaps;
