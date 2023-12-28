import spriceSource from '../../assets/image/sprite-angle.jpg';

import { useSprite } from '../../hooks/useSprite';

const PotSprite = (props) => {
  const {
    shouldLoop,
    shouldAnimate,
    ...others
  } = props;
  const styles = useSprite({
    sprite: spriceSource,
    shouldAnimate,
    width: 540,
    height: 960,
    fps: 12,
    stopLastFrame: !shouldLoop,
  });
  return (
    <div style={styles} />
  );
};

PotSprite.propTypes = {};

PotSprite.defaultProps = {};

export default PotSprite;
