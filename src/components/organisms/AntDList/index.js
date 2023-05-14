import {
  useState, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import has from 'lodash/has';
import styled from 'styled-components';
import {
  size, palette,
} from 'styled-theme';
import {
  ifProp,
} from 'styled-tools';
import {
  List,
} from 'antd';

import Link from '../../atoms/Link';
import Flex from '../../atoms/Flex';
import Text from '../../atoms/P';
import Divider from '../../atoms/Divider';

const StyledList = styled(List)`

`;
const RowContainer = styled(Flex)`
  flex: 1;
  padding: ${({
    verticalMargin,
    horizontalMargin,
  }) => `${verticalMargin}px ${horizontalMargin}px`};
  flex-direction: column;
`;

const StyledText = styled.div`
`;

const AntDList = (props) => {
  const {
    loading,
    dataSource,
    RowComponent,
    verticalMargin,
    horizontalMargin,
    hideDivider,
    ...others
  } = props;
  return (
    <StyledList
      {...others}
      dataSource={dataSource}
      loading={loading}
      renderItem={({
        data,
        ...otherProps
      }, i) => (
        <>
          {(i > 0 && !hideDivider) ? (
            <Divider />
          ) : null}
          <RowContainer
            horizontalMargin={horizontalMargin}
            verticalMargin={verticalMargin}
          >
            <RowComponent
              data={data}
              {...otherProps}
            />
          </RowContainer>
        </>
      )}
    />
  );
};

AntDList.defaultProps = {
  verticalMargin: 0,
  horizontalMargin: 0,
  hideDivider: false,
};

AntDList.propTypes = {
  verticalMargin: PropTypes.number,
  horizontalMargin: PropTypes.number,
  hideDivider: PropTypes.bool,
};

export default AntDList;
