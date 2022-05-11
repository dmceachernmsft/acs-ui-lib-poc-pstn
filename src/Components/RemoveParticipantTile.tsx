import { ControlBar, EndCallButton, toFlatCommunicationIdentifier, RemoteParticipantState } from "@azure/communication-react";
import { CommunicationUserIdentifier, PhoneNumberIdentifier, MicrosoftTeamsUserIdentifier, UnknownIdentifier } from '@azure/communication-chat/node_modules/@azure/communication-signaling';
import {Stack} from '@fluentui/react'

export type RemoveParticipantTileProps = {
    remoteParticipant: RemoteParticipantState;
    onRemoveParticipant: (participant: PhoneNumberIdentifier | CommunicationUserIdentifier | MicrosoftTeamsUserIdentifier
        | UnknownIdentifier) => Promise<void>;
}

/**
 * tile for removing PSTN users 
 * 
 * This should be repurposed into a custom video tile for the video gallery
 */
export const RemoveParticipantTile = (props: RemoveParticipantTileProps): JSX.Element => {
    const {remoteParticipant} = props;
    const participantState = remoteParticipant.state;
    const identifier = toFlatCommunicationIdentifier(remoteParticipant.identifier);
    return (
      <Stack>
        <h2>{participantState}</h2>
        <h2>{identifier}</h2>
        <ControlBar>
          <EndCallButton onHangUp={() => props.onRemoveParticipant(remoteParticipant.identifier)}></EndCallButton>
        </ControlBar>
      </Stack>
    )
  };