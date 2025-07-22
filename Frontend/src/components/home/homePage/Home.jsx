import { Button } from '@/components/ui/button';
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-white dark:bg-[#1a1a1a]">
      {/* You can replace this with your actual landing page component */}
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold text-zinc-800 dark:text-white">
          Welcome to Goldphin Wallet
        </h1>
        <Link to="/wallet">
          <Button>Get Started</Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
