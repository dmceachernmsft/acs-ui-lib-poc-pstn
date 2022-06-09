import { usePropsFor, VideoGallery, ControlBar, CameraButton, HoldButton, MicrophoneButton, EndCallButton, useCallClient, CallClientState, ParticipantList, useCall } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { useCallback, useState } from 'react';
import { AddParticipantField } from './Components/AddParticipantField';

export type CallingComponentsProps = {
  caller: string;
  callId: string;
}

function CallingComponents(props: CallingComponentsProps): JSX.Element {

  const videoGalleryProps = usePropsFor(VideoGallery);
  const cameraProps = usePropsFor(CameraButton);
  const microphoneProps = usePropsFor(MicrophoneButton);
  const endCallProps = usePropsFor(EndCallButton);
  const participantListProps = usePropsFor(ParticipantList);
  const holdButtonProps = usePropsFor(HoldButton);

  const callClient = useCallClient();
  const call = useCall();

  const [callEnded, setCallEnded] = useState(false);
  const [callState, setCallState] = useState<CallClientState>(callClient.getState);

  callClient.onStateChange((state: CallClientState) => {
    if (state.callsEnded[props.callId]) {
      setCallEnded(true);
      return;
    }
    setCallState(state);
  });

  const onHangup = useCallback(async (): Promise<void> => {
    await endCallProps.onHangUp();
    setCallEnded(true);
  }, [endCallProps.onHangUp]);

  if (callEnded) {
    return (
      <CallEnded />);
  }

  if (call?.state === "Connecting") {
    return (
      <h1>Performing setup</h1>
    )
  }

  if (call?.state === "Ringing") {
    return (
      <Stack>
        <CallRinging />
        <ControlBar layout='floatingBottom'>
          {endCallProps && <EndCallButton {...endCallProps} onHangUp={onHangup} />}
        </ControlBar>
      </Stack>
    );
  }

  return (
    <Stack>
      <Stack>
        <Stack style={{ width: '12rem', marginLeft: 'auto', marginRight: 'auto', marginTop: '3rem' }}>
          <AddParticipantField onAddParticipant={call?.addParticipant} caller={props.caller}></AddParticipantField>
        </Stack>
        <div>
          <Stack horizontal style={{ width: '60rem', height: '60rem', margin: 'auto' }}>
            {videoGalleryProps && call?.state === 'Connected' && (<VideoGallery {...videoGalleryProps} />)}
            {callState.calls[props.callId].state === ("LocalHold" || "RemoteHold") && <CallHold />}
            <Stack>
              <h3 style={{padding: '0.5rem, 2rem'}}>In this call</h3>
              <ParticipantList {...participantListProps} />
            </Stack>

          </Stack>
          <Stack style={{ height: '17%' }}>
            <ControlBar layout='floatingBottom'>
              {cameraProps && <CameraButton  {...cameraProps} />}
              {microphoneProps && <MicrophoneButton   {...microphoneProps} />}
              {holdButtonProps && <HoldButton {...holdButtonProps} />}
              {endCallProps && <EndCallButton {...endCallProps} onHangUp={onHangup} />}
            </ControlBar>
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
  return <h1 style={{ margin: 'auto', height: '60rem' }}>The Call is on hold.</h1>;
}

function CallRinging(): JSX.Element {
  return <h1>Ringing</h1>
}

export default CallingComponents;