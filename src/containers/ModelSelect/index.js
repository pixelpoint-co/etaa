import {
  useMutation, useQuery,
} from '@apollo/client';
import Select from '../../components/molecules/Select';

const ModelSelect = (props) => {
  const {
    query,
    queryOptions = {},
    addItemQuery,
    mapDataToItems,
    ...others
  } = props;
  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery(
    query,
    { variables: queryOptions },
  );

  const addItemCompleted = () => {
    refetch();
  };

  const [
    addItem,
    {
      loading: addItemLoading,
      error: addItemError,
    },
  ] = useMutation(
    addItemQuery,
    { onCompleted: addItemCompleted },
  );

  if (loading) return 'loading';
  const items = mapDataToItems(data);

  return (
    <Select
      {...others}
      allowAddItem
      onAddItem={(item) => {
        addItem({ variables: { name: item } });
      }}
      loading={loading}
      items={items}
    />
  );
};

export default ModelSelect;
