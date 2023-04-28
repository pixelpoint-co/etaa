import styled from 'styled-components';

import Flex from '../../components/atoms/Flex';

import AntDTable from '../../components/organisms/AntDTable';

import useProductData from '../../hooks/useProductData';
import useTableData from '../../hooks/useTableData';

const Wrapper = styled(Flex)`
  flex: 1;
  flex-direction: column;
  max-height: 500px;
`;

const cellRenderers = [
  {
    title: 'Id',
    dataIndex: 'id',
    width: 60,
  },
  {
    title: '재료명',
    dataIndex: 'name',
    width: 120,
  },
  {
    title: '계량 단위',
    dataIndex: 'unit',
    width: 120,
  },
];

const Ingredient = () => {
  const {
    onPageChange,
    currentPage,
    pageSize,
    onItemsPerPageChange,
  } = useTableData({
    query: {},
    itemsPerPage: 10,
  });

  const {
    productListData: data,
    productListCount: count,
    loading,
    error,
  } = useProductData({
    limit: pageSize,
    offset: (pageSize * (currentPage - 1)) || 0,
  });

  return (
    <Wrapper>
      <AntDTable
        modelName="model"
        cellRenderers={cellRenderers}
        data={data}
        itemsPerPage={pageSize}
        onPageChange={onPageChange}
        onItemsPerPageChange={onItemsPerPageChange}
        currentPage={currentPage}
        count={count}
        rowKey="id"
      />
    </Wrapper>
  );
};

export default Ingredient;
