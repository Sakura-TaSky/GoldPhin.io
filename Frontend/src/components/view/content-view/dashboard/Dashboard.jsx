import React from 'react';
import Headers from '../components/Headers';

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-3">
      <Headers
        title="Dashboard"
        description="Track your tokens, NFTs, and activity with a seamless crypto dashboard."
      />
      <div className="w-full flex items-center justify-center mt-10 text-lg font-semibold">
        Dashboard Soon !
      </div>
    </div>
  );
};

export default Dashboard;
