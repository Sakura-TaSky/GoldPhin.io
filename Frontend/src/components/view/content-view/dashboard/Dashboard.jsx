import React from 'react';
import Headers from '../components/Headers';

const Dashboard = () => {
  return (
    <div className="flex flex-col">
      <Headers
        title="Dashboard"
        description="Overview of your assets, portfolio, and recent blockchain activity."
      />
    </div>
  );
};

export default Dashboard;
