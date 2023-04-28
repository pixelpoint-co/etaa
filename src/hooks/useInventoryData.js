import {
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
  query FetchInventoryList($offset:Int, $limit:Int) {
    inventoryList (
      offset: $offset,
      limit: $limit,
    ) {
      count
      list {
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
  }
`;

// startDate: String, endDate:String, limit:Int = 25, offset:Int = 0

export default (options = {}) => {
  const {
    limit,
    offset,
  } = options;
  console.log(options);
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
    {
      variables: {
        limit,
        offset,
      },
    },
  ];

  const {
    loading,
    error,
    data,
  } = useQuery(...query);

  // const  = _.get(nodeData, ['inventoryList'], []);
  // }, [])
  // const id = rawId === 'latest' ? moment().format('YYYY-MM-DDD') : rawId;
  console.log(data);
  return {
    data: _.get(data, [
      'inventoryList',
      'list',
    ], []),
    count: _.get(data, [
      'inventoryList',
      'count',
    ], 0),
    loading,
    error,
  };
};
