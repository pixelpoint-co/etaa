import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const currentUrl = new URL(window.location);

const isRemote = (
  currentUrl.hostname !== 'localhost' && currentUrl.hostname.slice(
    0,
    3,
  ) !== '192'
) || process.env.REACT_APP_IS_REMOTE;
const url = isRemote ? process.env.REACT_APP_CHEF_URL_REMOTE : process.env.REACT_APP_CHEF_URL;

// const url = process.env.REACT_APP_CHEF_URL;
console.log(process.env);
export const socket = io(
  url,
  {
    withCredentials: process.env.REACT_APP_ENV === 'production',
    // query
  },
);
document?.addEventListener(
  'visibilitychange',
  () => {
    if (document.hidden) {
      socket.disconnect();
    } else {
      socket.connect();
    }
  },
  false,
);

export default socket;
