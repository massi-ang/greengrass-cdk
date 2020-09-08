import { Connector, ConnectorProps } from '../connector';
import { Construct } from '@aws-cdk/core';
export interface CloudWatchMetricsConnectorProps extends ConnectorProps {
    readonly publishInterval: string;
    readonly publishRegion: string;
    /** Memory size in KB */
    readonly memorySize: string;
    /** Min value is 2000 */
    readonly maxMetricsToRetain: string;
    /** NoContainer or GreengrassContainer */
    readonly isolationMode: string;
}
export declare class CloudWatchMetrics extends Connector {
    private _parameters;
    constructor(scope: Construct, id: string, props: CloudWatchMetricsConnectorProps);
    get parameters(): any;
    get connectorArn(): string;
}
