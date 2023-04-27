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
  query FetchPurchaseList($offset:Int) {
    productList (
      offset: $offset,
    ) {
      id
      name
      unit
      recipeId
      created
      updated
    }
  }
`;
const FETCH_INGREDIENT_LIST = gql`
  query FetchProcessIngredientList($offset:Int) {
    processIngredientList (
      offset: $offset,
    ) {
      id
      amount
      startVertexId
      endVertexId
      created
      updated
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
  const nodeQuery = [
    FETCH_PRODUCT_LIST,
    {},
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

  const productListData = _.get(nodeData, ['productList'], []);
  const ingredientListData = _.get(edgeData, ['processIngredientList'], []);
  // }, [])
  // const id = rawId === 'latest' ? moment().format('YYYY-MM-DDD') : rawId;

  return {
    productListData,
    ingredientListData,
    loading: nodeLoading || edgeLoading,
    error: nodeError || edgeError,
  };
};
