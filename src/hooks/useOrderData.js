import {
  useEffect,
  useCallback,
  useState,
  useMemo,
} from 'react';
import moment from 'moment';
import {
  v4 as uuidv4,
} from 'uuid';
import {
  gql, useQuery,
} from '@apollo/client';

import _, {
  get,
  uniqBy,
} from 'lodash';

import {
  atom, useAtom,
} from 'jotai';
import {
  loadable, selectAtom,
} from 'jotai/utils';
import useRecipeData from './useRecipeData';

const pageSizeAtom = atom(50);
const currentPageAtom = atom(0);
const orderDataLastCalledAtom = atom(0);
const orderDataAtom = atom(async (getter) => {
  const pageSize = getter(pageSizeAtom);
  const currentPage = getter(currentPageAtom);
  const lastCalled = getter(orderDataLastCalledAtom);
  console.log('CALLING');
  const response = await global.api.get(
    '/order',
    {
      params: {
        limit: pageSize,
        offset: pageSize * currentPage,
      },
    },
  );
  return response;
});
const loadableOrderDataAtom = loadable(orderDataAtom);

export default (options = {}) => {
  const {
    orderKitchenRefetchTime = 0,
    orderRefetchTime = 0,
    chefMonitoringData,
    chefMonitorPotList,
  } = options;
  const [value] = useAtom(loadableOrderDataAtom);
  const [
    orderDataLastCalled,
    setOrderDataLastCalled,
  ] = useAtom(orderDataLastCalledAtom);
  const { data: orderData } = value;

  const { data: recipeList } = useRecipeData();
  useEffect(
    () => {
      setOrderDataLastCalled(Date.now());
    },
    [
      setOrderDataLastCalled,
      orderRefetchTime,
    ],
  );
  useEffect(
    () => {
      setOrderDataLastCalled(Date.now());
    },
    [
      setOrderDataLastCalled,
      orderKitchenRefetchTime,
    ],
  );

  const orderList = get(
    orderData,
    ['data'],
    [],
  )
    .map((order) => ({
      ...order,
      ...get(
        order,
        [
          'detail',
          'receipt',
        ],
        {},
      ),
    }));

  console.log(
    'KOPO',
    orderData,
  );
  const checkIsEKMenu = (orderItem) => false;
  const checkIsSubMenu = (orderItem) => {
    const name = orderItem.item;

    const isSubMenu = _.some(
      [
        _.startsWith(
          name,
          '+',
        ),
        _.startsWith(
          name,
          '-',
        ),
        _.startsWith(
          name,
          '[',
        ),
        _.startsWith(
          name,
          '아이와',
        ),
        _.startsWith(
          name,
          '한국',
        ),

        _.startsWith(
          name,
          '맵기',
        ),
        _.startsWith(
          name,
          '사이드',
        ),
        _.startsWith(
          name,
          '사이즈',
        ),
        _.startsWith(
          name,
          '음료',
        ),
      ],
      (v) => v === true,
    );
    return isSubMenu;
  };
  console.log(orderList);
  const itemisedOrderList = useMemo(
    () => orderList.reduce(
      (ac, order) => {
        const {
          orderKitchen,
          ...withoutOrderList
        } = order;
        const receipt = get(
          order,
          [
            'detail',
            'receipt',
          ],
          {},
        );
        const orderItems = get(
          receipt,
          ['orderList'],
          [],
        );
        // const group
        // const orderKitchenList =
        const populatedOrderItems = orderItems.map((oi, lineIndex) => {
          const matchingOrderKitchen = _.find(
            orderKitchen,
            (ok) => {
              const isOrderMatch = ok.orderId === withoutOrderList.id;
              const isLineMatch = get(
                ok,
                [
                  'detail',
                  'menu',
                  'item',
                ],
              ) === oi.item;

              return isOrderMatch && isLineMatch;
            },
          );
          const matchingPot = _.find(
            chefMonitoringData,
            { orderKitchenId: matchingOrderKitchen?.id },
          );
          const recipe = _.find(
            recipeList,
            { id: matchingOrderKitchen?.recipeId },
          );
          const matchingPotIsFirst = matchingPot?.id === _.get(
            chefMonitorPotList,
            [
              matchingPot?.cookerId,
              0,
              'id',
            ],
          );
          const okStatus = (matchingOrderKitchen?.status === 'ORDER_WAITING' && !matchingPotIsFirst)
            ? 'ORDER_ACCEPTED'
            : matchingOrderKitchen?.status;
          return {
            ...oi,
            ...receipt,
            ...withoutOrderList,
            isSubMenu: checkIsSubMenu(oi),
            orderId: withoutOrderList.id,
            orderKitchen: matchingOrderKitchen ? {
              ...matchingOrderKitchen,
              status: okStatus,
            } : null,
            cookStation: matchingOrderKitchen ? 'EK' : '-',
            okId: matchingOrderKitchen?.id,
            id: uuidv4(),
            lineIndex,
            pot: matchingPot,
            recipe,
          };
        });
        return [
          ...ac,
          ...populatedOrderItems,
        ];
      },
      [],
    ),
    [
      chefMonitorPotList,
      chefMonitoringData,
      orderList,
      recipeList,
    ],
  );
  console.log({
    orderList,
    itemisedOrderList,
  });
  console.log('RENDERING');
  return {
    data: orderList,
    itemisedOrderList,
    recipeList,
  };
};
