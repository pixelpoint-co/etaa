import {
  Formik, useField, Form, Field,
} from 'formik';

import {
  palette, size,
} from 'styled-theme';
import styled from 'styled-components';
import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import {
  gql, useMutation,
} from '@apollo/client';

import _ from 'lodash';
import Flex from '../../components/atoms/Flex';
import InputField from '../../components/molecules/InputField';

import {
  unformat, roundTo, convertUnit,
} from '../../services/number';
import Card from '../../components/atoms/Card';
import DataView from '../../components/molecules/DataView';

import useProductData from '../../hooks/useProductData';
import ModelSelect from '../../containers/ModelSelect';
import PageAction from '../../components/organisms/PageAction';

const UPDATE_PRODUCT = gql`
mutation UpsertPurchase(
  $id: Int,
  $name: String,
  $unit: String,
  $unitQuantity: Int,
) {
  upsertProduct(id: $id, name: $name, unit: $unit, unitQuantity: $unitQuantity) {
    id,
    name,
    unit,
    unitQuantity,
  }
}
`;

const Wrapper = styled(Flex)`
  flex-direction: column;
  padding: 20px;
  @media (max-width: ${size('mobileBreakpoint')}) {
    overflow-x: auto;
  }
`;
const StyledForm = styled(Form)`
  display: flex;
  flex: 1;
  max-width: 100%;
  flex-direction: column;
`;

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = id != null;

  const {
    productListData: data,
    count,
    loading,
    error,
  } = useProductData({ id });

  const [
    updateProduct,
    {
      loading: updateProductLoading,
      error: updateProductError,
    },
  ] = useMutation(
    UPDATE_PRODUCT,
    { onCompleted: () => navigate('/product') },
  );

  if (loading) return null;
  console.log(data);
  const [product] = data;

  return (
    <Wrapper>
      <Formik
        initialValues={{
          id: product.id,
          name: product.name || '',
          unit: product.unit || 'g',
          unitQuantity: product.unitQuantity || 1,
        }}
        onSubmit={(values) => {
          console.log(values);
          updateProduct({
            variables: {
              ...values,
              unitQuantity: Number(values.unitQuantity) || 0,
            },
          });
        }}
      >
        <StyledForm>
          <Card flex={0}>
            <DataView
              entries={[
                {
                  value: product.id,
                  label: 'ID',
                },
                {
                  value: product.name,
                  label: '이름',
                },
                {
                  value: product.unitQuantity,
                  label: '계량 용량',
                },
                {
                  value: product.unit,
                  label: '계량 단위',
                },
              ]}
            />
          </Card>
          <InputField name="id" label="ID" disabled />
          <InputField name="name" label="이름" />
          <InputField name="unitQuantity" label="계량 용량" />
          <InputField name="unit" label="계량 단위" />
          <PageAction
            actions={[{
              type: 'submit',
              label: '저장',
              loaderSize: 32,
              palette: 'primary',
            }]}
          />
        </StyledForm>
      </Formik>
    </Wrapper>
  );
};

export default ProductEdit;
