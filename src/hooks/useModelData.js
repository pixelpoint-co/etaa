import {
  useEffect,
  useCallback,
  useState,
} from 'react';
import moment from 'moment';
import {
  useQuery,
} from '@apollo/client';

// const FETCH_INVENTORY_LIST = gql`
//   query FetchInventoryList($offset:Int, $limit:Int) {
//     inventoryList (
//       offset: $offset,
//       limit: $limit,
//     ) {
//       count
//       list {
//         id
//         productId
//         name
//         amount
//         unitPrice
//         parentId
//         created
//         unitWeight
//         unitQuantity
//         product {
//           id
//           unit
//           name
//         }
//       }
//     }
//   }
// `;

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

export default (
  gQuery,
  options = { id: 'latest' },
) => {
  const [
    loading,
    setLoading,
  ] = useState(true);
  const [
    data,
    setData,
  ] = useState(null);
  const [
    error,
    setError,
  ] = useState(null);

  const nodeQuery = [
    gQuery,
    { variables: { ...options } },
  ];

  const {
    loading: nodeLoading,
    error: nodeError,
    data: nodeData,
  } = useQuery(...nodeQuery);

  const { id: rawId } = options;
  const id = rawId === 'latest' ? moment().format('YYYY-MM-DDD') : rawId;

  const getOrderData = useCallback(
    async () => {
      await waitMs(1000);
      setData(defaultData);
      setLoading(false);
      setError(null);
    },
    [],
  );

  useEffect(
    () => {
      getOrderData(id);
    },
    [
      id,
      getOrderData,
    ],
  );
  useEffect(
    () => {
      getOrderData(id);
    },
    [],
  );
  return {
    data,
    loading,
    error,
  };
};
