import {
  useRef,
  useCallback,
  useEffect,
  useState,
} from 'react';

const useCountdown = (seconds, onComplete = () => {}) => {
  const [
    count,
    setCount,
  ] = useState(seconds);

  const requestRef = useRef();
  const previousTimeRef = useRef();

  const animate = useCallback(
    (time) => {
      const remainingSeconds = Math.ceil(seconds - (time / 1000));
      if (remainingSeconds < 0) return;

      const shouldUpdate = remainingSeconds !== previousTimeRef.current;

      if (shouldUpdate) {
        // to make sure we always have the latest state
        setCount(remainingSeconds);
        if (remainingSeconds === 0) {
          onComplete();
        }
        previousTimeRef.current = remainingSeconds;
      }
      requestRef.current = requestAnimationFrame(animate);
    },
    [
      seconds,
      onComplete,
    ],
  );

  useEffect(
    () => {
      requestRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(requestRef.current);
    },
    [animate],
  ); // Make sure the effect runs only once

  return Math.max(
    count,
    0,
  );
};

export default useCountdown;
