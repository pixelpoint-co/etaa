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

const FETCH_PRODUCT_LIST = gql`
  query FetchPurchaseList($offset:Int, $limit:Int, $keyword:String) {
    productList (
      offset: $offset,
      limit: $limit,
      keyword: $keyword,
    ) {
      count
      list {
        id
        name
        unit
        recipeId
        created
        updated
        inventorySum
        inventory {
          id
          productId
          name
          amount
          unitPrice
          parentId
          created
          unitWeight
          unitQuantity
        }
      }
    }
  }
`;
const FETCH_INGREDIENT_LIST = gql`
  query FetchProcessIngredientList($offset:Int, $limit:Int) {
    processIngredientList (
      offset: $offset,
      limit: $limit,
    ) {
      count
      list {
        id
        amount
        startVertexId
        endVertexId
        created
        updated
      }
    }
  }
`;

// startDate: String, endDate:String, limit:Int = 25, offset:Int = 0

export default (options = {}) => {
  const {
    type = 'many',
    id = 'latest',
    limit,
    offset,
    created,
    startDate,
    endDate,
  } = options;
  const [
    keyword,
    setKeyword,
  ] = useState('');
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
  const nodeQuery = [
    FETCH_PRODUCT_LIST,
    {
      variables: {
        limit,
        offset,
        keyword,
      },
    },
  ];
  const edgeQuery = [
    FETCH_INGREDIENT_LIST,
    {},
  ];
  const {
    loading: nodeLoading,
    error: nodeError,
    data: nodeData,
  } = useQuery(...nodeQuery);
  const {
    loading: edgeLoading,
    error: edgeError,
    data: edgeData,
  } = useQuery(...edgeQuery);

  const productListData = _.get(
    nodeData,
    [
      'productList',
      'list',
    ],
    [],
  );
  const productListCount = _.get(
    nodeData,
    [
      'productList',
      'count',
    ],
    0,
  );
  const ingredientListData = _.get(
    edgeData,
    [
      'processIngredientList',
      'list',
    ],
    [],
  );
  const ingredientListCount = _.get(
    edgeData,
    [
      'processIngredientList',
      'count',
    ],
    0,
  );
  // }, [])
  // const id = rawId === 'latest' ? moment().format('YYYY-MM-DDD') : rawId;

  return {
    productListData,
    productListCount,
    ingredientListData,
    ingredientListCount,
    loading: nodeLoading || edgeLoading,
    error: nodeError || edgeError,
    keyword,
    setKeyword,
  };
};
