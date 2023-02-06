import {
  useEffect,
  useCallback,
  useState,
} from 'react';
import moment from 'moment';

import defaultData from './default-data.json';

const waitMs = async (ms = 0) => {
  return new Promise((resolve /* reject */) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

export default (options = { id: 'latest' }) => {
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

  const { id: rawId } = options;
  const id = rawId === 'latest' ? moment().format('YYYY-MM-DDD') : rawId;

  const getOrderData = useCallback(async () => {
    await waitMs(1000);
    setData(defaultData);
    setLoading(false);
    setError(null);
  }, []);

  useEffect(() => {
    getOrderData(id);
  }, [
    id,
    getOrderData,
  ]);
  useEffect(() => {
    getOrderData(id);
  }, []);
  return {
    data,
    loading,
    error,
  };
};
