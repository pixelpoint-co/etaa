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
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
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
import useRecipeData from './useRecipeData';

const pageSizeAtom = atom(50);
const currentPageAtom = atom(0);
const orderDataLastCalledAtom = atom(0);
const orderDataLastReceivedAtom = atom(0);
const orderDataAtom = atom(
  async (getter) => {
    const pageSize = getter(pageSizeAtom);
    const currentPage = getter(currentPageAtom);
    const lastCalled = getter(orderDataLastCalledAtom);
    console.log('CALLING KOPO');
    const response = await global.api.get(
      '/order-item',
      {
        params: {
          limit: pageSize,
          offset: pageSize * currentPage,
        },
      },
    );
    return response;
  },
);
const callApi = async () => {
  const response = await global.api.get(
    '/order-item',
    {
      params: {
        limit: 50,
        offset: 0,
      },
    },
  );
  return response;
};
const orderLastUpdatedAtom = atom(
  (getter) => {
    const data = getter(orderDataAtom);
    if (data) return Date.now();
  },
);
const loadableOrderDataAtom = loadable(orderDataAtom);

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
        sortOrder: 'asc',
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
  const getOrderDataQuery = useQuery({
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
  });
  const { data: resp } = getOrderDataQuery;
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
  console.log(byOrderId);
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
          isSubMenu: !!orderItem.parentId,
          // orderId: orderItem.orderId,
          cookStation: orderItem.orderKitchen ? 'EK' : '-',
          okId: orderItem?.orderKitchen?.id,
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
