import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { CallAgentProvider, CallClientProvider, CallProvider, createStatefulCallClient, DEFAULT_COMPONENT_ICONS, FluentThemeProvider, StatefulCallClient } from '@azure/communication-react';
import { useEffect, useState } from 'react';
import CallingComponents from './CallingComponents';
import { registerIcons } from '@fluentui/react';
import { Call, CallAgent } from '@azure/communication-calling';

export interface CallScreenProps {
    userToken: string,
    userId: string,
    calleeNumber: string,
    callerNumber: string,
}

export const CallScreen = (props: CallScreenProps): JSX.Element => {
    const { userToken, userId, calleeNumber, callerNumber } = props;
    const tokenCredential = new AzureCommunicationTokenCredential(userToken);
    const [statefulCallClient, setStatefulCallClient] = useState<StatefulCallClient>()
    const [callAgent, setCallAgent] = useState<CallAgent>()
    const [call, setCall] = useState<Call>()

    registerIcons({ icons: DEFAULT_COMPONENT_ICONS });

    useEffect(() => {
        setStatefulCallClient(createStatefulCallClient({
            userId: { communicationUserId: userId }
        }));
    },[])

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
            const call = callAgent.startCall([{ phoneNumber: calleeNumber }], { alternateCallerId: { phoneNumber: callerNumber } })
            setCall(call);
            console.log(`CallId ${call?.id}`);
        }
    }, [callAgent, calleeNumber, callerNumber])
    
    return (
        <>
            <FluentThemeProvider>
                {statefulCallClient && <CallClientProvider callClient={statefulCallClient}>
                    {callAgent && <CallAgentProvider callAgent={callAgent}>
                        {call && <CallProvider call={call}>
                            <CallingComponents call={call}/>
                        </CallProvider>}
                    </CallAgentProvider>}
                </CallClientProvider>}
            </FluentThemeProvider>
        </>
    );
}