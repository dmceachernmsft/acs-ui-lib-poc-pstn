import { CommunicationUserIdentifier, PhoneNumberIdentifier, MicrosoftTeamsUserIdentifier, UnknownIdentifier } from '@azure/communication-chat/node_modules/@azure/communication-signaling';
import { usePropsFor, VideoGallery, ControlBar, CameraButton, MicrophoneButton, ScreenShareButton, EndCallButton, useCallClient, CallClientState, ParticipantList, RemoteParticipantState, GridLayout } from '@azure/communication-react';
import { mergeStyles, Stack } from '@fluentui/react';
import { useCallback, useState } from 'react';
import { AddParticipantField } from './Components/AddParticipantField';
import { HoldButton } from './Components/HoldButton';
import { RemoveParticipantTile } from './Components/RemoveParticipantTile';

export type CallingComponentsProps = {
  onToggleHold: () => Promise<void>;
  onAddParticipant: (participant: string, caller: string) => Promise<void>;
  onRemoveParticipant: (participant: PhoneNumberIdentifier | CommunicationUserIdentifier | MicrosoftTeamsUserIdentifier
    | UnknownIdentifier) => Promise<void>;
  caller: string;
  callId: string;
}

function CallingComponents(props: CallingComponentsProps): JSX.Element {

  const videoGalleryProps = usePropsFor(VideoGallery);
  const cameraProps = usePropsFor(CameraButton);
  const microphoneProps = usePropsFor(MicrophoneButton);
  const screenShareProps = usePropsFor(ScreenShareButton);
  const endCallProps = usePropsFor(EndCallButton);
  const callClient = useCallClient();


  const [callEnded, setCallEnded] = useState(false);
  const [callState, setCallState] = useState<CallClientState>(callClient.getState);


  callClient.onStateChange((state: CallClientState) => {
    if (state.callsEnded[props.callId]) {
      setCallEnded(true);
      return;
    }
    setCallState(state);
  });

  console.log(callState.calls[props.callId].remoteParticipants);

  const onHangup = useCallback(async (): Promise<void> => {
    await endCallProps.onHangUp();
    setCallEnded(true);
  }, [endCallProps.onHangUp]);

  const onToggleHold = useCallback(async (): Promise<void> => {
    await props.onToggleHold();
  }, [props.onToggleHold]);


  if (callEnded) {
    return (
      <CallEnded />);
  }

  if (callState.calls[props.callId].state === "Connecting") {
    return (
      <h1>Performing setup</h1>
    )
  }

  if (callState.calls[props.callId].state === "Ringing") {
    return (
      <Stack>
        <CallRinging />
        <ControlBar layout='floatingBottom'>
          {endCallProps && <EndCallButton {...endCallProps} onHangUp={onHangup} />}
        </ControlBar>
      </Stack>
    );
  }

  let removeParticipantTiles: JSX.Element[] = [];

  videoGalleryProps.remoteParticipants.forEach((p) => {
    let participant: RemoteParticipantState;
    participant = callState.calls[props.callId].remoteParticipants[p.userId];
    removeParticipantTiles.push((<RemoveParticipantTile remoteParticipant={participant} onRemoveParticipant={props.onRemoveParticipant} />))
  });

  return (
    <Stack>
      <Stack>
        <Stack style={{ width: '12rem', marginLeft: 'auto', marginRight: 'auto', marginTop: '3rem' }}>
          <AddParticipantField onAddParticipant={props.onAddParticipant} caller={props.caller}></AddParticipantField>
        </Stack>
        <div>
          <Stack style={{ width: 'auto', height: '60rem' }}>
            {videoGalleryProps && callState.calls[props.callId].state === 'Connected' && (<VideoGallery {...videoGalleryProps} />)}
            {callState.calls[props.callId].state === ("LocalHold" || "RemoteHold") && <CallHold />}
            <ControlBar layout='floatingBottom'>
              {cameraProps && <CameraButton  {...cameraProps} />}
              {microphoneProps && <MicrophoneButton   {...microphoneProps} />}
              {screenShareProps && <ScreenShareButton  {...screenShareProps} />}
              {onToggleHold && <HoldButton onToggleHold={onToggleHold} />}
              {endCallProps && <EndCallButton {...endCallProps} onHangUp={onHangup} />}
            </ControlBar>
            <GridLayout styles={{root: {padding: '3rem'}}}>
              {removeParticipantTiles}
            </GridLayout>
          </Stack>


        </div>
      </Stack>
    </Stack>
  );
}

function CallEnded(): JSX.Element {
  return <h1>The call has ended.</h1>;
}

function CallHold(): JSX.Element {
  return <h1>The Call is on hold.</h1>;
}

function CallRinging(): JSX.Element {
  return <h1>Ringing</h1>
}

export default CallingComponents;