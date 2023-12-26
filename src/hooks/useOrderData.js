import {
  useEffect,
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
} from 'lodash';

import { socket } from '../services/socket';
import useRecipeData from './useRecipeData';
import { getMachineUrl } from './usePotController';

const orderQueryFn = ({ queryKey }) => {
  const [_key] = queryKey;
  const pageSize = 200;
  const currentPage = 0;
  const sortOrder = 'desc';
  const maxOrderStatus = 99;
  console.log(_key);
  return global.api.get(
    '/order-item',
    {
      params: {
        limit: pageSize,
        offset: pageSize * currentPage,
        maxOrderStatus,
        sortOrder,
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
    sortOrder = 'desc',
    maxOrderStatus,
  } = options;

  const { data: recipeList } = useRecipeData();
  console.log({
    orderRefetchTime,
    orderKitchenRefetchTime,
  });
  const getOrderDataQuery = useQuery(
    {
      queryKey: ['order-item'],
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
        console.log(value);
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
  const orderedOrderId = _.uniq(orderItemList.map((v) => v.orderId));
  const orderList = _.map(
    orderedOrderId,
    (oid) => {
      const oiList = byOrderId[oid];
      const { order } = oiList[0];
      return {
        ...order,
        orderItem: oiList,
      };
    },
  );

  const completeOrder = (orderId) => {
    global.api.put(
      `${getMachineUrl(0)}/order/${orderId}/complete`,
    );
  };
  return {
    data: orderList,
    itemisedOrderList,
    recipeList,
    completeOrder,
  };
};
