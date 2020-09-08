/* 
 *  Copyright 2020 Amazon.com or its affiliates
 *  
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { Connector, ConnectorProps } from '../connector'
import { Construct } from '@aws-cdk/core'
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
export class Generic extends Connector {
    private _parameters: any;
    private _name: string;
    private _version: number;

    constructor(scope: Construct, id: string, props: GenericConnectorProps) {
        super(scope, id)
        this._parameters = props.parameters;
        this._name = props.name;
        this._version = props.version;
    }

    get parameters(): any {
        return this._parameters;
    }

    get connectorArn(): string {
        return `arn:aws:greengrass:region::/connectors/${this._name}/versions/${this._version}`
    }
}
