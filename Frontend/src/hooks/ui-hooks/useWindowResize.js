import { useEffect, useState } from 'react';

const useWindowResize = ({ func, breakpoint = 768 }) => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);

      if (func) {
        if (window.innerWidth > breakpoint) {
          func(true);
        } else {
          func(false);
        }
      }
    };

    handleResize(); // call once on mount

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [func, breakpoint]);

  return { width };
};

export default useWindowResize;
