import styled, { css } from 'styled-components';

import {
  palette, size,
} from 'styled-theme';
import {
  useEffect, useState,
} from 'react';
import { useMediaQuery } from 'react-responsive';
import { ifProp } from 'styled-tools';
import Flex from '../../components/atoms/Flex';
import useQueryParams from '../../hooks/useQueryParams';
import PotStation from '../../containers/PotStation';
import theme from '../../theme';
import PotSprite from './PotSprite';
import PotTimer from '../../containers/PotStation/PotTimer';
import Tab from '../../components/molecules/Tab';
// import PotUnit from '../../components/organisms/PotUnit';
// import PotUnit from '../../components/organisms/PotTab/PotUnit';
import Button from '../../components/atoms/Button';
import IconButton from '../../components/molecules/IconButton';

const Wrapper = styled(Flex)`
  flex-direction: column;
  flex-grow: 0;
  flex-basis: 100%;
  overflow: auto;
  align-items: stretch;
  padding: 12px;
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
  flex-basis: 548px;
  flex-shrink: 0;
  margin-left: 10px;

  @media (max-width: ${size('mobileBreakpoint')}) {
    overflow: visible;
    z-index: 2;
    position: absolute;
    top: 0;
    right: 0;
    width: 540px;
    zoom: 0.5;
    transition: transform 250ms ease-in-out;
    transform: translate(0%);
  }
  ${ifProp(
    '$hidden',
    css`
        @media (max-width: ${size('mobileBreakpoint')}) {
          transform: translate(100%);
        }
      `,
  )}
`;
const SpriteToggle = styled(IconButton)`
  position: absolute;
  right: 100%;
  top: 100px;
  padding: 24px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  display: none;

  @media (max-width: ${size('mobileBreakpoint')}) {
    display: flex;
  }
`;
const StyledTab = styled(Tab)`
  zoom: 0.5;
  margin-bottom: 10px;
  background-color: ${palette(
    'grayscale',
    5,
  )}
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
  const [
    spriteHidden,
    setSpriteHidden,
  ] = useState(false);

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
        offThemeProps={{
          palette: 'grayscale',
          tone: 5,
        }}
        themeProps={{ palette: 'white' }}
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
        <PotSpriteContainer $hidden={spriteHidden}>
          <SpriteToggle
            icon={spriteHidden ? 'play' : 'x'}
            palette="grayscale"
            themeType="solid"
            iconSize={40}
            onClick={() => setSpriteHidden(!spriteHidden)}
          />
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
