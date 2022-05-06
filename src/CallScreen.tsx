import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { CallAgentProvider, CallClientProvider, CallProvider, createStatefulCallClient, DEFAULT_COMPONENT_ICONS, FluentThemeProvider, StatefulCallClient } from '@azure/communication-react';
import { useEffect, useState } from 'react';
import CallingComponents from './CallingComponents';
import { registerIcons } from '@fluentui/react';
import { Call, CallAgent } from '@azure/communication-calling';
import { CirclePauseIcon, CirclePauseSolidIcon } from '@fluentui/react-icons-mdl2'


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

    registerIcons({ icons: { ...DEFAULT_COMPONENT_ICONS, CirclePauseIcon: <CirclePauseIcon />, CirclePauseSolidIcon: <CirclePauseSolidIcon /> } });

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
            const call = callAgent.startCall([{ phoneNumber: calleeNumber }], { alternateCallerId: { phoneNumber: callerNumber } })
            setCall(call);
            console.log(`CallId ${call?.id}`);
        }
    }, [callAgent, calleeNumber, callerNumber])

    console.log(call?.state);

    /**
     * Something like this should be in the handlers like how screen share and end call buttons are. 
     * Callable through usePropsFor(HoldButton).
     * We would want 2 new handlers onHold() and onResume() in CreateHandlers.ts
     * @returns Call back to hold the call
     */
    const onToggleHold = async (): Promise<void> => {
        if (call?.state === 'LocalHold') {
            return await call?.resume();
        } else {
            return await call?.hold();
        }
    }

    return (
        <>
            <FluentThemeProvider>
                {statefulCallClient && <CallClientProvider callClient={statefulCallClient}>
                    {callAgent && <CallAgentProvider callAgent={callAgent}>
                        {call && <CallProvider call={call}>
                            <CallingComponents callId={call.id} onToggleHold={onToggleHold} />
                        </CallProvider>}
                    </CallAgentProvider>}
                </CallClientProvider>}
            </FluentThemeProvider>
        </>
    );
}