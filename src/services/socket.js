import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const currentUrl = new URL(window.location);
const isRemote = currentUrl.hostname !== 'localhost' && currentUrl.hostname.slice(
  0,
  3,
) !== '192';

const url = isRemote ? `http://${currentUrl.hostname}:10105` : process.env.REACT_APP_CHEF_URL;

// const url = process.env.REACT_APP_CHEF_URL;

export const socket = io(url);
