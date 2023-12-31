import {
  useCallback, useEffect, useState,
} from 'react';
import spriceSource from '../../assets/image/tilt-sprite.jpg';
import usePotController from '../../hooks/usePotController';

import { useSprite } from '../../hooks/useSprite';

const PotSprite = (props) => {
  const {
    cookerId,
    shouldLoop,
    shouldAnimate,
    activeStatusById,
    completedJobsById,
    ...others
  } = props;
  const {
    machineState,
    isWashing,
    isCooking,
  } = usePotController(cookerId);
  const { tilt } = machineState;
  const [
    resetUUID,
    setResetUUID,
  ] = useState(1);
  useEffect(
    () => {
    },
    [
      tilt,
      isWashing,
      isCooking,
    ],
  );
  const restart = useCallback(
    () => {
      setResetUUID(resetUUID + 1);
    },
    [resetUUID],
  );

  console.log({
    activeStatusById,
    completedJobsById,
    machineState,
    backwards: resetUUID % 2 === 0,
  });
  const styles = useSprite({
    sprite: spriceSource,
    shouldAnimate,
    width: 540,
    height: 960,
    display: 'flex',
    fps: 12,
    startFrame: 0,
    // stopLastFrame: !shouldLoop,
    reset: resetUUID,
    backwards: (resetUUID % 2) === 0,
  });
  return (
    <div style={styles} onClick={restart} />
  );
};

PotSprite.propTypes = {};

PotSprite.defaultProps = {};

export default PotSprite;
