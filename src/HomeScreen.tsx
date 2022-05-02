import { Stack, Text, TextField, PrimaryButton } from '@fluentui/react';
import { useState } from 'react';

export type HomeScreenProps = {
    startCallHandler(callDetails: { callerNumber: string, calleeNumber: string, userToken: string, userId: string }): void;
}

export const HomeScreen = (props: HomeScreenProps): JSX.Element => {

    const [calleeNumber, setCalleeNumber] = useState<string>();
    const [callerNumber, setCallerNumber] = useState<string>();
    const [userToken, setUserToken] = useState<string>();
    const [userId, setUserId] = useState<string>();

    return (<Stack>
        <Text role={'heading'}>ACS UI PSTN Sample</Text>
        <TextField
            placeholder='enter the number of who you want to call'
            onChange={(_, newValue) => newValue && setCalleeNumber(newValue)} />
        <TextField
            placeholder='enter your ACS Phone number'
            onChange={(_, newValue) => newValue && setCallerNumber(newValue)} />
        <TextField
            placeholder='Enter your ACS user Token'
            onChange={(_, newValue) => newValue && setUserToken(newValue)} />
        <TextField
            placeholder='Enter the userId matched with the Token'
            onChange={(_, newValue) => newValue && setUserId(newValue)} />
        <PrimaryButton text='Start Call' onClick={() => {
            if (calleeNumber && callerNumber && userToken && userId) {
                props.startCallHandler({ callerNumber, calleeNumber, userToken, userId });
            }
        }} />
    </Stack>);
}