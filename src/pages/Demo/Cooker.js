import styled from 'styled-components';

import { palette } from 'styled-theme';
import {
  useEffect, useState,
} from 'react';
import Flex from '../../components/atoms/Flex';
import PotTab from '../../components/organisms/PotTab';
import useQueryParams from '../../hooks/useQueryParams';
import PotStation from '../../containers/PotStation';
import Card from '../../components/atoms/Card';
import theme from '../../theme';
import { useSprite } from '../../hooks/useSprite';
import PotSprite from './PotSprite';
import usePotController from '../../hooks/usePotController';

const Wrapper = styled(Flex)`
  flex-direction: column;
  flex-grow: 0;
  flex-basis: 100%;
  overflow: auto;
  align-items: stretch;
  padding: 15px;
`;
const PotStationContainer = styled(Flex)`

  zoom: 0.5;
  overflow: hidden;
  -webkit-text-size-adjust: none;
`;
const DemoCooker = (props) => {
  const {
    cookerId,
    visible,
    onSelect,
    activeStatusById,
    completedJobsById,
  } = props;
  const machineUrl = process.env.REACT_APP_MACHINE_URL.split(',');
  const [
    shouldAnimate,
    setShouldAnimate,
  ] = useState(false);

  useEffect(
    () => {
      let timer;
      console.log({
        visible,
        shouldAnimate,
      });
      if (visible) {
        if (!shouldAnimate) {
          console.log({
            visible,
            shouldAnimate,
          });
          setTimeout(
            () => {
              console.log({
                visible,
                shouldAnimate,
              });
              setShouldAnimate(visible);
            },
            1000,
          );
        } else {
          setShouldAnimate(false);
        }
      }
    },
    [visible],
  );
  console.log({
    visible,
    shouldAnimate,
  });
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
        options={machineUrl.map((v, i) => ({ value: i }))}
        value={cookerId}
        onSelect={onSelect}
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
        />
        {/* <Flex
          style={{
            border: '4px solid black',
            borderRadius: 15,
            background: theme.palette.grayscale[5],
            overflow: 'hidden',
            flexBasis: 540,
            flexShrink: 0,
            marginLeft: 10,
          }}
        >
          <PotSprite
            shouldAnimate={shouldAnimate}
            activeStatusById={activeStatusById}
            completedJobsById={completedJobsById}
          />
        </Flex> */}
      </PotStationContainer>
    </Wrapper>
  );
};

DemoCooker.propTypes = {};
DemoCooker.defaultProps = {};

export default DemoCooker;
