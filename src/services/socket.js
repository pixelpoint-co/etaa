import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const currentUrl = new URL(window.location);

const isRemote = !!process.env.REACT_APP_IS_REMOTE;

const url = isRemote ? process.env.REACT_APP_CHEF_URL_REMOTE : process.env.REACT_APP_CHEF_URL;

// const url = process.env.REACT_APP_CHEF_URL;

export const socket = io(url);
