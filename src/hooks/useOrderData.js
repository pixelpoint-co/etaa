import {
  useEffect,
  useCallback,
  useState,
} from 'react';
import moment from 'moment';
import {
  gql, useQuery,
} from '@apollo/client';

import _, {
  get,
} from 'lodash';

import useRecipeData from './useRecipeData';

const GET_ORDER = gql`
  query orders($id: Int, $limit: Int, $createdGte: String) {
    orders(id: $id, limit: $limit, createdGte: $createdGte) {
      id
      created
      description
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
        createdGte: moment()
          .startOf('day')
          .subtract(
            48,
            'hours',
          )
          .add(
            10,
            'hours',
          )
          .toDate(),
        limit: 999,
      },
    },
  );
  const orders = get(
    data,
    'orders',
    [],
  );
  const orderList = orders.map((order) => {
    return {
      id: order.id,
      ...get(
        order,
        [
          'detail',
          'receipt',
        ],
        {},
      ),
    };
  });

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
        _.endsWith(
          name,
          ')',
        ),
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

  const itemisedOrderList = orderList.reduce(
    (ac, order) => {
      const {
        orderList: orderItems,
        ...withoutOrderList
      } = order;

      // const group
      const populatedOrderItems = orderItems.map((oi) => {
        const selectedRecipe = _.find(
          recipeList,
          (recipe) => oi.item.split(' ').join('')
            .includes(_.trim(
              recipe.name,
              [
                'L',
                'R',
                'l',
                'r',
                ' ',
              ],
            )),
        );
        return {
          ...oi,
          ...withoutOrderList,
          isSubMenu: checkIsSubMenu(oi),
          id: withoutOrderList.id + oi.item + (checkIsSubMenu(oi) ? 'sub' : 'main'), // psudo unqiue
          recipe: selectedRecipe,
          cookStation: selectedRecipe ? '에이트키친' : '-',
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
