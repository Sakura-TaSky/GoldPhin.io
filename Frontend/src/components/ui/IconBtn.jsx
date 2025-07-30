import { cn } from '@/lib/utils';
import React from 'react';

const IconBtn = ({ icon = {}, text = '', isDanger, className = '' }) => {
  return (
    <button
      className={cn(
        'flex gap-2 items-center p-0.5 w-full cursor-pointer text-sm text-zinc-500 ',
        className
      )}
    >
      <i>{icon}</i>
      <span
        className={`${
          isDanger
            ? 'hover:text-red-500 group-hover:text-red-500 '
            : 'group-hover:text-zinc-800 dark:group-hover:text-zinc-200'
        }`}
      >
        {text}
      </span>
    </button>
  );
};

export default IconBtn;
