import {
  useState, useCallback,
} from 'react';
import {
  gql,
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

const SUBSCRIPTION = gql`
  subscription subscription {
    waiterSubscription
  }
`;

const GET_COOKER_MONITORING = gql`
  query CookerMonitoring {
    cookerMonitoring
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
    lastActionType,
    setLastActionType,
  ] = useState(null); // recipe // machine // stop // abort // wash
  const [
    lastActionId,
    setLastActionId,
  ] = useState(null); // recipeId - Int // machine // abort // wash

  const {
    error: cookerMonitoringError,
    data: cookerMonitoringData,
    loading: cookerMonitoringLoading,
  } = useQuery(
    GET_COOKER_MONITORING,
    {
      variables: {
        option: { cookerId },
        clientUUID: cookerMonitoringUUID,
      },
      fetchPolicy: 'no-cache',
    },
  );

  const {
    data: subscriptionData,
    loading: subscriptionLoading,
  } = useSubscription(
    SUBSCRIPTION,
    {
      onData: ({ data }) => {
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
        if ((cookerMonitoringTime - subscriptionTime) > 0) {
          setSubscriptionTime(cookerMonitoringTime);
          setCookerMonitoringUUID(uuidv4());
        }

        const requestQueueRawData = get(
          data,
          [
            'data',
            'waiterSubscription',
            'requestQueueRaw',
            'data',
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
      },
    },
  );

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
        option: { cookerId },
        clientUUID: cookStartUUID,
      },
      fetchPolicy: 'no-cache',
    },
  );

  const { data: allCanelData } = useQuery(
    ALL_CANCEL,
    { skip: allCancelUUID == null },
  );

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

  const [kitchenPotRotationSwitch] = useMutation(
    KITCHEN_POT_SWITCH,
    { onCompleted: console.log },
  );

  const fetchMonitoring = useCallback(
    () => {
      setCookerMonitoringUUID(uuidv4());
    },
    [],
  );

  const startRecipe = useCallback(
    (recipeId) => {
      setCookStartRecipeId(recipeId);
      setCookStartUUID(uuidv4());
      setLastActionType('recipe');
      setLastActionId(21);
      setTimeout(
        () => {
          kitchenPotRotationSwitch({ variables: { cookerId } });
        },
        2000,
      );
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
  const parseRecipeRecord = (record) => {
    if (record == null) return null;
    const parameters = record.parameter.split('_');
    const type = parameters[0];
    const isSpin = type === 'TCPSPIN';
    const isInduction = type === 'TCPINDT';

    const { cookingTime } = record;
    // const type = record.parameter.split('_')[0];

    // eslint-disable-next-line no-nested-ternary
    const spinDirection = parameters[3] === 'HOMESTOP' ? 0
    // eslint-disable-next-line no-nested-ternary
      : parameters[3] === 'BACKWARD' ? -1
        : parameters[3] === 'FORWARD' ? 1
          : null;

    const spinParse = { spinDirection };
    // "TCPINDT_1B_7_ON"
    const inductionParse = {
      index: parameters[1][1] === 'A' ? 0 : 1,
      power: parameters[2],
      temperature: inductionPowerToTemp(parameters[2]),
      isOn: parameters[3] === 'ON',
    };
    const result = {
      type,
      isSpin,
      isInduction,
      cookingTime,
      ...(isSpin ? spinParse : inductionParse),
    };
    return result;
  };
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

  const recordList = get(
    potMonitoringData,
    [
      'recipe',
      'detail',
      'record',
    ],
    [],
  );
  const getCurrentRecord = (list) => {
    return findLast(
      list,
      (record) => {
        return record.cookingTime < recipeEllapsedTime;
      },
    );
  };

  const parsedRecordList = recordList.map(parseRecipeRecord);

  const currentStoveRecord = [
    getCurrentRecord(parsedRecordList.filter((record) => record.isInduction && record.index === 0)),
    getCurrentRecord(parsedRecordList.filter((record) => record.isInduction && record.index === 1)),
  ];
  const currentSpinRecord = getCurrentRecord(parsedRecordList.filter((record) => record.isSpin));
  const stoveRecordToProp = (record) => {
    return {
      temperature: get(
        record,
        'temperature',
        0,
      ) || 0,
      status: get(
        record,
        'isOn',
      ) ? 'on' : 'off',
    };
  };
  const stoves = currentStoveRecord.map(stoveRecordToProp);
  const isRotating = get(
    currentSpinRecord,
    'spinDirection',
    0,
  ) !== 0;

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
  };

  const resetPosition = () => {
    setControlUUID(uuidv4());
    setLastActionType('wash');

    setControlOptions({
      ...controlCoords,
      type: 'TCPSPIN',
      value: [
        '0',
        'HOMESTOP',
      ],
    });
  };

  const prepWashing = () => {
    setControlUUID(uuidv4());
    setLastActionType('wash');
    setLastActionId('prep');
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

  const getControllerNumber = (url) => {
    return Number(url.split('/')[3].slice(-1)[0]);
  };
  const getPotNumber = (url) => {
    return Number(url.split('/')[4].split('_')[1][0]);
  };
  const getInductionIndex = (command) => {
    return command.split('_')[1][1] === 'A' ? 0 : 1;
  };
  const getCookerId = (url) => {
    return ((getControllerNumber(url) - 1) * 2) + (getPotNumber(url) - 1);
  };
  const requestQueue = requestQueueRaw
    .map((r) => r.arguments[0])
    .filter((url) => {
      return getCookerId(url) === cookerId;
    });
  const commandQueue = requestQueue.map((url) => url.split('command=')[1]);
  console.log(
    'commentQueue',
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
      const { stoves: stateStoves } = currentState;
      stoves[inductionIndex] = stateStoves;

      return {
        isRotating: isSpin ? spinDirection !== 0 : currentState.isRotating,
        stoves: stateStoves,
      };
    },
    {
      isRotating: false,
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
    },
  );
  console.log(
    'machineState ',
    machineState,
  );
  console.log(
    'requestQueue: ',
    requestQueue,
  );

  return {
    cookerMonitoringError,
    cookerMonitoringData,
    cookerMonitoringLoading,

    subscriptionData,
    subscriptionLoading,

    cookStartError,

    fetchMonitoring,
    subscriptionTime,

    startRecipe,

    lastActionType,
    lastActionId,

    potMonitoringData,
    recipe,
    recipeRemainingTimeMs,
    recipeDurationMs,
    recipeDuration,
    recipeEllapsedTimeMs,
    recipeEllapsedTime,

    stoves,
    isRotating,
    recordList,
    parsedRecordList,

    prepAngle,
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
