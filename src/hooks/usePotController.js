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

const machineUrl = process.env.REACT_APP_MACHINE_URL.split(',');
console.log(machineUrl);
const mapPowerToCommand = (power, id = 0) => {
  return {
    type: 'induction',
    command: {
      power,
      id,
      exec: 'run',
    },
  };
};

export const getMachineUrl = (cookerId) => {
  // if (
  //   process.env.REACT_APP_ENV === 'staging'
  //   || process.env.REACT_APP_ENV === 'development'
  // ) {
  //   return 'https://eight-receipt.fly.dev/api/v1';
  // }
  console.log({
    machineUrl,
    cookerId,
    url: machineUrl[cookerId],
  });
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
  const machineState = machineStateById[cookerId] || [];
  const startSpin = () => {
    global.api.post(
      `${getMachineUrl(cookerId)}/cooker/${cookerId}/start-spin`,
    );
  };
  const startSpin150 = () => {
    global.api.post(
      `${getMachineUrl(cookerId)}/machine/raw`,
      {
        type: 'motor',
        command: {
          velocity: 3,
          id: 2,
          exec: 'run',
        },
      },
    );
  };
  const startSpin200 = () => {
    global.api.post(
      `${getMachineUrl(cookerId)}/machine/raw`,
      {
        type: 'motor',
        command: {
          velocity: 5,
          id: 2,
          exec: 'run',
        },
      },
    );
  };
  const stopSpin = () => {
    global.api.post(
      `${getMachineUrl(cookerId)}/cooker/${cookerId}/stop-spin`,
    );
  };
  const spinHome = () => {
    global.api.post(
      `${getMachineUrl(cookerId)}/cooker/${cookerId}/spin-home`,
    );
  };

  const tiltHome = () => {
    global.api.post(
      `${getMachineUrl(cookerId)}/cooker/${cookerId}/tilt-home`,
    );
  };

  const home = () => {
    global.api.post(
      `${getMachineUrl(cookerId)}/cooker/${cookerId}/home`,
    );
  };

  const prepCook = () => {
    global.api.post(
      `${getMachineUrl(cookerId)}/cooker/${cookerId}/prep-cook`,
    );
  };
  const startCook = (data = {}) => {
    global.api.post(
      `${getMachineUrl(cookerId)}/cooker/${cookerId}/start-cook`,
      {
        recipeId: selectedRecipeId,
        orderKitchenId: selectedOrderKitchenId,
        ...data,
      },
    );
  };
  const stopCook = (data = {}) => {
    global.api.post(
      `${getMachineUrl(cookerId)}/cooker/${cookerId}/stop-cook`,
      { ...data },
    );
  };
  const startWash = () => {
    global.api.post(
      `${getMachineUrl(cookerId)}/cooker/${cookerId}/start-wash`,
    );
  };
  const prepWash = () => {
    global.api.post(
      `${getMachineUrl(cookerId)}/cooker/${cookerId}/prep-wash`,
    );
  };
  const finishCook = () => {
    global.api.post(
      `${getMachineUrl(cookerId)}/cooker/${cookerId}/finish-cook`,
    );
  };

  const setInductionPower = (power, id = 0) => {
    global.api.post(
      `${getMachineUrl(cookerId)}/machine/raw`,
      mapPowerToCommand(
        power,
        id,
      ),
    );
  };

  const dishIn = () => {
    global.api.post(
      `${getMachineUrl(cookerId)}/cooker/${cookerId}/dish-in`,
    );
  };
  const dishOut = () => {
    global.api.post(
      `${getMachineUrl(cookerId)}/cooker/${cookerId}/dish-out`,
    );
  };
  const selectRecipe = async (recipeId, orderKitchenId) => {
    // global.api.post(
    //   `/cooker/${cookerId}/prep-cook`,
    //   {
    //     recipeId,
    //     orderKitchenId,
    //   },
    // );
    setSelectedRecipeId(recipeId);
    setSelectedOrderKitchenId(orderKitchenId);
    return global.api.post(
      `${getMachineUrl(cookerId)}/cooker/${cookerId}/select-recipe`,
      {
        recipeId,
        orderKitchenId,
      },
    );
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
  );
  const recipeDuration = get(
    currentRecipe,
    [
      'detail',
      'duration',
    ],
    0,
  );
  const recipeDurationMilleSecond = get(
    currentRecipe,
    [
      'detail',
      'durationMs',
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
  const recipeDurationMs = recipeDurationMilleSecond || recipeDuration * 1000;
  const recipeRemainingTimeMs = (!isCooking) ? 0
    : Math.max(
      0,
      (recipeDurationMs) - recipeEllapsedTimeMs,
    );

  const spinData = _.get(
    machineState.filter((v) => v.name === 'motor-spin'),
    [
      0,
      'data',
    ],
    {},
  );
  const tiltData = _.get(
    machineState.filter((v) => v.name === 'motor-tilt'),
    [
      0,
      'data',
    ],
    {},
  );
  const inductionLData = _.get(
    machineState.filter((v) => v.name === 'induction-L'),
    [
      0,
      'data',
    ],
    {},
  );
  const inductionRData = _.get(
    machineState.filter((v) => v.name === 'induction-R'),
    [
      0,
      'data',
    ],
    {},
  );
  const solenoidData = _.get(
    machineState.filter((v) => v.name === 'solenoid'),
    [
      0,
      'data',
    ],
    {},
  );
  const inductionPowerToTemp = (power, max = 7) => {
    const perPower = Math.ceil((100 / max) * 100) / 100;
    return Math.min(
      perPower * power,
      100,
    );
  };
  const getTilt = (t) => {
    if (t.exec === 'home') {
      return 0;
    }
    if (t.position <= 0 && t.position >= -35000) return 45; // prep-cook
    if (t.position <= 35001 && t.position >= -70000) return 135; // finish-cook
    if (t.position <= 70001 && t.position >= -105000) return 180; // wash
    return 0;
    // switch (t.position) {
    //   case -35000:
    //     return 45;
    //   case -31000:
    //     return 45;
    //   case -52000:
    //     return 135;
    //   case -123000:
    //     return 135;
    //   case -100000:
    //     return 180;
    //   default:
    //     return 0;
    // }
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
    activeStatus,
  });

  const isWashing = _.get(
    activeStatus,
    [
      0,
      'name',
    ],
  ) === 'wash';
  const timestamp = _.get(
    activeStatus,
    [
      0,
      'timestamp',
    ],
    0,
  );
  const washingRemainingTimeMs = isWashing ? (timestamp + 111000) - Date.now() : 0;
  return {
    cookerId,
    prepCook,
    selectRecipe,
    startSpin,
    startSpin150,
    startSpin200,
    stopSpin,
    spinHome,

    tiltHome,
    dishIn,
    dishOut,
    home,
    startWash,
    prepWash,
    startCook,
    stopCook,
    finishCook,
    setInductionPower,
    selectedRecipeId,
    selectedRecipe,
    selectedOrderKitchenId,
    recipeData,
    currentRecipe,
    currentRecipeId,
    activeStatus,
    isWashing: _.get(
      activeStatus,
      [
        0,
        'name',
      ],
    ) === 'wash',
    washingRemainingTimeMs,
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
