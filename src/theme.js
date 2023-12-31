import objectUtils from './utils/objects';

const { flatten } = objectUtils;

const theme = {};

theme.palette = {
  primary: ['#0D35D5'],
  secondary: ['#94ADCF'],
  white: [
    '#fff',
    '#f6f9fc',
  ],
  black: ['#000000'],
  grayscale: [
    '#1E1E1E',
    '#313235',
    '#7B7E81',
    '#A8A9AD',
    '#D8D9DD',
    '#EEF0F3',
    '#F8F8F8',
    '#FCFCFC',
  ],
  red: ['#EF6262'],
  orange: ['#FC7B42'],
  yellow: ['#F1AD3C'],
  green: ['#8DC53C'],
  blue: ['#0D35D5'],
  purple: ['#9981F7'],
};

theme.fonts = { primary: 'Pretendard' };
const sizes = {
  padding: {
    // default: '12px',
    // large: '36px',
  },
  margin: {
    // default: '12px',
    // large: '24px',
  },
  maxWidth: '1100px',
  mobileBreakpoint: '1024px',
};

theme.sizes = flatten(sizes);

export default theme;
