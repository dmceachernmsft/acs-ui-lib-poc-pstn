import { CallState } from '@azure/communication-calling';
import { usePropsFor, VideoGallery, ControlBar, CameraButton, MicrophoneButton, ScreenShareButton, EndCallButton, useCallClient } from '@azure/communication-react';
import { mergeStyles, Stack } from '@fluentui/react';
import { useCallback, useState } from 'react';
import { AddParticipantField } from './Components/AddParticipantField';
import { HoldButton } from './Components/HoldButton';

export type CallingComponentsProps = {
  onToggleHold: () => Promise<void>;
  onAddParticipant: (participant: string, caller: string) => Promise<void>;
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
  const callClientState = callClient.getState();

  const [callEnded, setCallEnded] = useState(false);
  const [callState, setCallState] = useState<CallState>();
  
  callClient.onStateChange(() => {
    setCallState(callClientState.calls[props.callId].state);
  })
  
  const onHangup = useCallback(async (): Promise<void> => {
    await endCallProps.onHangUp();
    setCallEnded(true);
  }, [endCallProps.onHangUp]);

  const onToggleHold = useCallback(async (): Promise<void> => {
    await props.onToggleHold();
  }, [props.onToggleHold])

  if (callEnded) {
    return (
      <CallEnded />);
  }

  if (callState === "Connecting") {
    return (
      <h1>Performing setup</h1>
    )
  }

  if (callState === "Ringing") {
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
    <Stack className={mergeStyles({ height: '100%' })}>
      <div style={{ width: '100vw', height: '100vh' }}>
        {videoGalleryProps && callState === 'Connected' && <VideoGallery {...videoGalleryProps} />}
        {callState === ("LocalHold" || "RemoteHold") && <CallHold />}
        <Stack style={{ width: '12rem', marginLeft: 'auto', marginRight: 'auto' }}>
          <AddParticipantField onAddParticipant={props.onAddParticipant} caller={props.caller}></AddParticipantField>
        </Stack>
      </div>
      <ControlBar layout='floatingBottom'>
        {cameraProps && <CameraButton  {...cameraProps} />}
        {microphoneProps && <MicrophoneButton   {...microphoneProps} />}
        {screenShareProps && <ScreenShareButton  {...screenShareProps} />}
        {onToggleHold && <HoldButton onToggleHold={onToggleHold} />}
        {endCallProps && <EndCallButton {...endCallProps} onHangUp={onHangup} />}
      </ControlBar>
    </Stack>
  );
}

function CallEnded(): JSX.Element {
  return <h1>You ended the call.</h1>;
}

function CallHold(): JSX.Element {
  return <h1>The Call is on hold.</h1>;
}

function CallRinging(): JSX.Element {
  return <h1>Ringing</h1>
}

export default CallingComponents;