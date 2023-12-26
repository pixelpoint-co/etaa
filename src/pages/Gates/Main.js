import {
  useParams,
} from 'react-router-dom';

import PotStation from '../../containers/PotStation';

const GatesMain = (props) => {
  const { id } = useParams();
  const cookerId = id - 1;
  return (
    <PotStation
      cookerId={cookerId}
    />
  );
};

GatesMain.propTypes = {};
GatesMain.defaultProps = {};

export default GatesMain;
