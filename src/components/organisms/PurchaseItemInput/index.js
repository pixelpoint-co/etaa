import {
  useState,
} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import moment from 'moment';
import _, {
  get,
} from 'lodash';
import {
  palette, size,
} from 'styled-theme';

import {
  useField,
} from 'formik';

import {
  gql,
} from '@apollo/client';
import Text from '../../atoms/P';
import Flex from '../../atoms/Flex';
import Icon from '../../atoms/Icon';
import Image from '../../atoms/Image';
import Button from '../../atoms/Button';
import Input from '../../molecules/Input';
import ModelSelect from '../../../containers/ModelSelect';
import Select from '../../molecules/Select';

const Wrapper = styled(Flex)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex: 1;
  padding: 10px 0px;
  margin: 0px -20px;
`;
const CellContainer = styled(Flex)`
  flex: 1;
  margin-left: 20px;
  margin-right: 20px;
  align-items: center;
  flex-basis: 0px;
  overflow: hidden;
  position: relative;
`;
const StyledInput = styled(Input)`
  justify-content: flex-end;
  align-self: center;
  font-size: 32px;
  line-height: 40px;
  text-align: left;
  margin-right: 0px;
`;

const keyToLabel = {
  name: '상품명',
  unit: '단위',
  unitPrice: '구매 가격',
  unitAmount: '용량',
  unitQuantity: '구매 수량',
};

const PurchaseItemInput = (props) => {
  const {
    onChange, // onChange(v) v = { g }
    onChangeKey,
    data,
    ...others
  } = props;
  const defaultRenderer = (key) => (d) => String(d[key]);

  return (
    <Wrapper>
      {/* <CellContainer>
        <StyledInput
          inputStyle={{ flex: 1 }}
          placeholder={keyToLabel.name}
          onChange={(e) => onChangeKey('name')(e.target.value)}
          value={data.name}
        />
      </CellContainer> */}
      <CellContainer>
        <ModelSelect
          style={{ width: '100%' }}
          placeholder="자재명"
          required
          query={gql`
            query FetchProductList($offset:Int, $limit:Int) {
              productList (
                offset: $offset,
                limit: $limit,
              ) {
                list {
                  id
                  name
                }
              }
            }
          `}
          addItemQuery={gql`
            mutation AddProduct($name:String, $unit:String) {
              addProduct(name: $name, unit: $unit) {
                name,
                unit,
              }
            }
          `}
          onChange={(v, a) => {
            onChangeKey('productId')(a);
          }}
          value={data.productId?.value}
          mapDataToItems={(data) => {
            const dataList = get(
              data,
              [
                'productList',
                'list',
              ],
            );
            return dataList.map((d) => ({
              value: d.id,
              label: d.name,
            }));
          }}
        />
      </CellContainer>
      {/* <CellContainer>
        <StyledInput
          inputStyle={{ flex: 1 }}
          type="number"
          placeholder={keyToLabel.unitAmount}
          onChange={(e) => onChangeKey('unitAmount')(e.target.value)}
          value={data.unitAmount}
        />
      </CellContainer> */}
      {/* <CellContainer>
        <Select
          style={{
            flex: 1,
            height: '100%',
          }}
          placeholder={keyToLabel.unit}
          can={false}
          items={[
            'g',
            'kg',
            'ea',
            'l',
            'ml',
          ].map(_.capitalize)}
          onChange={(v) => onChangeKey('unit')(v)}
          value={data.unit}
        />
      </CellContainer> */}
      <CellContainer>
        <StyledInput
          inputStyle={{ flex: 1 }}
          type="number"
          placeholder={keyToLabel.unitQuantity}
          onChange={(e) => onChangeKey('unitQuantity')(e.target.value)}
          value={data.unitQuantity}
        />
      </CellContainer>
      {/* <CellContainer>
        <StyledInput
          inputStyle={{ flex: 1 }}
          type="number"
          placeholder={keyToLabel.unitPrice}
          onChange={(e) => onChangeKey('unitPrice')(e.target.value)}
          value={data.unitPrice}
        />
      </CellContainer> */}

    </Wrapper>
  );
};

PurchaseItemInput.propTypes = {};

PurchaseItemInput.defaultProps = {};

export default PurchaseItemInput;
