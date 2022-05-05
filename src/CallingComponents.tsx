import { usePropsFor, VideoGallery, ControlBar, CameraButton, MicrophoneButton, ScreenShareButton, EndCallButton, useCallClient } from '@azure/communication-react';
import { mergeStyles, Stack } from '@fluentui/react';
import { useCallback, useEffect, useState } from 'react';
import { HoldButton } from './Components/HoldButton';

export type CallingComponentsProps = {
  onToggleHold: () => Promise<void>;
  callId: string;
}

function CallingComponents(props: CallingComponentsProps): JSX.Element {

  const videoGalleryProps = usePropsFor(VideoGallery);
  const cameraProps = usePropsFor(CameraButton);
  const microphoneProps = usePropsFor(MicrophoneButton);
  const screenShareProps = usePropsFor(ScreenShareButton);
  const endCallProps = usePropsFor(EndCallButton);
  const callClient = useCallClient();
  const callState = callClient.getState();

  const [callEnded, setCallEnded] = useState(false);
  const [callOnHold, setCallOnHold] = useState(false);

  const onHangup = useCallback(async (): Promise<void> => {
    await endCallProps.onHangUp();
    setCallEnded(true);
  }, [endCallProps.onHangUp]);

  const onToggleHold = useCallback(async (): Promise<void> => {
    await props.onToggleHold();
  }, [props.onToggleHold])

  useEffect(() => {
    if (callState.calls[props.callId].state === ("LocalHold" || "RemoteHold")) {
      setCallOnHold(true);
    } else {
      setCallOnHold(false);
    }
  }, [callState.calls, props.callId]);

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

  return (
    <Stack className={mergeStyles({ height: '100%' })}>
      <div style={{ width: '100vw', height: '100vh' }}>
        {videoGalleryProps && !callOnHold && <VideoGallery {...videoGalleryProps} />}
        {callOnHold && <CallHold />}
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