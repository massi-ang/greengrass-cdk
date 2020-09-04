import { Connector, ConnectorProps } from '../connector';
import { Construct } from '@aws-cdk/core';
export interface KinesisFirehoseConnectorProps extends ConnectorProps {
    readonly defaultDeliveryStreamArn: string;
    readonly deliveryStreamQueueSize: string;
    /** Memory size in KB */
    readonly memorySize: string;
    readonly publishInterval: string;
}
export declare class KinesisFirehose extends Connector {
    private _parameters;
    constructor(scope: Construct, id: string, props: KinesisFirehoseConnectorProps);
    get parameters(): any;
    get connectorArn(): string;
}
