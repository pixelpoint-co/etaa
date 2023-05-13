import {
  Route,
  Routes,
  Outlet,
} from 'react-router-dom';
import {
  Formik, useField, Form,
} from 'formik';

import styled from 'styled-components';

import Flex from '../../components/atoms/Flex';
import Card from '../../components/atoms/Card';
import Input from '../../components/molecules/Input';

const PageWrapper = styled(Flex)`

`;

const FormWrapper = styled(Card)`
  width: 50%;
  margin: 20px;
`;
const NotificationBoardWrapper = styled(Flex)`
  margin: 20px;
`;

const SignInField = (props) => {
  const [
    field,
    meta,
    helpers,
  ] = useField(props);
  const {
    value,
    error,
  } = meta;
  const onChange = helpers.setValue;
  console.log(meta);
  return (
    <Input
      {...field}
      {...props}
      value={value}
      onChange={(e) => {
        console.log(e);
        onChange(e.target.value);
      }}
      invalid={!error}
    />
  );
};

const SignIn = () => {
  return (
    <PageWrapper>
      <Formik
        initialValues={{
          id: '',
          password: '',
        }}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        <FormWrapper>
          <SignInField
            name="id"
            label="ID"
            placeholder="아이디를 입력하세요"
            required
            invalid
          />
          <Input
            label="비밀번호"
            placeholder="아이디를 입력하세요"
            required
          />
        </FormWrapper>
      </Formik>

      <NotificationBoardWrapper>
        signin
      </NotificationBoardWrapper>
    </PageWrapper>
  );
};

export default SignIn;
