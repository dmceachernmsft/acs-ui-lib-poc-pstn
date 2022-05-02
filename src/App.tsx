import React, {useState } from 'react';
import { registerIcons } from '@fluentui/react';
import { HomeScreen } from './HomeScreen';
import { CallScreen } from './CallScreen';
import {Stack, PrimaryButton} from '@fluentui/react';

type AppPages = 'home' | 'call';

function App(): JSX.Element {
  const [page, setPage] = useState<AppPages>('home');
  const [callerNumber, setCallerNumber] = useState<string>();
  const [calleeNumber, setCalleeNumber] = useState<string>();
  const [token, setToken] = useState<string>();
  const [userId, setUserId] = useState<string>();

  switch (page) {
    case 'home': {
      document.title = 'ACS UI Library PSTN POC';
      return (
        <HomeScreen
          startCallHandler={(callDetails) => {
            setCallerNumber(callDetails.callerNumber);
            setCalleeNumber(callDetails.calleeNumber);
            setToken(callDetails.userToken);
            setUserId(callDetails.userId);
            setPage('call');
          }}
        />
      )
    }
    case 'call': {
      document.title = 'ACS UI Library PSTN Call Screen';
      if (token && calleeNumber && callerNumber && userId) {
        return (
          <CallScreen userToken={token} userId={userId} calleeNumber={calleeNumber} callerNumber={callerNumber} />
        )
      } else {
        return (
          <Stack>
            <Stack>There was a Problem with your credentials please try again</Stack>
            <PrimaryButton text='Return to home page' onClick={() => {
              setPage('home');
            }}></PrimaryButton>
          </Stack>
        )
      }
    }
    default: {
      document.title = 'Invalid Page';
      return (<>Invalid Page</>);
    }
  }

}

export default App;
