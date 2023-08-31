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
import hexToRgba from 'hex-to-rgba';
import styled from 'styled-components';
import moment from 'moment';
import _, {
  get,
} from 'lodash';
import {
  gql, useMutation,
} from '@apollo/client';
import theme from '../../theme';

import Flex from '../../components/atoms/Flex';
import Button from '../../components/atoms/Button';
import Card from '../../components/atoms/Card';
import Link from '../../components/atoms/Link';
import DiffText from '../../components/molecules/DiffText';

import PurchaseRow from '../../components/organisms/PurchaseRow';
import AntDTable from '../../components/organisms/AntDTable';
import Cell from '../../components/atoms/AntDTableCell';

import useInventoryData from '../../hooks/useInventoryData';
import useQueryParams from '../../hooks/useQueryParams';
import {
  formatCurrency,
  formatNumber,
} from '../../services/number';

import PlatformImage from '../../components/atoms/PlatformImage';

import useProductData from '../../hooks/useProductData';
import useOrderData from '../../hooks/useOrderData';
import SearchBar from '../../components/organisms/SearchBar';
import useOrderAlert from '../../hooks/useOrderAlert';
import usePotController from '../../hooks/usePotController';

const Wrapper = styled(Flex)`
  flex: 1;
  flex-direction: column;
`;

const TableContainer = styled(Flex)`
`;

const StyledAntDTable = styled(AntDTable)`

`;

const StyledCell = styled(Cell)`
  font-size : 22px;
`;
const DiffCell = styled(StyledCell)`
  font-size :20px;
  margin : -3px 0px;
  padding : 4px 12px;
  border-radius : 18px;
  color: ${({ color }) => (
    // eslint-disable-next-line no-nested-ternary
    (color === 'green'
      ? hexToRgba(
        '#8DC53C',
        1,
      // eslint-disable-next-line no-nested-ternary
      ) : (color === 'yellow'
        ? hexToRgba(
          theme.palette.yellow[0],
          1,
        ) : color
      )
    )

  )};
  background-color: ${({ color }) => (
    // eslint-disable-next-line no-nested-ternary
    (color === 'green'
      ? hexToRgba(
        '#e8f3d8',
        1,
        // eslint-disable-next-line no-nested-ternary
      ) : (color === 'blue'
        ? hexToRgba(
          theme.palette.blue[0],
          0.1,
          // eslint-disable-next-line no-nested-ternary
        ) : (color === 'red'
          ? hexToRgba(
            theme.palette.red[0],
            0.1,
          )
        // eslint-disable-next-line no-nested-ternary
          : (color === 'yellow'
            ? hexToRgba(
              theme.palette.yellow[0],
              0.1,
            )
            : hexToRgba(
              theme.palette.grayscale[0],
              0.1,
            )
          ))
      )
    )
  )};
`;

const orderButtonProps = {
  ORDER_IN: { // 주문 승인 대기
    label: '승인대기',
    disabled: true,
    palette: 'green',
  },
  ORDER_ACCEPTED: { // 주문 승인
    label: '주문접수',
    palette: 'green',
    disabled: false,
  },
  ORDER_WAITING: { // 조리 대기
    label: '조리준비',
    disabled: false,
    palette: 'yellow',
  },
  ORDER_COOKING: { // 조리중
    label: '조리',
    disabled: true,
    palette: 'red',
  },
  ORDER_COOKED: { // 조리끝
    label: '완료',
    disabled: true,
  },
};

const OrderMonitor = (props) => {
  const {
    filterCell,
    pageSize = 5,
    pickCellRenderers,
    selectRecipe,
    ...others
  } = props;
  const {
    queryParams,
    setQueryParams,
  } = useQueryParams({ initialQueryParams: { page: 1 } });
  const { onAlert } = useOrderAlert();
  const potController = usePotController(1); // TODO 선택 안해야함
  const {
    orderRefetchTime,
    orderKitchenRefetchTime,
  } = potController;
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
    orderRefetchTime,
    orderKitchenRefetchTime,
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

  const filteringItemisedOrderList = itemisedOrderList
    // .filter((io) => (io.item !== '배달비'));
    // .filter((io) => (io.isSubMenu === false))
    .filter((io) => io.item !== '배달비');
  // .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
  // .reverse();

  const cellRenderers = [

    {
      title: '채널번호',
      dataIndex: 'channelNo',

      render: (data, row) => <StyledCell style={{ width: 140 }}>{data}</StyledCell>,
    },
    {
      title: '주문시간',
      dataIndex: 'dateTimeISO',
      // width: 140,
      render: (data, row) =>
        // console.log(new Date(data).toLocaleString());
        (
          <StyledCell style={{ width: 70 }}>

            {moment(data)
              .format('HH:mm')}
          </StyledCell>
        ),
    },
    {
      title: '플랫폼',
      dataIndex: 'orderPlatform',
      width: 50,
      render: (data) => (
        <StyledCell>
          <PlatformImage
            platform={data}
            style={{
              marginTop: -8,
              marginBottom: -8,
            }}
          />
        </StyledCell>
      ),
    },
    {
      title: '메뉴',
      dataIndex: 'item',
      width: 140,
      render: (data, row) => <StyledCell>{data}</StyledCell>,
    },
    {
      title: '수량',
      dataIndex: 'qty',
      render: (data, row) => {
        if (row.isSubMenu) return null;
        return <StyledCell style={{ width: 30 }}>{data}</StyledCell>;
      },
    },
    // {
    //   title: '추가옵션',
    //   dataIndex: 'item',
    //   width: 200,
    //   render: (data, row) => {
    //     if (!row.isSubMenu) return null;
    //     return <StyledCell>{data}</StyledCell>;
    //   },
    // },
    {
      title: '고객요청',
      dataIndex: 'customerRequest',
      width: 140,
      render: (data, row) => {
        if (row.isSubMenu) return null;
        return <StyledCell style={{ maxWidth: 400 }}>{data}</StyledCell>;
      },
    },
    {
      title: '조리담당',
      dataIndex: 'cookStation',
      // width: 140,
      render: (data) => <StyledCell>{data}</StyledCell>,
    },
    // {
    //   title: '조리상태',
    //   dataIndex: 'orderKitchen',
    //   // width: 140,
    //   render: (data, row) => {
    //     if (!data) return null;
    //     return (
    //       <DiffCell color={orderButtonProps[data.status].palette}>
    //         {orderButtonProps[data.status].label}
    //       </DiffCell>
    //     );
    //   },
    // },
    {
      title: '상세내역',
      dataIndex: 'action',
      // width: 120,
      render: (data, row) =>
      // if (!row.orderKitchen) return null;
        (
          <StyledCell>
            <Button
              onClick={() => {
                selectRecipe(
                  row.orderKitchen.recipeId,
                  row.orderKitchen.id,
                );
              }}
            >
              레시피 선택
            </Button>
          </StyledCell>
        )
      ,
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
        <StyledAntDTable
          modelName="model"
          cellRenderers={pickCellRenderers(cellRenderers)}
          // data={itemisedOrderList}
          data={filteringItemisedOrderList}
          itemsPerPage={pageSize}
          onPageChange={onPageChange}
          currentPage={currentPage}
          count={count}
          rowKey="id"
          bordered={false}
          // size="small"
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
