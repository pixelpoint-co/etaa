import PropTypes from 'prop-types';
import styled from 'styled-components';
import startCase from 'lodash/startCase';
import {
  size,
} from 'styled-theme';
import {
  palette,
} from 'styled-tools';
import Label from '../../atoms/Label';
import Flex from '../../atoms/Flex';

const Wrapper = styled(Flex)`
  flex-wrap: wrap;
  margin: -9px;
  flex-grow: 0;

  .DataView_column {
    flex: 163px 0 0;
    color: black;
    margin: 9px;
  }

  .DataView_label {
    line-height: ${size('lineHeight.body.b3')};
    font-weight: ${size('fontWeight.bold')};
  }

  .DataView_value {
    line-height: ${size('lineHeight.body.b3')};
  }
`;

const DataView = ({ entries }) => {
  return (
    <Wrapper className="DataView_container">
      {entries.map((entry, index) => {
        const { Component } = entry;
        return (
          <div key={index} className="DataView_column">
            <Label className="DataView_label" palette="primary">{startCase(entry.label)}:</Label>
            <div className="DataView_value">
              {Component ? <Component index={index} {...entry} /> : JSON.stringify(entry.value)}
            </div>
          </div>
        );
      })}
    </Wrapper>
  );
};

DataView.propTypes = {
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.any,
      Component: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
      ]),
    }),
  ).isRequired,
};

export default DataView;
