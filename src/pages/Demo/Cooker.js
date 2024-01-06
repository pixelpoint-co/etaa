import styled from 'styled-components';

import {
  palette, size,
} from 'styled-theme';
import {
  useEffect, useState,
} from 'react';
import { useMediaQuery } from 'react-responsive';
import Flex from '../../components/atoms/Flex';
import useQueryParams from '../../hooks/useQueryParams';
import PotStation from '../../containers/PotStation';
import theme from '../../theme';
import PotSprite from './PotSprite';
import PotTimer from '../../containers/PotStation/PotTimer';
import Tab from '../../components/molecules/Tab';
import PotUnit from '../../components/organisms/PotUnit';

const Wrapper = styled(Flex)`
  flex-direction: column;
  flex-grow: 0;
  flex-basis: 100%;
  overflow: auto;
  align-items: stretch;
  padding: 15px;
  padding-top: 5px;
`;
const PotStationContainer = styled(Flex)`
  zoom: 0.5;
  overflow: hidden;
  -webkit-text-size-adjust: auto;
  position: relative;
`;
const PotSpriteContainer = styled(Flex)`
  border: 4px solid black;
  border-radius: 15px;
  background: ${palette(
    'grayscale',
    5,
  )};
  overflow: hidden;
  flex-basis: 540px;
  flex-shrink: 0;
  margin-left: 10px;

  @media (max-width: ${size('mobileBreakpoint')}) {
    z-index: 2;
    position: absolute;
    top: 0;
    right: 0;
    width: 540px;
    zoom: 0.5;
  }
`;
const StyledTab = styled(Tab)`
  zoom: 0.4;
  padding: 0px;
  margin-bottom: 10px;
`;
const DemoCooker = (props) => {
  const {
    cookerId,
    visible,
    onSelect,
    activeStatusById,
    completedJobsById,
    activeJobById,
  } = props;
  const isMobile = useMediaQuery({ query: `(max-width: ${theme.sizes.mobileBreakpoint})` });

  const { setQueryParams } = useQueryParams();

  const machineUrl = process.env.REACT_APP_MACHINE_URL.split(',');
  const [
    shouldAnimate,
    setShouldAnimate,
  ] = useState(false);

  useEffect(
    () => {
      if (visible) {
        if (!shouldAnimate) {
          setTimeout(
            () => {
              setShouldAnimate(visible);
            },
            1000,
          );
        }
      } else {
        setShouldAnimate(false);
      }
    },
    [
      visible,
      shouldAnimate,
    ],
  );

  return (
    <Wrapper>
      <StyledTab
        themeProps={{
          palette: 'grayscale',
          tone: 5,
        }}
        offThemeProps={{ palette: 'white' }}
        options={machineUrl
          .filter((url, i) => (isMobile ? (i < 2) : true))
          .map((url, i) => ({
            value: i,
            label: <PotTimer cookerId={i} />,
          }))}
        value={cookerId}
        onSelect={(i) => setQueryParams((prev) => ({
          ...prev,
          selectedCookerId: i,
        }))}
      />
      <PotStationContainer>
        <PotStation
          cookerId={cookerId}
          style={{
            border: '4px solid black',
            borderRadius: 15,
            background: theme.palette.grayscale[5],
            overflow: 'hidden',
          }}
          forDemo
        />
        <PotSpriteContainer>
          <PotSprite
            cookerId={cookerId}
            shouldAnimate={shouldAnimate}
            activeStatusById={activeStatusById}
            completedJobsById={completedJobsById}
            activeJobById={activeJobById}
            shouldLoop={false}
          />
        </PotSpriteContainer>
      </PotStationContainer>
    </Wrapper>
  );
};

DemoCooker.propTypes = {};
DemoCooker.defaultProps = {};

export default DemoCooker;
