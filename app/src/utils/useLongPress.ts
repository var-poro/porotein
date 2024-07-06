import { useRef } from 'react';

const useLongPress = (
  callback: () => void,
  initialDelay: number,
  intervalDelay: number
) => {
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    callback(); // Initial callback call
    timeoutIdRef.current = setTimeout(() => {
      intervalIdRef.current = setInterval(callback, intervalDelay);
    }, initialDelay);
  };

  const stop = () => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  };

  return { start, stop };
};

export default useLongPress;
