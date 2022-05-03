import { ControlBarButton, ControlBarButtonProps, ControlBarButtonStrings } from "@azure/communication-react";
import { Icon } from '@fluentui/react';

export interface HoldButtonProps extends ControlBarButtonProps {
    onHold?: () => Promise<void>;
}
const holdButtonStrings: ControlBarButtonStrings = {
    label: 'hold',
    tooltipContent: 'Hold Call'
}

const onRenderHoldIcon = (): JSX.Element => <Icon iconName=""></Icon>

export const HoldButton = (props: HoldButtonProps): JSX.Element => {
    return (<ControlBarButton
        strings={holdButtonStrings}
        onRenderIcon={onRenderHoldIcon}
    />);
}