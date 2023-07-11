import {
  gql,
  useQuery,
} from '@apollo/client';

const GET_RECIPE = gql`
  query GetRecipes($tags: [Int]) {
    recipes(tags: $tags, limit: 100) {
      id
      name
      detail
      tags
    }
  }
`;

export default (options = { }) => {
  const nodeQuery = [
    GET_RECIPE,
    { variables: { ...options } },
  ];

  const {
    loading,
    error,
    data,
  } = useQuery(...nodeQuery);
  return {
    data: data?.recipes,
    loading,
    error,
  };
};
