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
  toast,
} from 'react-toastify';

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

const usePotController = (cookerId, opts = {}) => {
  const [
    orderList,
    setOrderList,
  ] = useState([]);

  const handleSubscriptionData = (data) => {
    console.log(
      'order subscription: ',
      data,
    );
  };

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
      console.log(
        'initial waiter sub load: ',
        initialWaiterSubscription,
      );
      if (initialWaiterSubscription) {
        handleSubscriptionData({ data: initialWaiterSubscription });
      }
    },
    [initialWaiterSubscription],
  );

  const orderTimestamp = get(
    subscriptionData,
    [
      'data',
      'waiterSubscription',
      'orderKitchen',
      'timeStamp',
    ],
    0,
  );

  useEffect(
    () => {
      if (orderTimestamp === 0) return;

      const orderData = get(
        subscriptionData,
        [
          'data',
          'waiterSubscription',
          'orderKitchen',
        ],
      );
      setOrderList(orderData);
      toast(JSON.stringify(orderData));
    },
    [orderTimestamp],
  );
  console.log(
    'order order subscription',
    orderList,
  );
  return { orderList };
};
export default usePotController;
