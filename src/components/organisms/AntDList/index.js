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
const RowContainer = styled(Flex)`
  flex: 1;
  padding: ${({
    verticalMargin,
    horizontalMargin,
  }) => `${verticalMargin}px ${horizontalMargin}px`};
`;

const StyledText = styled.div`
`;

const AntDList = (props) => {
  const {
    loading,
    data,
    RowComponent,
    cellRenderers,
    verticalMargin,
    horizontalMargin,
    ...others
  } = props;
  return (
    <StyledList
      {...others}
      dataSource={data}
      loading={loading}
      renderItem={(item) => (
        <RowContainer
          verticalMargin={verticalMargin}
          horizontalMargin={horizontalMargin}
        >
          <RowComponent
            data={item}
          />
        </RowContainer>
      )}
    />
  );
};

AntDList.defaultProps = {
  verticalMargin: 8,
  horizontalMargin: 16,
};

AntDList.propTypes = {
  verticalMargin: PropTypes.number,
  horizontalMargin: PropTypes.number,

};

export default AntDList;
