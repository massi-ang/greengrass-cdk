import * as gg from '@aws-cdk/aws-greengrass'
import { Construct } from '@aws-cdk/core';
export * from './connectors/cloudwatchmetrics';
export interface ConnectorProps {

}

export abstract class Connector extends Construct {
    private id: string;
    constructor(scope: Construct, id: string, props?: ConnectorProps) {
        super(scope, id)
        this.id = id;
        props = props

    }
    abstract get connectorArn(): string;
    abstract get parameters(): any;

    resolve(): gg.CfnConnectorDefinition.ConnectorProperty {
        return {
            connectorArn: this.connectorArn,
            id: this.id,
            parameters: this.parameters
        }
    }
}
export interface DeviceDefenderConnectorProps {
    readonly sampleIntervalSeconds: string;
    readonly procDestinationPathResourceId: string;
    readonly procDestinationPath: string;
}

export class DeviceDefender extends Connector {
    private _parameters: any;
    constructor(scope: Construct, id: string, props: DeviceDefenderConnectorProps) {
        super(scope, id)
        this._parameters = props;
    }

    get parameters(): any {
        return this._parameters;
    }

    get connectorArn(): string {
        return "arn:aws:greengrass:region::/connectors/DeviceDefender/versions/3"
    }
}

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