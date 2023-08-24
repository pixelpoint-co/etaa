import { useQuery } from '@tanstack/react-query';
import _ from 'lodash';

export default (options = { }) => {
  const recipeQueryFn = ({ queryKey }) => {
    const [_key] = queryKey;
    return global.api.get(
      '/recipe',
      { params: { limit: 100 } },
    );
  };
  const getRecipeDataQuery = useQuery({
    queryKey: [
      'recipe',
      {},
    ],
    queryFn: recipeQueryFn,
  });
  const { data: responseData } = getRecipeDataQuery;
  const data = _.get(
    responseData,
    ['data'],
    [],
  );
  const filteredData = data.filter((d) => d.viewable);
  return { data: filteredData };
};
