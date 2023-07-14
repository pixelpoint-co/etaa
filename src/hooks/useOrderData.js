import {
  useEffect,
  useCallback,
  useState,
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

import useRecipeData from './useRecipeData';

const GET_ORDER = gql`
  query orders($id: Int, $limit: Int) {
    orders(id: $id, limit: $limit) {
      id
      outsideId
      created
      description
      detail
    }
  }
`;

const GET_ORDER_KITCHEN = gql`
  query orderKitchen($limit: Int) {
    orderKitchen(limit: $limit) {
      id
      orderId
      recipeId
      status
      detail
    }
  }
`;

const waitMs = async (ms = 0) => {
  return new Promise((resolve /* reject */) => {
    setTimeout(
      () => {
        resolve();
      },
      ms,
    );
  });
};

export default (options = {}) => {
  const {
    orderKitchenRefetchTime = 0,
    orderRefetchTime = 0,
  } = options;
  const { data: recipeList } = useRecipeData();
  const {
    loading,
    error,
    data,
    refetch,
  } = useQuery(
    GET_ORDER,
    {
      variables: {
        // createdGte: moment()
        //   .startOf('day')
        //   .subtract(
        //     168,
        //     'hours',
        //   )
        //   .add(
        //     10,
        //     'hours',
        //   )
        //   .toDate(),
        limit: 100,
      },
    },
  );
  const {
    loading: orderKitchenLoading,
    error: orderKitchenError,
    data: orderKitchenData,
    refetch: fetchOrderKitchen,
  } = useQuery(
    GET_ORDER_KITCHEN,
    { variables: { limit: 100 } },
  );
  useEffect(
    () => {
      refetch();
    },
    [
      refetch,
      orderRefetchTime,
    ],
  );
  useEffect(
    () => {
      fetchOrderKitchen();
    },
    [
      fetchOrderKitchen,
      orderKitchenRefetchTime,
    ],
  );

  const orders = get(
    data,
    'orders',
    [],
  );

  const orderList = uniqBy(
    orders.map((order) => {
      return {
        ...order,
        ...get(
          order,
          [
            'detail',
            'receipt',
          ],
          {},
        ),
      };
    }).filter((order) => order.isCancel === false),
    'orderNoUnique',
  );

  const checkIsEKMenu = (orderItem) => {
    return false;
  };
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
          '매운',
        ),
        _.endsWith(
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
        // _.endsWith(
        //   name,
        //   ')',
        // ),
      ],
      (v) => v === true,
    );
    return isSubMenu;
  };
  // const itemisedOrderList = orderList.map((order) => {
  //   const {
  //     orderList: orderItems,
  //     ...withoutOrderList
  //   } = order;
  //   const groupedOrderItems = orderItems.reduce(
  //     (ac, orderItem) => {

  //     },
  //     [],
  //   )
  // })
  // console.log(
  //   'orderKitchenData: ',
  //   orderKitchenData,
  //   orderList,
  // );
  console.log(orderList);
  const itemisedOrderList = orderList.reduce(
    (ac, order) => {
      const {
        orderList: orderItems,
        ...withoutOrderList
      } = order;

      // const group
      const populatedOrderItems = orderItems.map((oi) => {
        const orderKitchen = _.find(
          get(
            orderKitchenData,
            'orderKitchen',
            [],
          ),
          (ok) => {
            const isOrderMatch = ok.orderId === withoutOrderList.id;
            const isLineMatch = get(
              ok,
              'detail.menu.item',
            ) === oi.item;

            return isOrderMatch && isLineMatch;
          },
        );
        return {
          ...oi,
          ...withoutOrderList,
          isSubMenu: checkIsSubMenu(oi),
          orderId: withoutOrderList.id,
          orderKitchen,
          cookStation: orderKitchen ? '에이트키친' : '-',
          id: uuidv4(),
          // id: withoutOrderList.id + oi.item + (checkIsSubMenu(oi) ? 'sub' : 'main'), // psudo unqiue

        };
      });
      return [
        ...ac,
        ...populatedOrderItems,
      ];
    },
    [],
  );

  return {
    data: orderList,
    itemisedOrderList,
    loading,
    error,
    refetch,
  };
};
