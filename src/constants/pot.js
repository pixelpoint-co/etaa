import _ from 'lodash';
import {
  v4 as uuidv4,
} from 'uuid';

export const potNumber = [
  0,
  1,
  2,
  3,
  4,
  5,
];

export const cookerNumber = [
  {
    control: 1,
    pot: 1,
    label: 0,
  },
  {
    control: 1,
    pot: 2,
    label: 1,
  },
  {
    control: 2,
    pot: 1,
    label: 2,
  },
  {
    control: 2,
    pot: 2,
    label: 3,
  },
  {
    control: 3,
    pot: 1,
    label: 4,
  },
  {
    control: 3,
    pot: 2,
    label: 5,
  },
];

const getPotInfo = (index) => ({
  controllerCoord: [
    Math.floor((index) / 2),
    index % 2,
  ],
  control: Math.floor((index) / 2) + 1,
  pot: (index % 2) + 1,
  label: index,
  number: index + 1,
});

export const leftInductionsSet = [
  {
    action: '인덕션',
    label: '인덕션 왼쪽 끄기',
    value: '끔',
    type: 'TCPINDT',
    event: 'A_0_OFF',
    side: 'A',
    kitchenValue: [
      '0',
      'OFF',
    ],
  },
  {
    action: '인덕션',
    label: '인덕션 왼쪽 약',
    value: '약불',
    type: 'TCPINDT',
    event: 'A_1_ON',
    side: 'A',
    kitchenValue: [
      '1',
      'ON',
    ],
  },
  {
    action: '인덕션',
    label: '인덕션 왼쪽 중',
    value: '중불',
    type: 'TCPINDT',
    event: 'A_3_ON',
    side: 'A',
    kitchenValue: [
      '3',
      'ON',
    ],
  },
  {
    action: '인덕션',
    label: '인덕션 왼쪽 강',
    value: '강불',
    type: 'TCPINDT',
    event: 'A_7_ON',
    side: 'A',
    kitchenValue: [
      '7',
      'ON',
    ],
  },
];

export const rightInductionsSet = [
  {
    action: '인덕션',
    label: '인덕션 오른쪽 끄기',
    value: '끔',
    type: 'TCPINDT',
    event: 'B_0_OFF',
    side: 'B',
    kitchenValue: [
      '0',
      'OFF',
    ],
  },
  {
    action: '인덕션',
    label: '인덕션 오른쪽 약',
    value: '약불',
    type: 'TCPINDT',
    event: 'B_1_ON',
    side: 'B',
    kitchenValue: [
      '1',
      'ON',
    ],
  },
  {
    action: '인덕션',
    label: '인덕션 오른쪽 중',
    value: '중불',
    type: 'TCPINDT',
    event: 'B_3_ON',
    side: 'B',
    kitchenValue: [
      '3',
      'ON',
    ],
  },
  {
    action: '인덕션',
    label: '인덕션 오른쪽 강',
    value: '강불',
    type: 'TCPINDT',
    event: 'B_7_ON',
    side: 'B',
    kitchenValue: [
      '7',
      'ON',
    ],
  },
];

export const potAnglesSet = [
  {
    action: '팟 각도',
    label: '재료 투입',
    value: '재료 담기',
    type: 'TCPTILT',
    event: 'F',
    kitchenValue: [
      '0',
      'F',
    ],
  },
  {
    action: '팟 각도',
    label: '면 요리',
    value: '면 요리',
    type: 'TCPTILT',
    event: 'E',
    kitchenValue: [
      '0',
      'E',
    ],
  },
  {
    action: '팟 각도',
    label: '기본 요리',
    value: '기본 요리',
    type: 'TCPTILT',
    event: 'B',
    kitchenValue: [
      '0',
      'B',
    ],
  },
  {
    action: '팟 각도',
    label: '요리 토출',
    value: '음식 담기',
    type: 'TCPTILT',
    event: 'C',
    kitchenValue: [
      '0',
      'C',
    ],
  },
  {
    action: '팟 각도',
    label: '팟 세척 준비',
    value: '세척 준비',
    type: 'TCPTILT',
    event: 'D',
    kitchenValue: [
      '0',
      'D',
    ],
  },
];

export const potRotatesSet = [
  {
    action: '팟 회전',
    label: '팟 역회전',
    value: '역회전',
    type: 'TCPSPIN',
    event: 'BACKWARD',
    kitchenValue: [
      '0',
      'BACKWARD',
    ],
  },
  {
    action: '팟 회전',
    label: '팟 정지',
    value: '정지',
    type: 'TCPSPIN',
    event: 'STOP',
    kitchenValue: [
      '0',
      'STOP',
    ],
  },
  {
    action: '팟 회전',
    label: '팟 원점 정지',
    value: '원점 정지',
    type: 'TCPSPIN',
    event: 'HOMESTOP',
    kitchenValue: [
      '0',
      'HOMESTOP',
    ],
  },
  {
    action: '팟 회전',
    label: '팟 정회전',
    value: '정회전',
    type: 'TCPSPIN',
    event: 'FOWARD',
    kitchenValue: [
      '0',
      'FOWARD',
    ],
  },
];

export const solenoidsSet = [
  {
    action: '솔레노이드 열림',
    label: '솔레노이드 열림',
    value: '세척 중',
    type: 'SOLENOID',
    event: 'OPEN',
    kitchenValue: [
      '0',
      'OPEN',
    ],
  },
  {
    action: '솔레노이드 잠금',
    label: '솔레노이드 잠금',
    value: '정지',
    type: 'SOLENOID',
    event: 'CLOSE',
    kitchenValue: [
      '0',
      'CLOSE',
    ],
  },
];

export const dishMoverSet = [
  {
    action: '접시 위치',
    label: '접시 위치',
    value: '접시 이동',
    event: '70000',
  },
  {
    action: '접시 위치',
    label: '접시 위치',
    value: '원점 복귀',
    event: '0',
  },
];

export const recipeTags = [
  {
    id: 1,
    value: uuidv4(),
    label: '커피',
    viewable: false,
    recipeIds: _.times(
      10,
      (v) => v.tags?.includes([1]),
    ),
  },
  {
    id: 2,
    value: uuidv4(),
    label: '스페셜',
    viewable: true,
    recipeIds: _.times(
      10,
      (v) => v.tags?.includes([2]),
    ),
  },
  {
    id: 3,
    value: uuidv4(),
    label: '사이드',
    viewable: false,
    recipeIds: _.times(
      10,
      (v) => v.tags?.includes([3]),
    ),
  },
  {
    id: 110,
    value: uuidv4(),
    label: '스몰',
    viewable: false,
    recipeIds: _.times(
      10,
      (v) => v.tags?.includes([110]),
    ),
  },
  {
    id: 120,
    value: uuidv4(),
    label: '레귤러',
    viewable: false,
    recipeIds: _.times(
      10,
      (v) => v.tags?.includes([120]),
    ),
  },
  {
    id: 130,
    value: uuidv4(),
    label: '라지',
    viewable: false,
    recipeIds: _.times(
      10,
      (v) => v.tags?.includes([130]),
    ),
  },
  {
    id: 210,
    value: uuidv4(),
    label: '찜닭',
    viewable: false,
    recipeIds: _.times(
      10,
      (v) => v.tags?.includes([210]),
    ),
  },
  {
    id: 310,
    value: uuidv4(),
    label: '파스타',
    viewable: true,
    recipeIds: _.times(
      10,
      (v) => v.tags?.includes([310]),
    ),
  },
  {
    id: 320,
    value: uuidv4(),
    label: '리조또',
    viewable: true,
    recipeIds: _.times(
      10,
      (v) => v.tags?.includes([320]),
    ),
  },
];
