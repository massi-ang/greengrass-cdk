import { Connector } from '../connector'
import { Construct } from '@aws-cdk/core'
export interface IoTSitewiseConnectorProps {
    readonly siteWiseLocalStoragePath: string;
    readonly awsSecretArnList: string;
    /** Memory size in KB */
    readonly maximumBufferSize: string;
}

export class IoTSitewise extends Connector {
    private _parameters: any;
    constructor(scope: Construct, id: string, props: IoTSitewiseConnectorProps) {
        super(scope, id)
        this._parameters = props;
    }

    get parameters(): any {
        return this._parameters;
    }

    get connectorArn(): string {
        return "arn:aws:greengrass:region::/connectors/IoTSitewise/versions/7"
    }
}
