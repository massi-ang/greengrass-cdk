import { Connector } from '../connector'
import { Construct } from '@aws-cdk/core'
export interface KinesisFirehoseConnectorProps {
    readonly defaultDeliveryStreamArn: string;
    readonly deliveryStreamQueueSize: string;
    /** Memory size in KB */
    readonly memorySize: string;
    readonly publishInterval: string;

}

export class KinesisFirehose extends Connector {
    private _parameters: any;
    constructor(scope: Construct, id: string, props: KinesisFirehoseConnectorProps) {
        super(scope, id)
        this._parameters = props;
    }

    get parameters(): any {
        return this._parameters;
    }

    get connectorArn(): string {
        return "arn:aws:greengrass:region::/connectors/KinesisFirehose/versions/4"
    }
}
