import { Connector } from '../connector'
import { Construct } from '@aws-cdk/core'
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

