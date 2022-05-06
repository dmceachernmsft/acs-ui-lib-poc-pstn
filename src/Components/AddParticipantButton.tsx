import { ControlBarButtonProps, ControlBarButtonStrings } from "@azure/communication-react";

export interface AddParticipantButtonProps extends ControlBarButtonProps {
    onAddParticipant: () => Promise<void>;
}

const addParticiapntButtonStrings: ControlBarButtonStrings = {
    label: 'Add Participant',
    tooltipContent: 'Add Participant'
}

export const AddParticipantButton = (props: AddParticipantButtonProps): JSX.Element => {
    return (<></>);
}