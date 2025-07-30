import { useEffect } from 'react';

export default function useClickOutSide(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      const target = event.target;

      // If click is inside the ref, do nothing
      if (!ref.current || ref.current.contains(target)) return;

      // If click is inside any radix popper (Select, Dropdown etc.), ignore
      const isInsideRadixPopper = target.closest(
        '[data-radix-popper-content-wrapper]'
      );
      if (isInsideRadixPopper) return;

      // Otherwise trigger outside click handler
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
