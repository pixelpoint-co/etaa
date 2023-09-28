import styled from 'styled-components';

import Flex from '../../components/atoms/Flex';

import AntDTable from '../../components/organisms/AntDTable';

import useTableData from '../../hooks/useTableData';
import Link from '../../components/atoms/Link';

const Wrapper = styled(Flex)`
  flex: 1;
  flex-direction: column;
`;

const cellRenderers = [
  {
    title: 'Id',
    dataIndex: 'id',
    width: 60,
  },
  {
    title: '자재명',
    dataIndex: 'name',
    width: 120,
    render: (data, row) => (
      <Link to={`/product/edit/${row.id}`} label={data}>{data}</Link>
    ),
  },
  {
    title: '개당 용량',
    dataIndex: 'unitQuantity',
    width: 120,
  },
  {
    title: '계량 단위',
    dataIndex: 'unit',
    width: 120,
  },
];

const Product = () => {
  const {
    onPageChange,
    currentPage,
    pageSize,
    onItemsPerPageChange,
  } = useTableData({
    query: {},
    itemsPerPage: 10,
  });

  return (
    <Wrapper>
      <AntDTable
        modelName="model"
        cellRenderers={cellRenderers}
        data={[]}
        itemsPerPage={pageSize}
        onPageChange={onPageChange}
        onItemsPerPageChange={onItemsPerPageChange}
        currentPage={currentPage}
        count={0}
        rowKey="id"
      />
    </Wrapper>
  );
};

export default Product;
