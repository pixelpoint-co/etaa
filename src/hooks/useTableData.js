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
  } = useQueryParams();

  const { currentPage = 1 } = queryParams;

  const setCurrentPage = useCallback((newPage) => {
    setQueryParams((old) => ({
      ...old,
      currentPage: newPage,
    }));
  }, [setQueryParams]);

  const onPageChange = useCallback(async ({ currentPage: newPage }) => {
    setCurrentPage(newPage);
  }, [setCurrentPage]);

  const onItemsPerPageChange = useCallback(async ({ itemsPerPage: currentItemsPerPage }) => {
    setItemsPerPage(currentItemsPerPage);
  }, [setItemsPerPage]);

  return {
    onPageChange,
    currentPage,
    pageSize: itemsPerPage,
    onItemsPerPageChange,
  };
};
