import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? 'http://192.168.0.100:4100' : 'http://localhost:4100';

export const socket = io(URL);
