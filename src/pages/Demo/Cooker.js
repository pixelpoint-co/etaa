import styled from 'styled-components';

import Flex from '../../components/atoms/Flex';
import PotTab from '../../components/organisms/PotTab';
import useQueryParams from '../../hooks/useQueryParams';
import PotStation from '../../containers/PotStation';

const Wrapper = styled(Flex)`
  flex-direction: column;
  flex-grow: 0;
  flex-basis: 100%;
  overflow: auto;
  align-items: stretch;
  padding: 15px;
`;
const DemoCooker = (props) => {
  const {
    queryParams,
    setQueryParams,
  } = useQueryParams();
  const cookerId = Number(queryParams.selectedCookerId);

  return (
    <Wrapper>
      <PotTab
        themeProps={{
          palette: 'white',
          boxShadow: '0px 2px 4px rgba(50, 50, 93, 0.1)',
        }}
        offThemeProps={{
          palette: 'grayscale',
          tone: 6,
          type: 'text',
        }}
        options={[
          { value: 0 },
          { value: 1 },
          { value: 2 },
          { value: 3 },
        ]}
        value={cookerId}
        onSelect={setQueryParams}
      />
      <PotStation
        cookerId={cookerId}
      />
    </Wrapper>
  );
};

DemoCooker.propTypes = {};
DemoCooker.defaultProps = {};

export default DemoCooker;
