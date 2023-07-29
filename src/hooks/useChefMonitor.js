import React, {
  useState, useEffect,
} from 'react';
import { socket } from '../services/socket';

const useChefMonitor = () => {
  const [
    isConnected,
    setIsConnected,
  ] = useState(socket.connected);
  const [
    messageEvents,
    setMessageEvents,
  ] = useState([]);

  useEffect(
    () => {
      function onConnect() {
        setIsConnected(true);
      }

      function onDisconnect() {
        setIsConnected(false);
      }

      function onMessageEvent(value) {
        console.log(
          'socket',
          value,
        );
        setMessageEvents(value);
      }

      socket.on(
        'connect',
        onConnect,
      );
      socket.on(
        'disconnect',
        onDisconnect,
      );
      socket.on(
        'message',
        onMessageEvent,
      );

      return () => {
        socket.off(
          'connect',
          onConnect,
        );
        socket.off(
          'disconnect',
          onDisconnect,
        );
        socket.off(
          'message',
          onMessageEvent,
        );
      };
    },
    [],
  );
  console.log(messageEvents);
  return { eKQueue: messageEvents };
};
export default useChefMonitor;
