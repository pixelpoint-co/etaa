// import { connect } from 'react-redux';
import {
  useLocation,
} from 'react-router-dom';

import styled from 'styled-components';
import _ from 'lodash';
import {
  size,
} from 'styled-theme';
import {
  palette,
} from 'styled-tools';
import {
  COffcanvas,
} from '@coreui/react';
import Text from '../../components/atoms/P';
import Flex from '../../components/atoms/Flex';
import Button from '../../components/atoms/Button';
import propTypes from '../../propTypes';
import Heading from '../../components/atoms/Heading';
import Card from '../../components/atoms/Card';
import PageAction from '../../components/organisms/PageAction/index';
import AntDList from '../../components/organisms/AntDList';
import PotUnit from '../../components/organisms/PotUnit';
import OrderMonitor from '../../containers/OrderMonitor';
import Link from '../../components/atoms/Link';
import PotTab from '../../components/organisms/PotTab';
import useOrderData from '../../hooks/useOrderData';
import useChefMonitor from '../../hooks/useChefMonitor';
import useRecipeData from '../../hooks/useRecipeData';
import Receipt from '../../components/organisms/Receipt';
import Kiosk from './Kiosk';
import Kitchen from './Kitchen';
import Platform from './Platform';
import Cooker from './Cooker';
import PotController from '../../components/organisms/PotController';
import usePotController from '../../hooks/usePotController';
import useQueryParams from '../../hooks/useQueryParams';

const Wrapper = styled(Flex)`
  flex-direction: row;
  /* justify-content: center; */
  /* align-items: stretch; */
  flex-wrap: wrap;
  overflow: hidden;
`;
const Top = styled(Flex)`
  flex: 0;
  flex-basis: 100%;
  height: 50%;
  flex-shrink: 0;
  flex-grow: 0;
  background: transparent;
  position: relative;
  justify-content: center;
`;
const Bottom = styled(Flex)`
  flex: 0;
  flex-basis: 100%;
  height: 50%;
  flex-shrink: 0;
  flex-grow: 0;
  position: relative;
  justify-content: center;
`;
const MonitorContainer = styled(Flex)`
  left: 50%;
  translate: -50%;
  border-radius: 15px;
  overflow: hidden;
  border: 3px solid ${palette(
    'grayscale',
    0,
  )};
  background: ${palette(
    'grayscale',
    5,
  )};
  max-width: 720px;
  max-height: 400px;
  bottom: 0px;
  position: absolute;
`;
const KitchenContainer = styled(Flex)`
  flex-wrap: wrap;
  justify-items: center;
  align-items: center;
  position: absolute;
  left: 50%;
  translate: -50%;
  /* flex-basis: 100%; */
`;
const ReceiptWrapper = styled(Flex)`
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  overflow: auto;
  flex-basis: 1px;
  zoom: .5;
`;

const OffC = (props) => {
  const {
    selectedOrder,
    selectedItemisedOrder,
    chefMonitoringData,
    selectRecipe,
    ...others
  } = props;

  const potController = usePotController(props.queryParams.selectedCookerId);
  return (
    <COffcanvas
      visible={props.queryParams.selectedCookerId > -1}
      placement="end"
      backdrop
      onHide={() => props.setQueryParams(({
        selectedCookerId,
        ...rest
      }) => rest)}
      style={{
        height: 720,
        margin: 'auto',
        marginRight: 60,
        overflow: 'auto',
        backgroundColor: 'transparent',
        border: 'none',
        zIndex: 1041,
      }}
    >

      <Cooker />
    </COffcanvas>
  );
};
const DemoMain = (props) => {
  const location = useLocation();
  const machineUrl = process.env.REACT_APP_MACHINE_URL.split(',');
  const { ...others } = props;
  const {
    queryParams,
    setQueryParams,
  } = useQueryParams({ initialQueryParams: { selectedCookerId: 0 } });

  const {
    data,
    completeOrder,
  } = useOrderData({
    sortOrder: 'asc',
    maxOrderStatus: 99,
  });
  const {
    activeStatusById,
    completedJobsById,
  } = useChefMonitor();
  const { data: recipeData } = useRecipeData();

  return (
    <Wrapper>
      <Top>

        <MonitorContainer>
          <ReceiptWrapper>
            {data.map((order) => (
              <Receipt
                key={order.id}
                order={order}
                activeStatusById={activeStatusById}
                completedJobsById={completedJobsById}
                recipeData={recipeData}
                completeOrder={completeOrder}
              />
            ))}
          </ReceiptWrapper>
        </MonitorContainer>
      </Top>
      <Bottom>
        <KitchenContainer
          style={{ paddingTop: '5%' }}
        >
          <Top style={{ zIndex: 1 }}>
            <Kiosk />
            <Flex>
              <Kitchen />
            </Flex>
            <PotTab
              themeProps={{
                palette: 'white',
                boxShadow: '0px 2px 4px rgba(50, 50, 93, 0.1)',
              }}
              offThemeProps={{
                palette: 'grayscale',
                tone: 6,
                type: 'text',
              }}
              options={[
                { value: 0 },
                { value: 1 },
                { value: 2 },
                { value: 3 },
              ]}
              value={queryParams.selectedCookerId}
              onSelect={setQueryParams}
            />
          </Top>
          <Bottom>
            <Platform />
          </Bottom>
        </KitchenContainer>
      </Bottom>
      <OffC queryParams={queryParams} setQueryParams={setQueryParams} />
    </Wrapper>
  );
};

DemoMain.propTypes = { };
DemoMain.defaultProps = { };

export default DemoMain;
