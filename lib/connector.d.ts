import * as gg from '@aws-cdk/aws-greengrass';
import { Construct } from '@aws-cdk/core';
/**
 * Common Connector properties interface.
 * Each connector extends this interface.
 */
export interface ConnectorProps {
}
/**
 * The abstract connector class
 *
 * Specific connectors extends this class
 */
export declare abstract class Connector extends Construct {
    private id;
    constructor(scope: Construct, id: string, props?: ConnectorProps);
    /**
     * Implemented by concrete classes to provide the ARN of the connector
     */
    abstract get connectorArn(): string;
    /**
     * Implemented by concrete classes to provide the parameters for the connector
     */
    abstract get parameters(): any;
    resolve(): gg.CfnConnectorDefinition.ConnectorProperty;
}
