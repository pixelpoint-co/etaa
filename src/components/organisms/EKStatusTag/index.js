import styled from 'styled-components';
import Tag from '../../atoms/Tag';
import CountDown from '../../molecules/CountDown';

const StyledTag = styled(Tag)`
  padding: 4px 10px;
  align-self: flex-start;
  > p {
    font-size: 18px;
    line-height: 18px;
  }
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
    themeType: 'light',
  },
  ORDER_WAITING: { // 조리 대기
    label: '조리준비',
    disabled: false,
    palette: 'yellow',
  },
  ORDER_COOKING: { // 조리중
    label: '조리',
    disabled: false,
    palette: 'orange',
    themeType: 'light',
  },
  ORDER_COOKED: { // 조리끝
    label: '완료',
    disabled: true,
  },
};

const getStatus = ({
  orderKitchen,
  activeStatusById,
  completedJobsById,
  recipeData,
}) => {
  const cookerId = _.get(
    orderKitchen,
    [
      'meta',
      'cookerId',
    ],
    -1,
  );
  const cookStatus = _.get(
    activeStatusById,
    [
      cookerId,
      0,
    ],
  );
  console.log({
    cookerId,
    orderKitchen,
    activeStatusById,
    cookStatus,
    completedJobsById,
  });
  const recipe = _.find(
    recipeData,
    {
      id: _.get(
        orderKitchen,
        'recipeId',
      ),
    },
  );
  const recipeDurationS = _.get(
    recipe,
    [
      'detail',
      'duration',
    ],
    0,
  );
  const {
    name,
    timestamp,
  } = cookStatus || {};
  const cookStartTime = name === 'cook' ? timestamp : null;
  const completionTimeMs = cookStartTime + (recipeDurationS * 1000);
  const showTime = completionTimeMs > Date.now() && name === 'cook';

  let status = orderKitchen.status || 'ORDER_ACCEPTED';
  if (showTime) status = 'ORDER_COOKING';
  return {
    cookStartTime,
    completionTimeMs,
    showTime,
    cookerId,
    status,
  };
};

const EKStatusTag = (props) => {
  const {
    orderKitchen,
    activeStatusById,
    completedJobsById,
    recipeData,
    ...others
  } = props;
  const {
    cookStartTime,
    completionTimeMs,
    showTime,
    cookerId,
    status,
  } = getStatus({
    orderKitchen,
    activeStatusById,
    completedJobsById,
    recipeData,
  });
  const okStatusProps = orderButtonProps[status];
  return (
    <StyledTag
      icon={false}
      themeProps={{
        palette: okStatusProps?.palette,
        type: okStatusProps?.themeType || 'light',
      }}
      label={(
        <>
          {okStatusProps?.label}
          {showTime ? (
            <>
              {' - '}
              <CountDown
                palette="orange"
                shorten
                completionTimeMs={completionTimeMs}
              />
            </>
          ) : null}
          {cookerId > -1 ? (
            <>
              {' | '}
              {`EK P${cookerId + 1}`}
              {'  '}
            </>
          ) : null}
        </>
      )}
      style={{ paddingRight: showTime ? 20 : null }}
    />
  );
};

export default EKStatusTag;
