import PropTypes from 'prop-types';
import {
  useCallback,
} from 'react';
import {
  Formik, useField, Form,
} from 'formik';

import {
  palette, size,
} from 'styled-theme';
import styled from 'styled-components';
import moment from 'moment';
import _, {
  get,
} from 'lodash';
import {
  gql, useMutation,
} from '@apollo/client';

import Flex from '../../components/atoms/Flex';
import Button from '../../components/atoms/Button';
import Card from '../../components/atoms/Card';
import Link from '../../components/atoms/Link';

import PurchaseRow from '../../components/organisms/PurchaseRow';
import AntDTable from '../../components/organisms/AntDTable';
import Cell from '../../components/atoms/AntDTableCell';

import useInventoryData from '../../hooks/useInventoryData';
import useQueryParams from '../../hooks/useQueryParams';
import {
  formatCurrency,
  formatNumber,
} from '../../services/number';
import useProductData from '../../hooks/useProductData';
import useOrderData from '../../hooks/useOrderData';
import SearchBar from '../../components/organisms/SearchBar';
import useOrderAlert from '../../hooks/useOrderAlert';
import TooltipMask from '../../components/molecules/TooltipMask';

const Wrapper = styled(Flex)`
  flex: 1;
  flex-direction: column;
  flex-basis: 100%;
  flex-grow: 0;
  overflow: auto;
`;
const SearchContainer = styled(Flex)`
  margin-bottom: 20px;
  flex: 0;
`;
const TableContainer = styled(Flex)`
`;
const StyledButton = styled(Button)`
  min-width: 120px;
  padding: 10px;
`;

const OrderMonitor = (props) => {
  const {
    filterCell,
    pageSize = 20,
    pickCellRenderers,
    selectRecipe,
    onClickOrder,
    selectedChannelNo,
    ...others
  } = props;
  const {
    queryParams,
    setQueryParams,
  } = useQueryParams({ initialQueryParams: { page: 1 } });
  const { onAlert } = useOrderAlert();

  const {
    // data,
    // count,
    data,
    itemisedOrderList,
    // orderListCount: count,
    loading,
    error,
    refetch,
  } = useOrderData({
    limit: pageSize,
    offset: (queryParams.pageSize * (queryParams.page - 1)) || 0,
  });
  const count = data.length;
  const { page: currentPage } = queryParams;

  const onPageChange = useCallback(
    async ({ currentPage: newPage }) => {
      setQueryParams((prev) => ({
        ...prev,
        page: newPage,
      }));
    },
    [setQueryParams],
  );

  const cellRenderers = [
    // {
    //   title: 'ids',
    //   dataIndex: 'id',
    //   width: 100,
    //   render: (data, row) => {
    //     if (row.isSubMenu) return null;
    //     return <Cell>{data || row.id}</Cell>;
    //   },
    // },
    {
      title: 'id',
      dataIndex: 'id',
      width: 100,
      render: (data, row) => {
        if (row.isSubMenu) return null;
        return <Cell>{data || row.orderId}</Cell>;
      },
    },
    // {
    //   title: 'outsideId',
    //   dataIndex: 'outsideId',
    //   width: 100,
    //   render: (data, row) => {
    //     console.log(row);
    //     return <Cell>{data}</Cell>;
    //   },
    // },
    {
      title: '채널번호',
      dataIndex: 'channelNo',
      width: 130,
      render: (data, row) => <Cell>{data}</Cell>,
    },
    {
      title: '주문번호',
      dataIndex: 'orderNo',
      width: 150,
      render: (data, row) => {
        if (row.isSubMenu) return null;
        return <Cell>{data || row.orderNo}</Cell>;
      },
    },
    {
      title: '플랫폼',
      dataIndex: 'orderPlatform',
      width: 80,
      render: (data, row) => <Cell>{data}</Cell>,
    },
    {
      title: '주문시간',
      dataIndex: 'dateTimeISO',
      width: 100,
      render: (data, row) => (
        <Cell>
          {moment(data)
            .format('HH:mm')}
        </Cell>
      ),
    },
    {
      title: '메뉴',
      dataIndex: 'item',
      render: (data, row) => <Cell>{data}</Cell>
      ,
    },
    {
      title: '수량',
      dataIndex: 'qty',
      width: 60,
      render: (data, row) => {
        if (row.isSubMenu) return null;
        return <Cell>{data}</Cell>;
      },
    },
    {
      title: '고객요청',
      dataIndex: 'requestCustomer',
      render: (data, row) => {
        if (row.isSubMenu) return null;
        return <Cell>{data}</Cell>;
      },
    },
    {
      title: '조리담당',
      dataIndex: 'cookStation',
      width: 140,
      render: (data) => <Cell>{data}</Cell>,
    },
    {
      title: '조리상태',
      dataIndex: null,
      width: 140,
    },
    {
      title: '',
      dataIndex: 'action',
      width: 120,
      render: (data, row) => {
        const hasOrderKitchen = row.orderKitchen;
        const isSelected = row.channelNo === selectedChannelNo;
        return (
          <Cell style={{
            marginTop: -12,
            marginBottom: -12,
          }}
          >
            {hasOrderKitchen ? (
              <StyledButton
                themeType="outline"
                palette="grayscale"
                tone={isSelected ? 4 : 0}
                onClick={() => {
                  onClickOrder(row.orderKitchen);
                }}
              >
                선택
              </StyledButton>
            ) : null}
          </Cell>
        );
      },
    },
  ];
  return (
    <Wrapper>
      {/* <SearchContainer>
        <SearchBar
          label="검색"
          icon="search"
        // onSubmit={(searchKey) => {
        //   setKeyword(searchKey);
        // }}
        />
      </SearchContainer> */}
      <TableContainer>
        <AntDTable
          modelName="model"
          cellRenderers={pickCellRenderers(cellRenderers)}
          data={
            itemisedOrderList
            // _.uniqBy(
            //     .filter((io) => !io.isSubMenu && !!io.orderKitchen),
            //   'orderNo',
            // )
          }
          itemsPerPage={pageSize}
          onPageChange={onPageChange}
          currentPage={currentPage}
          count={count}
          rowKey="id"
        />
      </TableContainer>
    </Wrapper>
  );
};

OrderMonitor.defaultProps = {
  pickCellRenderers: (v) => v,
  pageSize: 20,
};

OrderMonitor.propTypes = {
  pickCellRenderers: PropTypes.func,
  pageSize: PropTypes.number,
};
export default OrderMonitor;
