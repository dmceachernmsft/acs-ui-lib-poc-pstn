import { Stack, Text, TextField, PrimaryButton, IStackStyles, IStyle } from '@fluentui/react';
import { useState } from 'react';

export type HomeScreenProps = {
    startCallHandler(callDetails: { callerNumber: string, calleeNumber: string, userToken: string, userId: string }): void;
}

export const HomeScreen = (props: HomeScreenProps): JSX.Element => {

    const [calleeNumber, setCalleeNumber] = useState<string>();
    const [callerNumber, setCallerNumber] = useState<string>();
    const [userToken, setUserToken] = useState<string>();
    const [userId, setUserId] = useState<string>();

    return (<Stack styles={homeScreenContainerStyles}>
        <Text role={'heading'}>ACS UI PSTN Sample</Text>
        <Stack>
            <TextField
                styles={textFieldStyles}
                placeholder='Enter the number of who you want to call'
                onChange={(_, newValue) => newValue && setCalleeNumber(newValue)} />
            <TextField
                styles={textFieldStyles}
                placeholder='Enter your ACS Phone number'
                onChange={(_, newValue) => newValue && setCallerNumber(newValue)} />
            <TextField
                styles={textFieldStyles}
                placeholder='Enter your ACS user Token'
                onChange={(_, newValue) => newValue && setUserToken(newValue)} />
            <TextField
                styles={textFieldStyles}
                placeholder='Enter the userId matched with the Token'
                onChange={(_, newValue) => newValue && setUserId(newValue)} />
        </Stack>

        <PrimaryButton text='Start Call' onClick={() => {
            if (calleeNumber && callerNumber && userToken && userId) {
                props.startCallHandler({ callerNumber, calleeNumber, userToken, userId });
            }
        }} />
    </Stack>);
}

const homeScreenContainerStyles: IStackStyles = {
    root: {
        width: '25rem',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '20rem'

    }
}

const textFieldStyles = {
    root: {
        padding: '1rem'
    }
}