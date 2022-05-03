import { ControlBarButton, ControlBarButtonProps, ControlBarButtonStrings } from "@azure/communication-react";
import { CirclePauseSolidIcon } from '@fluentui/react-icons-mdl2'

export interface HoldButtonProps extends ControlBarButtonProps {
    // these should come from usePropsFor like the end call button
    onToggleHold: () => Promise<void>;
}
const holdButtonStrings: ControlBarButtonStrings = {
    label: 'hold',
    tooltipContent: 'Hold Call'
}

export const HoldButton = (props: HoldButtonProps): JSX.Element => {

const onRenderStopHoldIcon = (): JSX.Element => <CirclePauseSolidIcon />;

    return (<ControlBarButton
        {...props}
        strings={holdButtonStrings}
        onClick={props.onToggleHold ?? props.onClick}
        onRenderIcon={onRenderStopHoldIcon}
    />);
}