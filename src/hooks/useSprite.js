import _ from 'lodash';
import {
  useState, useEffect, useCallback, useRef,
} from 'react';

const noop = () => {};
export const loadImage = (url, callback = noop) => {
  const img = new Image();
  img.onload = () => {
    callback(
      null,
      img,
    );
  };
  img.onerror = (err) => {
    callback(err);
  };
  img.src = url;
};

export const useSprite = ({
  startFrame = 0,
  endFrame = 0,
  sprite,
  width,
  height,
  fps = 60,
  shouldLoop = false,
  scale = 1,
}) => {
  const [
    currentFrame,
    setCurrentFrame,
  ] = useState(startFrame);
  const [
    spriteWidth,
    setSpriteWidth,
  ] = useState(0);
  const [
    spriteHeight,
    setSpriteHeight,
  ] = useState(0);
  const [
    isLoaded,
    setIsLoaded,
  ] = useState(false);
  const [
    maxFrames,
    setMaxFrames,
  ] = useState(0);
  const interval = 1000 / fps;

  const requestRef = useRef();
  const startTimeRef = useRef();
  const frameRef = useRef();
  const spriteRef = useRef();
  const loadSprite = useCallback(
    (url) => {
      if (spriteRef.current) return;
      spriteRef.current = true;
      setIsLoaded(false);

      loadImage(
        url,
        (err, image) => {
          setMaxFrames(
            Math.floor(
              image.width / width,
            ),
          );
          setSpriteWidth(image.width);
          setSpriteHeight(image.height);
          spriteRef.current = false;
          setIsLoaded(true);
        },
      );
    },
    [width],
  );

  const getSpritePosition = useCallback(
    (frame = 0) => {
      const row = 0;
      const col = frame;

      const _width = (-width * col);
      const _height = (-height * row);
      return `${_width}px ${_height}px`;
    },
    [
      width,
      height,
    ],
  );

  useEffect(
    () => {
      return loadSprite(sprite);
    },
    [
      sprite,
      loadSprite,
    ],
  );

  const finalFrame = _.isNumber(endFrame) ? endFrame : (maxFrames || 0);
  const backwards = finalFrame < startFrame;
  const animate = useCallback(
    (time) => {
      if (!startTimeRef.current) {
        startTimeRef.current = time;
      }
      const elapsed = time - startTimeRef.current;
      if (elapsed < interval) {
        requestRef.current = requestAnimationFrame(animate);
        return;
      }

      startTimeRef.current += interval;

      const nextFrame = backwards
        ? Math.max(
          finalFrame,
          Math.min(
            currentFrame - 1,
            startFrame,
          ),
        )
        : Math.min(
          finalFrame,
          Math.max(
            currentFrame + 1,
            startFrame,
          ),
        );
      console.log({
        startFrame,
        currentFrame,
        nextFrame,
        finalFrame,
      });
      if (shouldLoop && currentFrame === finalFrame) {
        frameRef.current = startFrame;
        setCurrentFrame(startFrame);
      } else {
        frameRef.current = nextFrame;
        setCurrentFrame(nextFrame);
      }
    },
    [
      startFrame,
      shouldLoop,
      currentFrame,
      finalFrame,
      backwards,
      interval,
    ],
  );
  useEffect(
    () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      startTimeRef.current = null;
      requestRef.current = requestAnimationFrame(animate);

      return () => {
        cancelAnimationFrame(requestRef.current);
        startTimeRef.current = null;
      };
    },
    [
      startFrame,
      endFrame,
      animate,
    ],
  );
  useEffect(
    () => {
      frameRef.current = startFrame;
      setCurrentFrame(startFrame);
    },
    [startFrame],
  );
  return {
    backgroundImage: isLoaded ? `url(${sprite})` : null,
    backgroundPosition: isLoaded ? getSpritePosition(currentFrame) : null,
    backgroundSize: `${spriteWidth / scale}px ${spriteHeight / scale}px`,
    width: `${width / scale}px`,
    height: `${height / scale}px`,
  };
};
