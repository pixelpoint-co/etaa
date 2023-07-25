import {
  useState, useCallback, useEffect, useMemo,
} from 'react';
import _, {
  findLast,
  get,
} from 'lodash';
import {
  v4 as uuidv4,
} from 'uuid';
import moment from 'moment';

const usePotController = (cookerId, opts = {}) => {
  const prepNoodle = () => {
    global.api.post();
  };
  const rotateStart = () => {
    global.api.post(
      '/machine/raw',
      {
        ekCookerId: cookerId,
        type: 'motor',
        command: {
          id: 2,
          exec: 'run',
          velocity: 5000,
          direction: 0,
        },
      },
    );
  };
  const rotateStop = () => {
    global.api.post(
      '/machine/raw',
      {
        ekCookerId: cookerId,
        type: 'motor',
        command: {
          id: 2,
          exec: 'stop',
        },
      },
    );
  };

  return {
    prepNoodle,
    rotateStart,
    rotateStop,
  };
};
export default usePotController;
