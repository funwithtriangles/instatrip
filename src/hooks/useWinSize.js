import { useState } from 'react';
import { useEventListener } from './useEventListener';

export const useWinSize = () => {
  const [winSize, setWinSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEventListener('resize', () => {
    setWinSize({ width: window.innerWidth, height: window.innerHeight });
  });

  return winSize;
};
