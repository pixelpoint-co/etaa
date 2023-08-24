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
import useRecipeData from './useRecipeData';
import useChefMonitor from './useChefMonitor';

const machineUrl = [
  'http://192.168.0.200:4100/api/v1',
  'http://192.168.0.199:4100/api/v1',
  'http://192.168.0.198:4100/api/v1',
  'http://192.168.0.197:4100/api/v1',
  'http://192.168.0.196:4100/api/v1',
  'http://192.168.0.195:4100/api/v1',
];

const getMachineUrl = (cookerId) => {
  if (
    process.env.REACT_APP_ENV === 'staging'
    || process.env.REACT_APP_ENV === 'development'
  ) {
    return 'http://localhost:4100/api/v1';
  }
  return machineUrl[cookerId];
};

const usePotController = (cookerId, opts = {}) => {
  const {
    data: recipeData,
    error: recipeError,
    loading: recipeLoading,
  } = useRecipeData();
  const [
    selectedRecipeId,
    setSelectedRecipeId,
  ] = useState(null);
  const [
    selectedOrderKitchenId,
    setSelectedOrderKitchenId,
  ] = useState(null);
  const {
    activeStatusById,
    completedJobsById,
    machineStateById,
  } = useChefMonitor();
  const activeStatus = activeStatusById[cookerId];
  const completedJobs = completedJobsById[cookerId];
  const machineState = machineStateById[cookerId];
  const startSpin = () => {
    global.api.post(
      `${getMachineUrl(cookerId)}/cooker/0/start-spin`,
    );
  };
  const stopSpin = () => {
    global.api.post(
      `${getMachineUrl(cookerId)}/cooker/0/stop-spin`,
    );
  };
  const spinHome = () => {
    global.api.post(
      `${getMachineUrl(cookerId)}/cooker/0/spin-home`,
    );
  };

  const tiltHome = () => {
    global.api.post(
      `${getMachineUrl(cookerId)}/cooker/0/tilt-home`,
    );
  };

  const home = () => {
    global.api.post(
      `${getMachineUrl(cookerId)}/cooker/0/home`,
    );
  };

  const prepCook = () => {
    global.api.post(
      `${getMachineUrl(cookerId)}/cooker/0/prep-cook`,
    );
  };
  const startCook = (data = {}) => {
    global.api.post(
      `${getMachineUrl(cookerId)}/cooker/0/start-cook`,
      {
        recipeId: selectedRecipeId,
        ...data,
      },
    );
  };
  const stopCook = (data = {}) => {
    global.api.post(
      `${getMachineUrl(cookerId)}/cooker/0/stop-cook`,
      { ...data },
    );
  };
  const startWash = () => {
    global.api.post(
      `${getMachineUrl(cookerId)}/cooker/0/start-wash`,
    );
  };
  const prepWash = () => {
    global.api.post(
      `${getMachineUrl(cookerId)}/cooker/0/prep-wash`,
    );
  };
  const finishCook = () => {
    global.api.post(
      `${getMachineUrl(cookerId)}/cooker/0/finish-cook`,
    );
  };
  const selectRecipe = (recipeId, orderKitchenId) => {
    console.log(
      'eftg: ',
      recipeId,
      orderKitchenId,
    );
    // global.api.post(
    //   `/cooker/${cookerId}/prep-cook`,
    //   {
    //     recipeId,
    //     orderKitchenId,
    //   },
    // );
    setSelectedRecipeId(recipeId);
    setSelectedOrderKitchenId(orderKitchenId);
  };
  const selectedRecipe = useMemo(
    () => _.find(
      recipeData,
      { id: selectedRecipeId },
    ),
    [
      recipeData,
      selectedRecipeId,
    ],
  );
  console.log(activeStatus);
  const currentRecipeId = _.get(
    activeStatus,
    [
      0,
      'data',
      'recipeId',
    ],
  );
  const currentRecipe = useMemo(
    () => _.find(
      recipeData,
      { id: currentRecipeId },
    ),
    [
      recipeData,
      currentRecipeId,
    ],
    {},
  );
  const recipeDuration = get(
    currentRecipe,
    [
      'detail',
      'duration',
    ],
    0,
  );
  const recipeStartTimeMs = _.get(
    activeStatus,
    [
      0,
      'timestamp',
    ],
  );
  const isCooking = _.get(
    activeStatus,
    [
      0,
      'name',
    ],
  ) === 'cook';
  const recipeEllapsedTimeMs = isCooking ? moment().valueOf() - recipeStartTimeMs : 0;
  const recipeDurationMs = recipeDuration * 1000;
  const recipeRemainingTimeMs = (!isCooking) ? 0
    : Math.max(
      0,
      (recipeDurationMs) - recipeEllapsedTimeMs,
    );

  const spinData = _.get(
    machineState,
    [
      'spinMotor',
      0,
      'data',
    ],
    {},
  );
  const tiltData = _.get(
    machineState,
    [
      'tiltMotor',
      0,
      'data',
    ],
    {},
  );
  const inductionLData = _.get(
    machineState,
    [
      'inductionL',
      0,
      'data',
    ],
    {},
  );
  const inductionRData = _.get(
    machineState,
    [
      'inductionR',
      0,
      'data',
    ],
    {},
  );

  const solenoidData = _.get(
    machineState,
    [
      'solenoid',
      0,
      'data',
    ],
    {},
  );
  const inductionPowerToTemp = (power) => {
    const perPower = Math.ceil(100 / 7);
    return Math.min(
      perPower * power,
      100,
    );
  };
  const getTilt = (t) => {
    if (t.exec === 'home') {
      return 0;
    }
    switch (t.position) {
      case -79000:
        return 45;
      case -150000:
        return 135;
      case -255000:
        return 180;
      default:
        return 0;
    }
  };
  const parsedMachineState = {
    isSpinning: spinData.exec === 'run',
    spinDirection: spinData.direction,
    stoves: [
      {
        power: inductionLData.power,
        temperature: inductionPowerToTemp(inductionLData.power),
        isOn: inductionLData.exec === 'run',
      },
      {
        power: inductionRData.power,
        temperature: inductionPowerToTemp(inductionRData.power),
        isOn: inductionRData.exec === 'run',
      },
    ],
    tilt: getTilt(tiltData),
    valveOpen: solenoidData.exec === 'run',
  };
  console.log({
    parsedMachineState,
    machineState,
  });
  return {
    prepCook,
    selectRecipe,
    startSpin,
    stopSpin,
    spinHome,

    tiltHome,

    home,
    startWash,
    prepWash,
    startCook,
    stopCook,
    finishCook,
    selectedRecipeId,
    selectedRecipe,
    selectedOrderKitchenId,
    currentRecipe,
    currentRecipeId,
    isWashing: _.get(
      activeStatus,
      [
        0,
        'name',
      ],
    ) === 'wash',
    isCooking: _.get(
      activeStatus,
      [
        0,
        'name',
      ],
    ) === 'cook',
    recipeDurationMs,
    recipeRemainingTimeMs,

    machineState: parsedMachineState,
    stoves: parsedMachineState.stoves,
    isSpinning: parsedMachineState.isSpinning,
    spinDirection: parsedMachineState.spinDirection,
    tiltDegree: parsedMachineState.tilt,
    valveOpen: parsedMachineState.valveOpen,
  };
};
export default usePotController;
