import { Connector, ConnectorProps } from '../connector';
import { Construct } from '@aws-cdk/core';
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
export declare class MLFeedback extends Connector {
    private _parameters;
    constructor(scope: Construct, id: string, props: MLFeedbackConnectorProps);
    get parameters(): any;
    get connectorArn(): string;
}
