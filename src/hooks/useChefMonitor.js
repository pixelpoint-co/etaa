import React, {
  useState, useEffect,
} from 'react';
import _ from 'lodash';
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
  const [
    activeStatusById,
    setActiveStatusById,
  ] = useState([]);
  const [
    completedJobsById,
    setCompletedJobById,
  ] = useState([]);
  const [
    machineStateById,
    setMachineStateById,
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
        setMessageEvents(value.activeStatus);
        if (value.cookerId > -1) {
          const newStatusById = [...activeStatusById];
          newStatusById[value.cookerId] = value.activeStatus;
          const newJobById = [...completedJobsById];
          newJobById[value.cookerId] = value.completedJobs;
          const newMachineById = [...machineStateById];
          newMachineById[value.cookerId] = value.machineState;

          setActiveStatusById(newStatusById);
          setCompletedJobById(newJobById);
          setMachineStateById(newMachineById);
          return;
        }
        setActiveStatusById(value.activeStatusList);
        setCompletedJobById(value.completedJobList);
        setMachineStateById(value.machineStateList);
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
        'cookerStatus',
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
          'cookerStatus',
          onMessageEvent,
        );
      };
    },
    [
      activeStatusById,
      completedJobsById,
      machineStateById,
    ],
  );
  // const chefMonitorPotList = _.groupBy(
  //   messageEvents.completedJobList,
  //   (jb) => jb.cookerId,
  // );
  console.log({
    activeStatusById,
    completedJobsById,
    machineStateById,
  });
  return {
    cookerList: [],
    activeStatusById,
    completedJobsById,
    machineStateById,
  };
};
export default useChefMonitor;
