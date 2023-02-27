import {
  useEffect,
  useCallback,
  useState,
} from 'react';
import moment from 'moment';
import _ from 'lodash';
import {
  gql,
  useQuery,
} from '@apollo/client';

import defaultData from './default-data.json';

const waitMs = async (ms = 0) => {
  return new Promise((resolve /* reject */) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

const FETCH_PURCHASE = gql`
  query FetchPurchase($id: Int, $created: String) {
    purchase (id: $id, created: $created)
    {
      id
      created
      detail
      account
      inventory {
        id
        productId
        name
        amount
        unitPrice
        unitWeight
        unitQuantity
      }
    }
  }
`;
const FETCH_PURCHASE_LIST = gql`
  query FetchPurchaseList($id: Int, $startDate: String, $endDate: String, $limit: Int, $offset:Int, $orderBy: JSON = {}) {
    purchaseList (
      id: $id,
      startDate: $startDate,
      endDate: $endDate,
      limit: $limit,
      offset: $offset,
      orderBy: $orderBy,
    ) {
      id
      created
      detail
      account
      inventory {
        id
        productId
        name
        amount
        unitPrice
        unitWeight
        unitQuantity
      }
    }
  }
`;

// startDate: String, endDate:String, limit:Int = 25, offset:Int = 0

export default (options = {}) => {
  const {
    type = 'many',
    id = 'latest',
    created,
    startDate,
    endDate,
  } = options;
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
  console.log(id);
  console.log(id != null);
  const query = (type === 'many')
    ? [
      FETCH_PURCHASE_LIST,
      {
        variables: {
          ...(
            id != null
              ? { id: Number(id) }
              : {
                startDate,
                endDate,
              }
          ),
        },
      },
    ]
    : [
      FETCH_PURCHASE,
      {
        variables: {
          created: created || '2023-02-15',
          ...(
            id != null
              ? { id: Number(id) }
              : {}
          ),
        },
      },
    ];

  const {
    loading: qLoading,
    error: qError,
    data: qData,
  } = useQuery(...query);
  console.log('qData: ', qData);
  const purchaseData = _.get(qData, ['purchase'], []);
  const purchaseListData = _.get(qData, ['purchaseList'], []);
  // }, [])
  // const id = rawId === 'latest' ? moment().format('YYYY-MM-DDD') : rawId;

  return {
    pId: _.get(qData, [
      'fetchPurchase',
      'purchase',
      'id',
    ], null),
    purchaseData,
    purchaseListData,
    loading: qLoading,
    error: qError,
  };
};
