// import { connect } from 'react-redux';
import {
  useNavigate,
  useLocation,
} from 'react-router-dom';
import styled from 'styled-components';
import {
  size, palette,
} from 'styled-theme';
import P from '../../components/atoms/P';
import Flex from '../../components/atoms/Flex';
import Button from '../../components/atoms/Button';
import propTypes from '../../propTypes';
import Heading from '../../components/atoms/Heading';
import IconCard from '../../components/molecules/IconCard';

const Wrapper = styled(Flex)`
  flex: 1;
  flex-direction: column;
  background-color: ${palette('grayscale', 2)}
`;

const SectionContainer = styled(Flex)`
  padding: 15px;
`;

const HeaderContainer = styled(SectionContainer)`
  height: 340px;

  background-size: cover;
  background-position: center;
  border-radius: 0px 0px 0px 0px;
`;

const HeaderText = styled(Heading)`
  color: white;
  margin-top: 75px;
  margin-bottom: 100px;
  margin-right: 160px;
  max-width: 180px;
`;

const IconCardsContainer = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  margin: -5px;
  flex-wrap: wrap;
  margin-top: -${15 + 40}px;
  flex: 1;
`;

const ErrorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-top: 6px;

  p {
    color: red;
    font-size: 11px;
    margin: 0;
  }
`;

const StyledIconCard = styled(IconCard)`
  margin: 5px;
  min-width: calc(50% - 10px);
  align-items: center;
`;

const HistorySection = styled(SectionContainer)`
  flex-direction: column;
`;

const HistoryCardSection = styled(Flex)`
  flex-direction: column;
  margin-top: 5px;
`;
const Home = ({
  authenticated,
  // user,
  // role,
  // visited,
  signInError,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const getDefaultPathName = () => {
    console.log('getting default path');
    // return different route to authenticated user
    return '/';
  };

  const { from } = location.state || { from: { pathname: getDefaultPathName() } };

  // if (authenticated) return <Navigate to={from} />; // todo

  return (
    <Wrapper>
      <HeaderContainer>
        <HeaderText>
          ERP
          <Button />
        </HeaderText>
      </HeaderContainer>
    </Wrapper>
  );
};

Home.propTypes = { };

export default Home;
