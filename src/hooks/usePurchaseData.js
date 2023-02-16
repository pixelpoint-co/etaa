import {
  useEffect,
  useCallback,
  useState,
} from 'react';
import moment from 'moment';
import _ from 'lodash';
import {
  gql, useQuery,
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
  }
`;

const FETCH_PURCHASE_LIST = gql`
  query FetchPurchaseList($startDate: String, $endDate: String, $limit: Int, $offset:Int) {
    purchaseList (
      startDate: $startDate,
      endDate: $endDate,
      limit: $limit,
      offset: $offset,
    )
  }
`;

// startDate: String, endDate:String, limit:Int = 25, offset:Int = 0

export default (options = {}) => {
  const {
    type = 'many',
    id: rawId = 'latest',
    created,
    startDate,
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

  const query = type === 'many'
    ? [
      FETCH_PURCHASE_LIST,
      { variables: { startDate: startDate || '2023-02-10' } },
    ]
    : [
      FETCH_PURCHASE,
      { variables: { created: created || '2023-02-15' } },
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
  const id = rawId === 'latest' ? moment().format('YYYY-MM-DDD') : rawId;

  // useEffect(() => {
  //   getPurchaseData(id);
  // }, [
  //   id,
  //   getPurchaseData,
  // ]);
  // useEffect(() => {
  //   getPurchaseData(id);
  // }, []);
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
