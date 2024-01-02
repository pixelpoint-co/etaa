import { usePostHog } from 'posthog-js/react';
import PropTypes from 'prop-types';

import {
  useState, useRef, useCallback, useEffect,
} from 'react';
import ErrorPulse from '../../components/molecules/ErrorPulse';

const AsanaSupport = (props) => {
  const { ...others } = props;
  const posthog = usePostHog();

  const [
    tempLoading,
    setTempLoading,
  ] = useState(false);
  const loadingRef = useRef(null);

  const handleClick = useCallback(
    (e) => {
      if (tempLoading) return;

      setTempLoading(true);
      posthog?.capture(
        'customer_support',
        {
          location: process.env.REACT_APP_LOCATION,
          cookerId: Number(process.env.REACT_APP_COOKER_ID),
        },
      );
      loadingRef.current = setTimeout(
        () => {
          setTempLoading(false);
        },
        1000,
      );
    },
    [
      tempLoading,
      posthog,
    ],
  );

  useEffect(
    () => () => {
      clearTimeout(loadingRef.current);
    },
    [],
  );

  return (
    <ErrorPulse
      {...others}
      shouldAnimate={tempLoading}
      onClick={handleClick}
    />
  );
};

AsanaSupport.propTypes = {
  pot: PropTypes.shape({
    number: PropTypes.number,
    label: PropTypes.string,
  }),
};
AsanaSupport.defaultProps = {
  pot: {
    number: 1,
    label: 'pot-label',
  },
};

export default AsanaSupport;
