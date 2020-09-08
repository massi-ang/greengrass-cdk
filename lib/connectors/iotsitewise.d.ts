import { Connector, ConnectorProps } from '../connector';
import { Construct } from '@aws-cdk/core';
export interface IoTSitewiseConnectorProps extends ConnectorProps {
    readonly siteWiseLocalStoragePath: string;
    readonly awsSecretArnList: string;
    /** Memory size in KB */
    readonly maximumBufferSize: string;
}
export declare class IoTSitewise extends Connector {
    private _parameters;
    constructor(scope: Construct, id: string, props: IoTSitewiseConnectorProps);
    get parameters(): any;
    get connectorArn(): string;
}
