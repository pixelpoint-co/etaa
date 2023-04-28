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

const FETCH_INVENTORY_LIST = gql`
  query FetchInventoryList($offset:Int) {
    inventoryList (
      offset: $offset,
    ) {
      id
      productId
      name
      amount
      unitPrice
      parentId
      created
      unitWeight
      unitQuantity
      product {
        id
        unit
        name
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
  // const [
  //   loading,
  //   setLoading,
  // ] = useState(true);
  // const [
  //   data,
  //   setData,
  // ] = useState(null);
  // const [
  //   error,
  //   setError,
  // ] = useState(null);

  const query = [
    FETCH_INVENTORY_LIST,
    {},
  ];

  const {
    loading,
    error,
    data,
  } = useQuery(...query);

  // const  = _.get(nodeData, ['inventoryList'], []);
  // }, [])
  // const id = rawId === 'latest' ? moment().format('YYYY-MM-DDD') : rawId;

  return {
    data: _.get(data, ['inventoryList'], []),
    loading,
    error,
  };
};
