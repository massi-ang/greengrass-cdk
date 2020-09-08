import { Connector, ConnectorProps } from '../connector';
import { Construct } from '@aws-cdk/core';
export interface IoTAnalyticsConnectorProps extends ConnectorProps {
    /** Size in kB */
    readonly memorySize: string;
    readonly publishInterval?: string;
    readonly publishRegion?: string;
    readonly iotAnalyticsMaxActiveChannels?: string;
    readonly iotAnalyticsQueueDropBehavior?: string;
    readonly iotAnalyticsQueueSizePerChannel?: string;
    readonly iotAnalyticsBatchSizePerChannel?: string;
    readonly iotAnalyticsDefaultChannelName?: string;
    readonly isolationMode?: string;
}
export declare class IoTAnalytics extends Connector {
    private _parameters;
    constructor(scope: Construct, id: string, props: IoTAnalyticsConnectorProps);
    get parameters(): any;
    get connectorArn(): string;
}
