import PropTypes from 'prop-types';

import Image from '../Image';

import src0 from '../../../assets/image/degree-0.png';
import src45 from '../../../assets/image/degree-45.png';
import src135 from '../../../assets/image/degree-135.png';
import src180 from '../../../assets/image/degree-180.png';

const getSrc = (degree) => {
  switch (degree) {
    case 0:
      return src0;
    case 45:
      return src45;
    case 135:
      return src135;
    case 180:
      return src180;
    default:
      return src0;
  }
};

const DegreeImage = ({
  degree,
  ...others
}) => {
  const src = getSrc(degree);
  return (
    <Image
      src={src}
      {...others}
    />
  );
};

DegreeImage.defaultProps = {
  degree: 0,
  width: 15,
  height: 30,
};

DegreeImage.propTypes = {
  degree: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default DegreeImage;
