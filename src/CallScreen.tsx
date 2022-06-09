import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { CallAgentProvider, CallClientProvider, CallProvider, createStatefulCallClient, DEFAULT_COMPONENT_ICONS, FluentThemeProvider, StatefulCallClient } from '@azure/communication-react';
import { useEffect, useState } from 'react';
import CallingComponents from './CallingComponents';
import { registerIcons } from '@fluentui/react';
import { Call, CallAgent } from '@azure/communication-calling';
import { CirclePauseIcon, CirclePauseSolidIcon } from '@fluentui/react-icons-mdl2'
import { CommunicationUserIdentifier, MicrosoftTeamsUserIdentifier, PhoneNumberIdentifier, UnknownIdentifier } from '@azure/communication-common';
export interface CallScreenProps {
    userToken: string,
    userId: string,
    calleeNumber: string,
    callerNumber: string,
}

export const CallScreen = (props: CallScreenProps): JSX.Element => {
    const { userToken, userId, calleeNumber, callerNumber } = props;
    const tokenCredential = new AzureCommunicationTokenCredential(userToken);
    const [statefulCallClient, setStatefulCallClient] = useState<StatefulCallClient>();
    const [callAgent, setCallAgent] = useState<CallAgent>();
    const [call, setCall] = useState<Call>();
    const [callFailed, setCallFailed] = useState<boolean>(false);

    registerIcons({ icons: { ...DEFAULT_COMPONENT_ICONS, CirclePauseIcon: <CirclePauseIcon />, CirclePauseSolidIcon: <CirclePauseSolidIcon /> } });

    /**
     * Something we should look into is the kind of id's that we accept to make
     * the calling-stateful-client. The issue here with this is we can't use the stateful client to get the 
     * caller's phone number if we need to make a ACS UserId to make the client since when we ask for the caller's info what
     * comes back is the users userId not the phoneNumber.
     */
    useEffect(() => {
        setStatefulCallClient(createStatefulCallClient({
            userId: { communicationUserId: userId }
        }));
    }, [])

    useEffect(() => {
        if (callAgent === undefined && statefulCallClient) {

            const createUserAgent = async () => {
                console.log('Creating CallAgent');
                setCallAgent(await statefulCallClient.createCallAgent(tokenCredential))
            }
            createUserAgent();
        }
    }, [statefulCallClient, tokenCredential])

    useEffect(() => {
        if (callAgent !== undefined) {
            let call;
            try {
                call = callAgent.startCall([{ phoneNumber: calleeNumber }], { alternateCallerId: { phoneNumber: callerNumber } })
            } catch (e) {
                console.log(e);
                setCallFailed(true);
            }
            setCall(call);
            console.log(`CallId ${call?.id}`);
        }
    }, [callAgent, calleeNumber, callerNumber])

    if (callFailed || call?.callEndReason?.code === 403){
        return callFailedMessage();
    }

    return (
        <>
            <FluentThemeProvider>
                {statefulCallClient && <CallClientProvider callClient={statefulCallClient}>
                    {callAgent && <CallAgentProvider callAgent={callAgent}>
                        {call && <CallProvider call={call}>
                            <CallingComponents
                                callId={call.id}
                                caller={callerNumber}
                            />
                        </CallProvider>}
                    </CallAgentProvider>}
                </CallClientProvider>}
            </FluentThemeProvider>
        </>
    );

}


const callFailedMessage = (): JSX.Element => {
    return (
        <>
            <h1>There was a problem starting the call.</h1>
        </>
    )
}