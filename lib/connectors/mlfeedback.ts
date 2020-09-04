/* 
 *  Copyright 2020 Massimiliano Angelino
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


export interface MLFeedbackConnectorProps extends ConnectorProps {
    /**
     * A key-value map for different configurations.
     * Each configuration has the following properties:
     *  
     * {
        "s3-bucket-name": "my-aws-bucket-random-sampling",
        "s3-prefix": "aa"
        "content-type": "image/png",
        "file-ext": "png",
        "sampling-strategy": {
            "strategy-name": "RANDOM_SAMPLING|LEASTCONFIDENCE|MARGIN|ENTROPY",
            "rate": 0.5,
            "threshold": 1
        }
      }
     */
    readonly feedbackConfigurationMap: any;
    readonly requestLimit?: string;
    
}

export class MLFeedback extends Connector {
    private _parameters: any;
    constructor(scope: Construct, id: string, props: MLFeedbackConnectorProps) {
        super(scope, id)
        this._parameters = props;
    }

    get parameters(): any {
        return this._parameters;
    }

    get connectorArn(): string {
        return "arn:aws:greengrass:region::/connectors/MLFeedback/versions/4"
    }
}
