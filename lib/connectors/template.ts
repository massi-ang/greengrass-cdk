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
export interface TemplateConnectorProps extends ConnectorProps {
    readonly publishInterval: string;
    readonly publishRegion: string;
    /** Memory size in KB */
    readonly memorySize: string;
    /** Min value is 2000 */
    readonly maxMetricsToRetain: string;
    /** NoContainer or GreengrassContainer */
    readonly isolationMode: string;
}

export class Template extends Connector {
    private _parameters: any;
    constructor(scope: Construct, id: string, props: TemplateConnectorProps) {
        super(scope, id)
        this._parameters = props;
    }

    get parameters(): any {
        return this._parameters;
    }

    get connectorArn(): string {
        return "arn:aws:greengrass:region::/connectors/Template/versions/4"
    }
}