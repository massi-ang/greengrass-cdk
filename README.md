# Greengrass CDK Construct

To test this construct:

1. Modify `cdk/bin/cdk.ts` with the ARN of thing Certificate that exists in the account you will deploy the stack

2. Execute:

```
cd cdk
npm i
npm run build
cdk synth
cdk deploy
```

## Change the stack

The resources deployed by this stack are defined in `cdk/lib/stack.ts`. 

A dummy lambda function is in `src`.

## NOTE

**2020-08-31**
Devices and Connectors are not fully implemented and are not supposed to work.


