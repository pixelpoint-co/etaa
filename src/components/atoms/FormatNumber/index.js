import PropTypes from 'prop-types';
import styled from 'styled-components';
import P from '../P';

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const Container = styled(P)`
`;
const FormatNumber = (props) => {
  const {
    affix,
    value,
    ...otherProps
  } = props;

  const formattedValue = numberWithCommas(value);

  return (
    <Container
      {...otherProps}
    >
      {formattedValue}{affix}
    </Container>
  );
};

FormatNumber.propTypes = {
  affix: PropTypes.string,
  value: PropTypes.string,
};

FormatNumber.defaultProps = {
  affix: '',
  value: '',
};

export default FormatNumber;
