import { Connector } from '../connector'
import { Construct } from '@aws-cdk/core'
export interface IoTAnalyticsConnectorProps {
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

export class IoTAnalytics extends Connector {
    private _parameters: any;
    constructor(scope: Construct, id: string, props: IoTAnalyticsConnectorProps) {
        super(scope, id)
        this._parameters = props;
    }

    get parameters(): any {
        return this._parameters;
    }

    get connectorArn(): string {
        return "arn:aws:greengrass:region::/connectors/IoTAnalytics/versions/3"
    }
}