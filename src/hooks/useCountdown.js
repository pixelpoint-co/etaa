import {
  useRef,
  useCallback,
  useEffect,
  useState,
} from 'react';

const useCountdown = (miliseconds, onComplete = () => {}) => {
  const [
    count,
    setCount,
  ] = useState(Math.ceil(miliseconds / 1000));
  const requestRef = useRef();
  const startTimeRef = useRef();
  const animate = useCallback(
    (time) => {
      if (!startTimeRef.current) {
        startTimeRef.current = time;
      }

      const elapsed = time - startTimeRef.current;

      const timeLeft = Math.max(
        0,
        Math.ceil((miliseconds - elapsed) / 1000),
      );
      const shouldUpdate = timeLeft !== count;
      if (shouldUpdate) {
        setCount(timeLeft);
        if (timeLeft === 0 && typeof onComplete === 'function') {
          onComplete();
        }
      }

      if (elapsed <= miliseconds) {
        requestRef.current = requestAnimationFrame(animate);
      }
    },
    [
      count,
      miliseconds,
      onComplete,
    ],
  );
  const resetTimer = useCallback(
    () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      requestRef.current = null;
      startTimeRef.current = null;
      setCount(Math.ceil(miliseconds / 1000));
      requestRef.current = requestAnimationFrame(animate);
    },
    [
      animate,
      miliseconds,
    ],
  );

  useEffect(
    () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }

      startTimeRef.current = null;
      setCount(Math.ceil(miliseconds / 1000));

      requestRef.current = requestAnimationFrame(animate);

      return () => {
        cancelAnimationFrame(requestRef.current);
        startTimeRef.current = null;
      };
    },
    [miliseconds],
  ); // Make sure the effect runs only once

  return {
    countdown: count,
    resetTimer,
  };
};

export default useCountdown;
