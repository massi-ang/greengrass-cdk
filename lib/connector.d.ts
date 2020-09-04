import * as gg from '@aws-cdk/aws-greengrass';
import { Construct } from '@aws-cdk/core';
export interface ConnectorProps {
}
export declare abstract class Connector extends Construct {
    private id;
    constructor(scope: Construct, id: string, props?: ConnectorProps);
    abstract get connectorArn(): string;
    abstract get parameters(): any;
    resolve(): gg.CfnConnectorDefinition.ConnectorProperty;
}
