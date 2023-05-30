import {
  useField,
} from 'formik';
import Input from '../Input';

const InputField = (props) => {
  const [
    field,
    meta,
    helpers,
  ] = useField(props);
  const { value } = meta;
  const { setValue } = helpers;

  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export default InputField;
