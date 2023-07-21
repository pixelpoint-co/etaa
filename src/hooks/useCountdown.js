import {
  useRef,
  useCallback,
  useEffect,
  useState,
} from 'react';

const useCountdown = (miliseconds, onComplete = () => {}, onCount = () => {}) => {
  const [
    count,
    setCount,
  ] = useState(Math.ceil(miliseconds / 1000));
  const requestRef = useRef();
  const startTimeRef = useRef();
  const countRef = useRef();
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
      const shouldUpdate = timeLeft !== countRef.current;
      if (shouldUpdate) {
        onCount(timeLeft);
        setCount(timeLeft);
        countRef.current = timeLeft;
        if (timeLeft === 0) {
          onComplete();
        }
      }

      if (elapsed <= miliseconds) {
        requestRef.current = requestAnimationFrame(animate);
      }
    },
    [
      miliseconds,
      onComplete,
      onCount,
    ],
  );
  const resetTimer = useCallback(
    () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      requestRef.current = null;
      startTimeRef.current = null;
      countRef.current = Math.ceil(miliseconds / 1000);
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
      countRef.current = Math.ceil(miliseconds / 1000);
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
