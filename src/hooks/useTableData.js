import {
  useState, useCallback,
} from 'react';
import useQueryParams from './useQueryParams';

export default (options = {}) => {
  const { itemsPerPage: initialItemsPerPage = 0 } = options;

  const [
    itemsPerPage,
    setItemsPerPage,
  ] = useState(initialItemsPerPage);

  const {
    queryParams,
    setQueryParams,
  } = useQueryParams({ initialQueryParams: {} });

  const { page = 1 } = queryParams;

  const setCurrentPage = useCallback(
    (newPage) => {
      setQueryParams((old) => ({
        ...old,
        page: newPage,
      }));
    },
    [setQueryParams],
  );

  const onPageChange = useCallback(
    async ({ currentPage: newPage }) => {
      setCurrentPage(newPage);
    },
    [setCurrentPage],
  );

  const onItemsPerPageChange = useCallback(
    async ({ itemsPerPage: currentItemsPerPage }) => {
      setItemsPerPage(currentItemsPerPage);
    },
    [setItemsPerPage],
  );

  return {
    onPageChange,
    currentPage: page,
    pageSize: itemsPerPage,
    onItemsPerPageChange,
  };
};
