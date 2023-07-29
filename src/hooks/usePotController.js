import {
  useState, useCallback, useEffect, useMemo,
} from 'react';
import {
  gql,
  useLazyQuery,
  useMutation,
  useQuery, useSubscription,
} from '@apollo/client';
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

const SUBSCRIPTION = gql`
  subscription subscription {
    waiterSubscription
  }
`;
const SUBSCRIPTION_QUERY = gql`
  query waiterSubscription {
    waiterSubscription
  }
`;

const GET_COOKER_MONITORING = gql`
  query CookerMonitoring {
    cookerMonitoring
  }
`;

const UPDATE_ORDER_KITCHEN_STATUS = gql`
  mutation updateOrderKitchenStatus($id: Int!, $status: String!) {
    updateOrderKitchenStatus(id: $id, status: $status) {
      id
    }
  }
`;

const COOK_START = gql`
  query CookStart($recipeId: Int, $option: JSON) {
    startCooking(recipeId: $recipeId, option: $option)
  }
`;

const KITCHEN_POT_SWITCH = gql`
  mutation kitchenPotRotationSwitch($cookerId: Int) {
    kitchenPotRotationSwitch(cookerId: $cookerId)
  }
`;
// 기계에 직접 컨트롤
const GET_CONTROL = gql`
  query GetKitchenControl($controller: String, $type: String, $cookerId: String, $value: [String]) {
    kitchenControl(controller: $controller, type: $type, cookerId: $cookerId, value: $value)
  }
`;
// 세척 대기열 추가
const ADD_WASHING_POT = gql`
  mutation washingpot($cookerId: Int) {
    kitchenAddWashingPot(cookerId: $cookerId)
  }
`;

const COOK_STOP = gql`
  query CookStop($cookerId: Int) {
    stopCooking(cookerId: $cookerId)
  }
`;

const ALL_CANCEL = gql`
  query kitchenCookerAllCancel {
    kitchenCookerAllCancel
  }
`;

const usePotController = (cookerId, opts = {}) => {
  const [
    cookerMonitoringUUID,
    setCookerMonitoringUUID,
  ] = useState(null);
  const [
    cookStartUUID,
    setCookStartUUID,
  ] = useState(null);
  const [
    controlUUID,
    setControlUUID,
  ] = useState(null);
  const [
    cookStopUUID,
    setCookStopUUID,
  ] = useState(null);
  const [
    allCancelUUID,
    setAllCancelUUID,
  ] = useState(null);
  const [
    controlOptions,
    setControlOptions,
  ] = useState({});
  const [
    cookStartRecipeId,
    setCookStartRecipeId,
  ] = useState(null);
  const [
    cookStartOrderId,
    setCookStartOrderId,
  ] = useState(null);

  const [
    cookStartOrderKitchenId,
    setCookStartOrderKitchenId,
  ] = useState(null);

  const [
    subscriptionTime,
    setSubscriptionTime,
  ] = useState(0);

  const [
    requestQueueTime,
    setRequestQueueTime,
  ] = useState(0);
  const [
    requestQueueRaw,
    setRequestQueueRaw,
  ] = useState([]);
  const [
    orderKitchenRefetchTime,
    setOrderKitchenRefetchTime,
  ] = useState(0);
  const [
    orderRefetchTime,
    setOrderRefetchTime,
  ] = useState(0);

  const [
    lastActionType,
    setLastActionType,
  ] = useState(null); // recipe // machine // stop // abort // wash
  const [
    lastActionId,
    setLastActionId,
  ] = useState(null); // recipeId - Int // machine // abort // wash

  const [
    selectedRecipeId,
    setSelectedRecipeId,
  ] = useState(null);
  const [
    selectedOrderKitchenId,
    setSelectedOrderKitchenId,
  ] = useState(null);
  const {
    data: recipeData,
    error: recipeError,
    loading: recipeLoading,
  } = useRecipeData();
  console.log(recipeData);
  const {
    error: cookerMonitoringError,
    data: cookerMonitoringData,
    loading: cookerMonitoringLoading,
    refetch: cookerMonitoringRefetch,
  } = useQuery(
    GET_COOKER_MONITORING,
    {
      variables: {
        option: { cookerId },
        // clientUUID: cookerMonitoringUUID,
      },
      fetchPolicy: 'no-cache',
    },
  );
  const [
    initialLoadWaiterSubscriptionData,
    {
      error: initialWaiterSubscriptionError,
      data: initialWaiterSubscription,
      loading: initialWaiterSubscriptionLoading,
    },
  ] = useLazyQuery(
    SUBSCRIPTION_QUERY,
  );
  const { eKQueue } = useChefMonitor();
  console.log(eKQueue);
  // const chefPotMonitoring
  const handleSubscriptionData = (data) => {
    const cookerMonitoringTime = get(
      data,
      [
        'data',
        'waiterSubscription',
        'cookerMonitoring',
        'timeStamp',
      ],
      0,
    );
    const orderMonitoringTime = get(
      data,
      [
        'data',
        'waiterSubscription',
        'orders',
        'timeStamp',
      ],
      0,
    );
    const orderKitchenMonitoringTime = get(
      data,
      [
        'data',
        'waiterSubscription',
        'orderKitchen',
        'timeStamp',
      ],
      0,
    );
    if ((cookerMonitoringTime - subscriptionTime) > 0) {
      setSubscriptionTime(cookerMonitoringTime);
      // setCookerMonitoringUUID(uuidv4());
      cookerMonitoringRefetch();
    }
    const requestQueueRawData = get(
      data,
      [
        'data',
        'waiterSubscription',
        'requestQueueRaw',
        'data',
        'taskArgsRaw',
      ],
      [],
    );

    const requestQueueRawTime = get(
      data,
      [
        'data',
        'waiterSubscription',
        'requestQueueRaw',
        'timeStamp',
      ],
      [],
    );

    if ((requestQueueRawTime - requestQueueTime) > 0) {
      setRequestQueueTime(requestQueueRawTime);
      setRequestQueueRaw(requestQueueRawData);
    }
    if (orderMonitoringTime !== orderRefetchTime) {
      setOrderRefetchTime(orderMonitoringTime);
    }
    if (orderKitchenMonitoringTime !== orderKitchenRefetchTime) {
      setOrderKitchenRefetchTime(orderKitchenMonitoringTime);
    }
  };
  useEffect(
    () => {
      initialLoadWaiterSubscriptionData(
        { fetchPolicy: 'no-cache' },
      );
    },
    [],
  );
  useEffect(
    () => {
      if (initialWaiterSubscription) {
        handleSubscriptionData({ data: initialWaiterSubscription });
      }
    },
    [initialWaiterSubscription],
  );

  const {
    data: subscriptionData,
    loading: subscriptionLoading,
  } = useSubscription(
    SUBSCRIPTION,
    {
      onData: ({ data }) => {
        handleSubscriptionData(data);
      },
    },
  );
  // console.log(
  //   'cookStartOrderKitchenId: ',
  //   cookStartOrderKitchenId,
  // );
  const {
    error: cookStartError,
    data: cookStartData,
    // loading,
  } = useQuery(
    COOK_START,
    {
      skip: cookStartUUID == null,
      variables: {
        recipeId: cookStartRecipeId,
        // orderKitchenId: cookStartOrderKitchenId,
        option: {
          cookerId,
          orderKitchenId: cookStartOrderKitchenId,
        },
        clientUUID: cookStartUUID,
      },
      fetchPolicy: 'no-cache',
    },
  );

  // const { data: allCanelData } = useQuery(
  //   ALL_CANCEL,
  //   { skip: allCancelUUID == null },
  // );

  const {
    loading: controlLoading,
    error: controlError,
    data: controlData,
  } = useQuery(
    GET_CONTROL,
    {
      skip: controlUUID == null,
      variables: {
        controller: `eight-cooker${controlOptions.controller}`,
        type: `${controlOptions.type}`, // tcpspin
        cookerId: `${controlOptions.cookerId}`, // 1-2
        value: [
          `${get(
            controlOptions,
            [
              'value',
              0,
            ],
          )}`,
          `${get(
            controlOptions,
            [
              'value',
              1,
            ],
          )}`,
        ],
      },
      fetchPolicy: 'no-cache',
      // onCompleted: () => {
      // clearActiveState();
      // },
      // onError: () => {
      // clearActiveState();
      // },
    },
  );
  const handleUpdateOrderKitchenStatus = (...args) => {
    console.log(
      'handleUpdateOrderKitchenStatus: ',
      args,
    );
  };
  const [updateOrderKitchenStatus] = useMutation(
    UPDATE_ORDER_KITCHEN_STATUS,
    { onCompleted: handleUpdateOrderKitchenStatus },
  );

  const [kitchenPotRotationSwitch] = useMutation(
    KITCHEN_POT_SWITCH,
    { onCompleted: console.log },
  );

  const fetchMonitoring = useCallback(
    () => {
      cookerMonitoringRefetch();
    },
    [cookerMonitoringRefetch],
  );

  const startRecipe = useCallback(
    (recipeId, orderId) => {
      setCookStartRecipeId(recipeId);
      setCookStartOrderKitchenId(selectedOrderKitchenId);
      setCookStartOrderId(orderId);
      setCookStartUUID(uuidv4());
      setLastActionType('recipe');
      setLastActionId(21);
      if (process.env.REACT_APP_ENV === 'staging' || process.env.REACT_APP_ENV === 'development') {
        setTimeout(
          () => {
            kitchenPotRotationSwitch({ variables: { cookerId } });
          },
          2000,
        );
      }
    },
    [
      cookerId,
      kitchenPotRotationSwitch,
      selectedOrderKitchenId,
    ],
  );

  const potRotationSwitch = useCallback(
    () => {
      kitchenPotRotationSwitch({ variables: { cookerId } });
    },
    [
      cookerId,
      kitchenPotRotationSwitch,
    ],
  );

  const {
    error: cookStopError,
    // data,
    // loading,
  } = useQuery(
    COOK_STOP,
    {
      skip: cookStopUUID == null,
      variables: {
        cookerId,
        clientUUID: cookStopUUID,
      },
      fetchPolicy: 'no-cache',
    },
  );

  const potMonitoringData = get(
    cookerMonitoringData,
    [
      'cookerMonitoring',
      cookerId,
    ],
    {},
  );
  if (potMonitoringData.status == null) {
    console.log(
      'duration: ',
      cookerMonitoringData,
    );
  }
  console.log(
    'cookerMonitoringData: ',
    cookerMonitoringData,
  );
  const isCooking = get(
    potMonitoringData,
    'cooking',
    false,
  );
  const { recipe } = potMonitoringData;
  const inductionPowerToTemp = (power) => {
    const perPower = Math.ceil(100 / 3);
    return Math.min(
      perPower * power,
      100,
    );
  };

  const recipeMemo = useMemo(
    () => recipe,
    [
      get(
        recipe,
        'id',
      ),
      get(
        recipe,
        'updated',
      ),
    ],
  );
  // const parseRecipeRecord = (record) => {
  //   if (record == null) return null;
  //   const parameters = record.parameter.split('_');
  //   const type = parameters[0];
  //   const isSpin = type === 'TCPSPIN';
  //   const isInduction = type === 'TCPINDT';

  //   const { cookingTime } = record;
  //   // const type = record.parameter.split('_')[0];

  //   // eslint-disable-next-line no-nested-ternary
  //   const spinDirection = parameters[3] === 'HOMESTOP' ? 0
  //   // eslint-disable-next-line no-nested-ternary
  //     : parameters[3] === 'BACKWARD' ? -1
  //       : parameters[3] === 'FORWARD' ? 1
  //         : null;

  //   const spinParse = { spinDirection };
  //   // "TCPINDT_1B_7_ON"
  //   const inductionParse = {
  //     index: parameters[1][1] === 'A' ? 0 : 1,
  //     power: parameters[2],
  //     temperature: inductionPowerToTemp(parameters[2]),
  //     isOn: parameters[3] === 'ON',
  //   };
  //   const result = {
  //     type,
  //     isSpin,
  //     isInduction,
  //     cookingTime,
  //     ...(isSpin ? spinParse : inductionParse),
  //   };
  //   return result;
  // };
  const recipeStartedDateString = get(
    potMonitoringData,
    'started',
  );
  const recipeEllapsedTimeMs = typeof recipeStartedDateString !== 'string'
    ? 0
    : moment().valueOf() - moment(recipeStartedDateString).valueOf();
  const recipeEllapsedTime = Math.ceil(recipeEllapsedTimeMs / 1000);
  const recipeDuration = get(
    potMonitoringData,
    [
      'recipe',
      'detail',
      'duration',
    ],
    0,
  );
  const recipeDurationMs = recipeDuration * 1000;
  const recipeRemainingTimeMs = (potMonitoringData.status !== 'COOKER_COOKING' || !isCooking) ? 0
    : Math.max(
      0,
      (recipeDurationMs) - recipeEllapsedTimeMs,
    );

  // const recordList = get(
  //   potMonitoringData,
  //   [
  //     'recipe',
  //     'detail',
  //     'record',
  //   ],
  //   [],
  // );
  // const getCurrentRecord = (list) => {
  //   return findLast(
  //     list,
  //     (record) => {
  //       return record.cookingTime < recipeEllapsedTime;
  //     },
  //   );
  // };

  // const parsedRecordList = recordList.map(parseRecipeRecord);

  // const currentStoveRecord = [
  //   getCurrentRecord(parsedRecordList.filter((record) => record.isInduction && record.index === 0)),
  //   getCurrentRecord(parsedRecordList.filter((record) => record.isInduction && record.index === 1)),
  // ];
  // const currentSpinRecord = getCurrentRecord(parsedRecordList.filter((record) => record.isSpin));
  const stoveRecordToProp = (record) => ({
    ...record,
    temperature: get(
      record,
      'temperature',
      0,
    ) || 0,
    status: get(
      record,
      'isOn',
    ) ? 'on' : 'off',
  });
  // const stoves = currentStoveRecord.map(stoveRecordToProp);
  // const isRotating = get(
  //   currentSpinRecord,
  //   'spinDirection',
  //   0,
  // ) !== 0;

  const controlCoords = {
    controller: `0${Math.ceil((cookerId + 1) / 2)}`,
    cookerId: String((cookerId % 2) + 1),
  };

  const prepAngle = () => {
    setControlUUID(uuidv4());
    setControlOptions({
      ...controlCoords,
      type: 'TCPTILT',
      value: [
        '0',
        'C',
      ],
    });
    setLastActionType('machine');
    setLastActionId('음식담기');
  };
  const prepIngredientAngle = () => {
    setControlUUID(uuidv4());
    setControlOptions({
      ...controlCoords,
      type: 'TCPTILT',
      value: [
        '0',
        'F',
      ],
    });
    setLastActionType('machine');
    setLastActionId('재료담기');
  };
  const prepNoodle = () => {
    setControlUUID(uuidv4());
    setControlOptions({
      ...controlCoords,
      type: 'TCPTILT',
      value: [
        '0',
        'E',
      ],
    });
    setLastActionType('machine');
    setLastActionId('조리준비');
  };

  const rotateStart = () => {
    setControlUUID(uuidv4());
    setControlOptions({
      ...controlCoords,
      type: 'TCPSPIN',
      value: [
        '0',
        'BACKWARD',
      ],
    });
    setLastActionType('machine');
    setLastActionId('역회전');
  };

  const resetPosition = () => {
    setControlUUID(uuidv4());
    setControlOptions({
      ...controlCoords,
      type: 'TCPSPIN',
      value: [
        '0',
        'HOMESTOP',
      ],
    });
    setLastActionType('machine');
    setLastActionId('회전원점');
  };

  const prepWashing = () => {
    setControlUUID(uuidv4());
    setLastActionType('machine');
    setLastActionId('세척준비');
    setControlOptions({
      ...controlCoords,
      type: 'TCPTILT',
      value: [
        '0',
        'D',
      ],
    });
  };

  const [addWashing] = useMutation(
    ADD_WASHING_POT,
    {
    // onCompleted: addWashingCompleted,
    },
  );

  const startWashing = () => {
    addWashing({ variables: { cookerId } });
    setLastActionType('wash');
    setTimeout(
      () => {
        fetchMonitoring();
      },
      2000,
    );
  };

  const stopCook = () => {
    setCookStopUUID(uuidv4());
    setLastActionType('stop');
    setLastActionId(null);
  };

  const abort = () => {
    setAllCancelUUID(uuidv4());
    setLastActionType('abort');
    setLastActionId(null);
  };

  const getControllerNumber = (url) => Number(url.split('/')[3].slice(-1)[0]);
  const getPotNumber = (url) => Number(url.split('/')[4].split('_')[1][0]);
  const getInductionIndex = (command) => (command.split('_')[1][1] === 'A' ? 0 : 1);
  const getCookerId = (url) => ((getControllerNumber(url) - 1) * 2) + (getPotNumber(url) - 1);
  const requestQueue = requestQueueRaw
    .map((r) => r.arguments[0])
    .filter((url) => getCookerId(url) === cookerId);
  const commandQueue = requestQueue.map((url) => url.split('command=')[1]);
  console.log(
    'commandQueue',
    requestQueueRaw,
    requestQueue,
    commandQueue,
  );
  const machineState = commandQueue.reduce(
    (
      currentState,
      currentCommand,
    ) => {
      const parameters = currentCommand.split('_');
      const isSpin = parameters[0] === 'TCPSPIN';

      // eslint-disable-next-line no-nested-ternary
      const spinDirection = parameters[3] === 'HOMESTOP' ? 0
        // eslint-disable-next-line no-nested-ternary
        : parameters[3] === 'BACKWARD' ? -1
          : parameters[3] === 'FORWARD' ? 1
            : null;
      const isInduction = parameters[0] === 'TCPINDT';
      const inductionPower = parameters[2];
      const inductionIndex = getInductionIndex(currentCommand);
      const inductionIsOn = parameters[3] === 'ON';
      const stove = {
        power: isInduction ? inductionPower : currentState.stoves[inductionIndex].power,
        isOn: isInduction ? inductionIsOn : currentState.stoves[inductionIndex].isOn,
      };
      stove.temperature = inductionPowerToTemp(stove.power);
      const { stoves: stateStoves } = currentState;
      stateStoves[inductionIndex] = stoveRecordToProp(stove);

      const getTilt = (params) => {
        switch (params[3]) {
          case 'F':
            return 0;
          case 'E':
            return 45;
          case 'C':
            return 135;
          case 'D':
            return 180;
          default:
            return 0;
        }
      };
      const isTilt = parameters[0] === 'TCPTILT';
      const tilt = isTilt ? getTilt(parameters) : currentState.tilt;

      const isValve = parameters[0] === 'SOLENOID';
      const valveOpen = parameters[3] === 'OPEN';
      return {
        isRotating: isSpin ? spinDirection !== 0 : currentState.isRotating,
        rotateDirection: isSpin ? spinDirection : currentState.spinDirection,
        stoves: stateStoves,
        tilt,
        valveOpen: isValve ? valveOpen : currentState.valveOpen,
      };
    },
    {
      isRotating: false,
      rotateDirection: 0,
      stoves: [
        {
          power: 0,
          isOn: false,
        },
        {
          power: 0,
          isOn: false,
        },
      ],
      tilt: 0,
      valveOpen: false,
    },
  );

  const selectRecipe = (recipeId, orderKitchenId) => {
    console.log(
      'eftg: ',
      recipeId,
      orderKitchenId,
    );
    // updateOrderKitchenStatus({
    //   variables: {
    //     id: orderKitchenId,
    //     status: 'ORDER_WAITING',
    //   },
    // });
    global.api.post(
      `/cooker/${cookerId}/prep-cook`,
      {
        recipeId,
        orderKitchenId,
      },
    );
    setSelectedRecipeId(recipeId);
    setSelectedOrderKitchenId(orderKitchenId);
  };
  console.log(
    'machineState ',
    machineState,
  );
  console.log(
    'potMonitoringData ',
    potMonitoringData,
  );
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
  console.log(
    'selectedRecipe ',
    selectedRecipe,
    orderKitchenRefetchTime,
    orderRefetchTime,
  );
  const chefMonitorPot = _.find(
    eKQueue.completedJobList,
    { cookerId },
  );
  return {
    cookerMonitoringError,
    cookerMonitoringData,
    cookerMonitoringLoading,

    subscriptionData,
    subscriptionLoading,

    // cookStartError,

    fetchMonitoring,
    subscriptionTime,

    startRecipe,
    potRotationSwitch,

    lastActionType,
    lastActionId,

    potMonitoringData,
    chefMonitoringData: eKQueue.completedJobList,
    chefMonitorPot,
    recipe: recipeMemo, // selected recipe for current cook
    currentRecipeId: get(
      recipe,
      'id',
    ), // selected recipe for current cook
    selectRecipe,
    selectedRecipe,
    recipeRemainingTimeMs,
    recipeDurationMs,
    recipeDuration,
    recipeEllapsedTimeMs,
    recipeEllapsedTime,
    orderKitchenRefetchTime,
    orderRefetchTime,
    updateOrderKitchenStatus,
    // stoves,
    // isRotating,
    // recordList,
    // parsedRecordList,
    machineState,
    stoves: machineState.stoves,
    isRotating: machineState.isRotating,
    rotateDirection: machineState.rotateDirection,
    tiltDegree: machineState.tilt,
    valveOpen: machineState.valveOpen,
    prepAngle,
    prepIngredientAngle,
    prepNoodle,
    rotateStart,
    resetPosition,
    prepWashing,
    startWashing,
    stopCook,
    abort,
    isWashing: get(
      potMonitoringData,
      'status',
    ) === 'COOKER_WASHING',
    isCooking,

    requestQueueRaw,
    requestQueue,
  };
};
export default usePotController;
