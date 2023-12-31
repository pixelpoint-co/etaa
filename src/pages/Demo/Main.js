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
import { useSprite } from '../../hooks/useSprite';

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
  max-width: min(720px, 90vw);
  max-height: min(400px, 40vh);
  bottom: 0px;
  flex: 1;
  margin-top: 50px;
  margin-bottom: 20px;
`;
const KitchenContainer = styled(Flex)`
  flex-wrap: wrap;
  justify-items: center;
  align-items: center;
  position: absolute;
  left: 50%;
  translate: -50%;
  padding-top: 8%;
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
    activeStatusById,
    completedJobsById,
    ...others
  } = props;
  const {
    queryParams,
    setQueryParams,
  } = useQueryParams();
  const visible = queryParams.selectedCookerId > -1;
  console.log({ queryParams });
  return (
    <COffcanvas
      visible={visible}
      placement="end"
      backdrop
      onHide={() => setQueryParams(({
        selectedCookerId,
        ...rest
      }) => rest)}
      style={{
        height: 650,
        margin: 'auto',
        marginRight: 20,
        overflow: 'auto',
        backgroundColor: 'white',
        border: 'none',
        zIndex: 1041,
        // maxWidth: '900px',  // with sprite
        maxWidth: '680px',
        width: '90%',
      }}
    >
      <Cooker
        visible={visible}
        cookerId={Number(queryParams.selectedCookerId)}
        onSelect={setQueryParams}
        activeStatusById={activeStatusById}
        completedJobsById={completedJobsById}
      />
    </COffcanvas>
  );
};
const DemoMain = (props) => {
  const { ...others } = props;

  const {
    data,
    completeOrder,
  } = useOrderData({
    sortOrder: 'asc',
    maxOrderStatus: 99,
  });
  const {
    cookerList,
    activeStatusById,
    completedJobsById,
    machineStateById,
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
        <KitchenContainer>
          <Top style={{ zIndex: 1 }}>
            <Kiosk />
            <Link to="?selectedCookerId=0">
              <Kitchen />
            </Link>
            {/* <PotTab
              themeProps={{
                palette: 'white',
                boxShadow: '0px 2px 4px rgba(50, 50, 93, 0.1)',
              }}
              offThemeProps={{
                palette: 'grayscale',
                tone: 6,
                type: 'text',
              }}
              options={machineUrl.map((v, i) => ({ value: i }))}
              value={queryParams.selectedCookerId}
              onSelect={setQueryParams}
            /> */}
          </Top>
          <Bottom>
            <Platform />
          </Bottom>
        </KitchenContainer>
      </Bottom>
      <OffC
        activeStatusById={activeStatusById}
        completedJobsById={completedJobsById}
      />
    </Wrapper>
  );
};

DemoMain.propTypes = { };
DemoMain.defaultProps = { };

export default DemoMain;
