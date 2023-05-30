import theme from '../../../theme';

const { palette } = theme;

const customStyle = ({
  invalid,
  disabled,
}) => ({
  option: (base, state) => ({
    ...base,
    cursor: 'pointer',
    backgroundColor: state.isSelected ? palette.primary[0] : state.isFocused ? palette.primary[2] : 'white',
    color: (state.isSelected || state.isFocused) ? 'white' : 'black',
    ':active': {
      backgroundColor: palette.primary[2],
      color: 'white',
    },
  }),
  control: (base, state) => ({
    ...base,
    backgroundColor: disabled ? palette.grayscale[2] : 'white',
    borderRadius: '4px',
    ...(
      invalid ? { border: `1px solid ${palette.red[3]}` } : {},
      state.isFocused ? { border: `1px solid ${palette.primary[0]}` } : {}
    ),
    color: '#12426B',
    boxShadow: 'none',
    // height: '36px',
    minWidth: '120px',
    maxHeight: '250px',
    overflow: 'scroll',
    '::-webkit-scrollbar': { display: 'none' },
    ':hover': { border: `1px solid ${palette.primary[0]}` },
    ':active': { border: `1px solid ${palette.primary[3]}` },
  }),
  multiValueLabel: (base, state) => ({
    ...base,
    color: 'black',
  }),
  menu: (base) => ({
    ...base,
    border: `1px solid ${palette.primary[0]}`,
    borderRadius: '4px',
    // boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
  }),
  placeholder: (base) => ({
    ...base,
    color: `${palette.grayscale[1]}`,
    fontSize: '14px',
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  multiValueLabel: (base, { data: { isStrikeThrough } }) => ({
    ...base,
    textDecoration: isStrikeThrough ? 'line-through' : 'normal',
    paddingRight: disabled ? '6px' : '3px',
  }),
  multiValueRemove: (base) => ({
    ...base,
    display: disabled ? 'none' : 'flex',
  }),
});

export default customStyle;
