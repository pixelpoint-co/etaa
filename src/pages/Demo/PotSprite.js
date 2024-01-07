import {
  useCallback, useEffect, useState,
} from 'react';
import _ from 'lodash';
import styled, { css } from 'styled-components';
import { ifProp } from 'styled-tools';
import tiltSource from '../../assets/image/sprite-angle.jpg';
import washSource from '../../assets/image/sprite-wash.jpg';
import cookSource from '../../assets/image/sprite-cook.jpg';
import usePotController from '../../hooks/usePotController';

import { useSprite } from '../../hooks/useSprite';
import Flex from '../../components/atoms/Flex';

const Container = styled(Flex)`

`;

const defaultSpriteOptions = {
  source: tiltSource,
  startFrame: 12,
  endFrame: 12,
  shouldLoop: false,
};
const homeFrame = 0;
const prepCookFrame = 12;
const finishCookFrame = 23;
const prepWashFrame = 35;
const pathToSpriteOptions = {
  'home-prep-cook': {
    ...defaultSpriteOptions,
    source: tiltSource,
    startFrame: homeFrame,
    endFrame: prepCookFrame,
  },
  'home-finish-cook': {
    ...defaultSpriteOptions,
    source: tiltSource,
    startFrame: homeFrame,
    endFrame: finishCookFrame,
  },
  'home-prep-wash': {
    ...defaultSpriteOptions,
    source: tiltSource,
    startFrame: homeFrame,
    endFrame: prepWashFrame,
  },
  'prep-cook-finish-cook': {
    ...defaultSpriteOptions,
    source: tiltSource,
    startFrame: prepCookFrame,
    endFrame: finishCookFrame,
  },
  'stop-cook-finish-cook': {
    ...defaultSpriteOptions,
    source: tiltSource,
    startFrame: prepCookFrame,
    endFrame: finishCookFrame,
  },
  'finish-cook-prep-cook': {
    ...defaultSpriteOptions,
    source: tiltSource,
    startFrame: finishCookFrame,
    endFrame: prepCookFrame,
  },
  'finish-cook-prep-wash': {
    ...defaultSpriteOptions,
    source: tiltSource,
    startFrame: finishCookFrame,
    endFrame: prepWashFrame,
  },
  'cook-prep-cook': {
    ...defaultSpriteOptions,
    source: tiltSource,
    startFrame: finishCookFrame,
    endFrame: prepCookFrame,
  },
  'cook-stop-cook': {
    ...defaultSpriteOptions,
    source: cookSource,
    startFrame: 0,
    endFrame: 0,
  },
  'stop-cook-cook': {
    ...defaultSpriteOptions,
    source: cookSource,
    startFrame: 0,
    endFrame: 0,
  },
  'prep-cook-cook': {
    ...defaultSpriteOptions,
    source: cookSource,
    startFrame: 0,
    endFrame: 0,
  },
  'cook-finish-cook': {
    ...defaultSpriteOptions,
    source: tiltSource,
    startFrame: 36,
    endFrame: 47,
  },
  washing: {
    startFrame: 0,
    endFrame: 11,
    source: washSource,
    shouldLoop: true,
  },
  wash: {
    ...defaultSpriteOptions,
    startFrame: prepWashFrame,
    endFrame: prepWashFrame,
  },
  cooking: {
    startFrame: 0,
    endFrame: 11,
    source: cookSource,
    shouldLoop: true,
  },
  cook: {
    ...defaultSpriteOptions,
    source: cookSource,
    startFrame: 0,
    endFrame: 0,
  },
  'home-stop-cook': {
    ...defaultSpriteOptions,
    source: cookSource,
    startFrame: 0,
    endFrame: 0,
  },
  'wash-prep-cook': {
    ...defaultSpriteOptions,
    source: tiltSource,
    startFrame: prepWashFrame,
    endFrame: prepCookFrame,
  },
  'wash-finish-cook': {
    ...defaultSpriteOptions,
    source: tiltSource,
    startFrame: prepWashFrame,
    endFrame: finishCookFrame,
  },
};

const PotSprite = (props) => {
  const {
    cookerId,
    shouldLoop,
    activeStatusById,
    completedJobsById,
    activeJobById,
    ...others
  } = props;
  const {
    machineState,
    isWashing,
    isCooking,
  } = usePotController(cookerId);
  const uniqueJobs = _.uniqBy(
    completedJobsById[cookerId],
    'name',
  );
  const [
    to,
    from,
    fromPrev,
  ] = [
    _.get(
      uniqueJobs,
      [
        0,
        'name',
      ],
    ),
    _.get(
      uniqueJobs,
      [
        1,
        'name',
      ],
    ),
    _.get(
      uniqueJobs,
      [
        2,
        'name',
      ],
    ),
  ].filter((v) => v != null);

  const path = `${from}-${to}`;
  console.log({ path });
  let spriteOptions = pathToSpriteOptions[path] || defaultSpriteOptions;
  if (to === 'wash') spriteOptions = pathToSpriteOptions.wash;

  if (path === 'stop-cook-finish-cook' && fromPrev === 'cook') {
    spriteOptions = pathToSpriteOptions['cook-finish-cook'];
  }
  if (path === 'stop-cook-prep-cook' && fromPrev === 'cook') {
    spriteOptions = pathToSpriteOptions.cook;
  }
  const washIndex = _.findIndex(
    uniqueJobs,
    { name: 'wash' },
  );
  const cookIndex = _.findIndex(
    uniqueJobs,
    { name: 'cook' },
  );
  const finishIndex = _.findIndex(
    uniqueJobs,
    { name: 'finish-cook' },
  );
  const neverWashed = (cookIndex >= 0)
    && !(
      (finishIndex > 0 && finishIndex < cookIndex)
        || (washIndex > 0 && washIndex < cookIndex)
    );
  if (neverWashed && to === 'finish-cook') {
    spriteOptions = pathToSpriteOptions['cook-finish-cook'];
  }
  if (isCooking) spriteOptions = pathToSpriteOptions.cooking;
  if (isWashing) spriteOptions = pathToSpriteOptions.washing;

  const lastActionTimeMs = _.get(
    uniqueJobs,
    [
      0,
      'processedOn',
    ],
    0,
  );

  const animationIsOver = !isWashing && !isCooking && (Date.now() - lastActionTimeMs) > 3000;
  console.log({
    lastActionTimeMs,
    uniqueJobs,
    time: (Date.now() - lastActionTimeMs),
    animationIsOver,
  });

  const { tilt } = machineState;
  useEffect(
    () => {
    },
    [
      tilt,
      isWashing,
      isCooking,
    ],
  );

  const styles = useSprite({
    sprite: spriteOptions.source,
    width: 540,
    height: 960,
    display: 'flex',
    fps: 6,
    ...{
      ...spriteOptions,
      ...(
        animationIsOver ? { startFrame: spriteOptions.endFrame } : {}
      ),
    },
  });
  return (
    <Container>
      <div
        style={styles}
      />
    </Container>
  );
};

PotSprite.propTypes = {};

PotSprite.defaultProps = {};

export default PotSprite;
