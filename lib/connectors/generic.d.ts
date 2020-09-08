import { Connector, ConnectorProps } from '../connector';
import { Construct } from '@aws-cdk/core';
export interface GenericConnectorProps extends ConnectorProps {
    /**
     * The paramters for the connector.
     * Supported values can be found https://docs.aws.amazon.com/greengrass/latest/developerguide/connectors-list.html
     */
    readonly parameters: any;
    /**
     * The name of the connector, eg IotAnalitics
     */
    readonly name: string;
    /**
     * The version of the connector to use
     */
    readonly version: number;
}
/**
 * A generic Connector bag for adding those connectors not yet implemented with specific classes
 * Documentation for all connectors can be found https://docs.aws.amazon.com/greengrass/latest/developerguide/connectors-list.html
 */
export declare class Generic extends Connector {
    private _parameters;
    private _name;
    private _version;
    constructor(scope: Construct, id: string, props: GenericConnectorProps);
    get parameters(): any;
    get connectorArn(): string;
}
