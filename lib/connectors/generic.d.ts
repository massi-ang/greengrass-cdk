import { Connector, ConnectorProps } from '../connector';
import { Construct } from '@aws-cdk/core';
export interface GenericConnectorProps extends ConnectorProps {
    readonly parameters: any;
    readonly name: string;
    readonly version: number;
}
export declare class Generic extends Connector {
    private _parameters;
    private _name;
    private _version;
    constructor(scope: Construct, id: string, props: GenericConnectorProps);
    get parameters(): any;
    get connectorArn(): string;
}
