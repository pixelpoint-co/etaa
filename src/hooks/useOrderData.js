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
  useQuery,
} from '@tanstack/react-query';

import _, {
  get,
  uniqBy,
} from 'lodash';

import {
  atom, useAtom,
  setAtom,
} from 'jotai';
import {
  loadable, selectAtom,
} from 'jotai/utils';
import { socket } from '../services/socket';
import useRecipeData from './useRecipeData';

const orderQueryFn = ({ queryKey }) => {
  const [
    _key,
    {
      pageSize,
      currentPage,
    },
  ] = queryKey;
  return global.api.get(
    '/order-item',
    {
      params: {
        limit: pageSize,
        offset: pageSize * currentPage,
        sortOrder: 'desc',
      },
    },
  );
};

export default (options = {}) => {
  const {
    orderKitchenRefetchTime = 0,
    orderRefetchTime = 0,
    chefMonitoringData,
    chefMonitorPotList,
  } = options;

  const { data: recipeList } = useRecipeData();
  const getOrderDataQuery = useQuery(
    {
      queryKey: [
        'order-item',
        {
          pageSize: 200,
          currentPage: 0,
          orderRefetchTime,
          orderKitchenRefetchTime,
        },
      ],
      queryFn: orderQueryFn,
      // refetchInterval: 2 * 1000,
    },
  );
  const {
    data: resp,
    refetch,
  } = getOrderDataQuery;
  useEffect(
    () => {
      function onMessageEvent(value) {
        refetch();
      }

      socket.on(
        'order',
        onMessageEvent,
      );

      return () => {
        socket.off(
          'order',
          onMessageEvent,
        );
      };
    },
    [refetch],
  );
  const orderItemList = _.get(
    resp,
    ['data'],
    [],
  );
  // useEffect(
  //   () => {
  //     fetchOrder();
  //   },
  //   [
  //     fetchOrder,
  //     orderRefetchTime,
  //     orderKitchenRefetchTime,
  //   ],
  // );
  const byOrderId = _.groupBy(
    orderItemList,
    'orderId',
  );
  const itemisedOrderList = useMemo(
    () => orderItemList.map(
      (orderItem) => {
        const {
          orderKitchen,
          ...withoutOrderList
        } = orderItem;
        const order = get(
          orderItem,
          ['order'],
          {},
        );
        const lineIndex = _.findIndex(
          byOrderId[orderItem.orderId],
          { id: orderItem.id },
        );
        const recipe = _.find(
          recipeList,
          { id: orderKitchen?.recipeId },
        );
        return {
          ...order,
          ...orderItem,
          orderKitchen,
          isSubMenu: !!orderItem.parentId,
          // orderId: orderItem.orderId,
          cookStation: orderKitchen ? 'EK' : '-',
          okId: orderKitchen?.id,
          lineIndex,
          // pot: matchingPot,
          recipe,
        };
      },
    ),
    [
      orderItemList,
      recipeList,
    ],
  );

  const orderList = _.map(
    byOrderId,
    (oiList) => {
      const { order } = oiList[0];
      return {
        ...order,
        orderItem: oiList,
      };
    },
  );
  console.log({
    orderList,
    orderItemList,
    itemisedOrderList,
  });
  return {
    data: orderList,
    itemisedOrderList,
    recipeList,
  };
};
