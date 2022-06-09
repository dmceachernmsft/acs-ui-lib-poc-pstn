import { TextField, IconButton, Stack } from '@fluentui/react'
import { useState } from "react";
import { AddPhoneIcon } from '@fluentui/react-icons-mdl2';
import { PhoneNumberIdentifier } from '@azure/communication-signaling';
import { AddPhoneNumberOptions, RemoteParticipant } from '@azure/communication-calling';

export type AddParticipantFieldProps = {
    onAddParticipant?: (identifier: PhoneNumberIdentifier, caller: AddPhoneNumberOptions) => RemoteParticipant;
    caller: string;
}

export const AddParticipantField = (props: AddParticipantFieldProps): JSX.Element => {
    const { onAddParticipant, caller } = props;
    const [participant, setParticipant] = useState<string | undefined>(undefined);

    const setText = (
        event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
        newValue?: string | undefined
    ): void => {
        if (newValue === undefined) {
            return;
        }
        setParticipant(newValue);
    };

    return (
        <Stack horizontal disableShrink>
            <TextField onChange={setText}>
            </TextField><IconButton onRenderIcon={() => <AddPhoneIcon />} onClick={() => {
                if (participant && caller && onAddParticipant) {
                    const phoneNumber = { phoneNumber: participant }
                    const callerId = { alternateCallerId: { phoneNumber: caller } }
                    onAddParticipant(phoneNumber, callerId);
                }
            }}></IconButton>
        </Stack>);
}