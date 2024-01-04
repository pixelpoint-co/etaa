import {
  useEffect, useMemo, useRef, useState,
} from 'react';
import {
  EventIndex,
  formatTime,
  PlayerRef,
  PlayerContextProvider,
  PlayerController,
  PlayerFrame,
} from '@posthog/react-rrweb-player';
import Flex from '../../components/atoms/Flex';
import defaultRecord from './sample-record.json';

const SessionReplay = () => {
  const [
    events,
    setEvents,
  ] = useState(defaultRecord.data.snapshots);
  const [
    recording,
    setRecording,
  ] = useState(
    'recording',
    defaultRecord,
  );
  const [
    activeRecording,
    setActiveRecording,
  ] = useState(recording);
  const [
    playerTime,
    setCurrentPlayerTime,
  ] = useState(0);

  const playerRef = useRef(null);

  // useEffect(
  //   () => {
  //     async function fetchRecording() {
  //       const response = await fetch(recording.value);
  //       const { result } = await response.json();

  //       setEvents(result);
  //       setActiveRecording(recording);
  //     }

  //     fetchRecording();
  //   },
  //   [recording],
  // );

  const eventIndex: EventIndex = useMemo(
    () => new EventIndex(events),
    [events],
  );
  const [
    pageEvent,
    atPageIndex,
  ] = useMemo(
    () => eventIndex.getPageMetadata(playerTime),
    [
      eventIndex,
      playerTime,
    ],
  );
  const [recordingMetadata] = useMemo(
    () => eventIndex.getRecordingMetadata(playerTime),
    [
      eventIndex,
      playerTime,
    ],
  );
  const pageVisitEvents = useMemo(
    () => eventIndex.pageChangeEvents(),
    [eventIndex],
  );

  return (
    <Flex>
      {events.length > 0 && (
        <PlayerContextProvider
          ref={playerRef}
          events={events}
          key={activeRecording.value}
          onPlayerTimeChange={setCurrentPlayerTime}
          onNext={() => {
            console.log('next recording...');
          }}
          onPrevious={() => {
            console.log('previous recording...');
          }}
          duration={events.length > 0 ? (events.slice(-1)[0].timestamp - events[0].timestamp) : 0}
          isBuffering={false}
        >
          <PlayerFrame />
          <PlayerController />
        </PlayerContextProvider>
      )}
    </Flex>
  );
};

export default SessionReplay;
