import React from 'react';
import Headers from '../components/Headers';

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-3">
      <Headers
        title="Dashboard"
        description="Track your tokens, NFTs, and activity with a seamless crypto dashboard."
      />
    </div>
  );
};

export default Dashboard;
