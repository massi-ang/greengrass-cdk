import { Connector, ConnectorProps } from '../connector';
import { Construct } from '@aws-cdk/core';
export interface DeviceDefenderConnectorProps extends ConnectorProps {
    readonly sampleIntervalSeconds: string;
    readonly procDestinationPathResourceId: string;
    readonly procDestinationPath: string;
}
export declare class DeviceDefender extends Connector {
    private _parameters;
    constructor(scope: Construct, id: string, props: DeviceDefenderConnectorProps);
    get parameters(): any;
    get connectorArn(): string;
}
