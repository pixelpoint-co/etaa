import PropTypes from 'prop-types';

import Image from '../Image';

import taky from '../../../assets/image/taki.png';
import yogiyo from '../../../assets/image/yogiyo.png';
import yogiyoExpress from '../../../assets/image/yogiyo_express.png';
import baemin from '../../../assets/image/baemin.png';
import baemin1 from '../../../assets/image/baemin1.png';
import coupangEats from '../../../assets/image/coupang_eats.png';

const getPlatform = (platform) => {
  switch (platform) {
    case '타키':
      return taky;
    case '쿠팡이츠':
      return coupangEats;
    case '배민':
      return baemin;
    case '배민1':
      return baemin1;
    case '요기요':
      return yogiyo;
    case '요기요 익스프레스':
      return yogiyoExpress;
    default:
      return null;
  }
};

const PlatformImage = ({
  platform,
  ...others
}) => {
  const src = getPlatform(platform);
  return (
    <Image
      src={src}
      {...others}
    />
  );
};

PlatformImage.defaultProps = {
  platform: '',
  width: 45,
  height: 45,
};

PlatformImage.propTypes = {
  platform: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default PlatformImage;
