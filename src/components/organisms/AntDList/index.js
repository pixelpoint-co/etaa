import {
  useState, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import has from 'lodash/has';
import styled from 'styled-components';
import {
  size, palette,
} from 'styled-theme';
import { ifProp } from 'styled-tools';
import { List } from 'antd';

import Link from '../../atoms/Link';
import Flex from '../../atoms/Flex';
import Text from '../../atoms/P';

const StyledList = styled(List)`
`;

const StyledText = styled.div`
`;

const AntDList = (props) => {
  const {
    loading,
    data,
    RowComponent,
    cellRenderers,
    ...others
  } = props;

  return (
    <StyledList
      {...others}
      dataSource={data}
      loading={loading}
      renderItem={(item) => (
        <RowComponent
          data={item}
        />
      )}
    />
  );
};

AntDList.defaultProps = {};

AntDList.propTypes = {};

export default AntDList;
