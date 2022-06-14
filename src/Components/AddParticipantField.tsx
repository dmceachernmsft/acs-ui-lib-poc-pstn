import { IconButton, Stack } from '@fluentui/react'
import { useState } from "react";
import { AddPhoneIcon } from '@fluentui/react-icons-mdl2';
import { PhoneNumberIdentifier } from '@azure/communication-signaling';
import { AddPhoneNumberOptions, RemoteParticipant } from '@azure/communication-calling';
import { Dialpad, usePropsFor } from '@azure/communication-react';

export type AddParticipantFieldProps = {
    onAddParticipant?: (identifier: PhoneNumberIdentifier, caller: AddPhoneNumberOptions) => RemoteParticipant;
    caller: string;
}

export const AddParticipantField = (props: AddParticipantFieldProps): JSX.Element => {
    const { onAddParticipant, caller } = props;
    const [participant, setParticipant] = useState<string | undefined>('+');

    const dialpadProps = usePropsFor(Dialpad);
    const onChange = (input: string): void => {
        setParticipant(`+${input.split(' ').join('').replace('(','').replace(')', '').replace('-','')}`);
    }
    return (
        <Stack horizontal disableShrink>
            <Dialpad {...dialpadProps} onChange={onChange}/> 
            <IconButton onRenderIcon={() => <AddPhoneIcon />} onClick={() => {
                if (participant && caller && onAddParticipant) {
                    const phoneNumber = { phoneNumber: participant }
                    const callerId = { alternateCallerId: { phoneNumber: caller } }
                    onAddParticipant(phoneNumber, callerId);
                }
            }}></IconButton>
        </Stack>);
}