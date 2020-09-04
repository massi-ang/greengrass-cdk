import * as gg from '@aws-cdk/aws-greengrass'
import { Construct } from '@aws-cdk/core';
export * from './connectors/cloudwatchmetrics';
export * from './connectors/iotanalytics';
export * from './connectors/iotsitewise';
export * from './connectors/kinesisfirehose';
export * from './connectors/mlfeedback';
export * from './connectors/devicedefender';
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
