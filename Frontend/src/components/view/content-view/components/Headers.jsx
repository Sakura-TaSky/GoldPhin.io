import React from 'react';

const Headers = ({ title, description }) => {
  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-sm text-zinc-500">{description}</p>
    </div>
  );
};

export default Headers;
