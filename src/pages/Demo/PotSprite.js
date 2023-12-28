import spriceSource from '../../assets/image/sprite-angle.png';

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
    width: 1080,
    height: 1920,
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
