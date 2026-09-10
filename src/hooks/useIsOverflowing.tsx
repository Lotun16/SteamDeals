import { MutableRefObject, useLayoutEffect, useState } from 'react';

export const useIsOverflowing = (ref: MutableRefObject<HTMLElement | undefined>) => {
  const [isOverflow, setIsOverflow] = useState(false);

  useLayoutEffect(() => {
    const { current } = ref;
    if (!current) return;

    const trigger = () => {
      setIsOverflow(current.scrollHeight > current.clientHeight);
    };

    trigger();
    const observer = new ResizeObserver(trigger);
    observer.observe(current);
    return () => observer.disconnect();
  }, [ref]);

  return isOverflow;
};
