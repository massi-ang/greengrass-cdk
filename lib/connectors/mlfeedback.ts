import { Connector } from '../connector'
import { Construct } from '@aws-cdk/core'


export interface MLFeedbackConnectorProps {
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
