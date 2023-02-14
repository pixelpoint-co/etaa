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
    id: rawId = 'latest',
    created,
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

  // const fetchPurchase = useCallback(async ({ id, created }) => {
  const {
    loading: qLoading,
    error: qError,
    data: qData,
  } = useQuery(FETCH_PURCHASE, {
    variables: {
      // id: 123,
      // startDate: '2023-02-10',
      created: '2023-02-10',
    },
  });
  console.log('qData: ', qData);
  const purchaseData = _.get(qData, [
    'fetchPurchase',
    'purchase',
    'detail',
  ], []);
  const inventoryData = _.get(qData, [
    'fetchPurchase',
    'inventoryList',
    'detail',
  ], []);
  // }, [])
  const id = rawId === 'latest' ? moment().format('YYYY-MM-DDD') : rawId;
  console.log('purchaseData: ', purchaseData);
  // const getPurchaseData = useCallback(async () => {
  //   await waitMs(1000);
  //   setData(defaultData);
  //   setLoading(false);
  //   setError(null);
  // }, []);

  // useEffect(() => {
  //   getPurchaseData(id);
  // }, [
  //   id,
  //   getPurchaseData,
  // ]);
  // useEffect(() => {
  //   getPurchaseData(id);
  // }, []);
  console.log();
  return {
    pId: _.get(qData, [
      'fetchPurchase',
      'purchase',
      'id',
    ], null),
    data: purchaseData,
    inventoryData,
    loading: qLoading,
    error: qError,
  };
};
