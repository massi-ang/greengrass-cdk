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

import * as gg from '@aws-cdk/aws-greengrass'
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

export abstract class Connector extends Construct {
    private id: string;
    constructor(scope: Construct, id: string, props?: ConnectorProps) {
        super(scope, id)
        this.id = id;
        props = props

    }
    /**
     * Implemented by concrete classes to provide the ARN of the connector
     */
    abstract get connectorArn(): string;

    /**
     * Implemented by concrete classes to provide the parameters for the connector
     */
    abstract get parameters(): any;

    
    resolve(): gg.CfnConnectorDefinition.ConnectorProperty {
        return {
            connectorArn: this.connectorArn,
            id: this.id,
            parameters: this.parameters
        }
    }
}

