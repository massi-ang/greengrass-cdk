import { Connector } from '../connector'
import {Construct} from '@aws-cdk/core'
export interface CloudWatchMetricsConnectorProps {
    readonly publishInterval: string;
    readonly publishRegion: string;
    /** Memory size in KB */
    readonly memorySize: string;
    /** Min value is 2000 */
    readonly maxMetricsToRetain: string;
    /** NoContainer or GreengrassContainer */
    readonly isolationMode: string;
}

export class CloudWatchMetrics extends Connector {
    private _parameters: any;
    constructor(scope: Construct, id: string, props: CloudWatchMetricsConnectorProps) {
        super(scope, id)
        this._parameters = props;
    }

    get parameters(): any {
        return this._parameters;
    }

    get connectorArn(): string {
        return "arn:aws:greengrass:region::/connectors/CloudWatchMetrics/versions/4"
    }
}