# RELEASE NOTES

## v0.3.5
2020-09-08
* bumped to CDK 1.62.0
* support for `Connectors`
* support for Spooler configuration
* support for Stream manager configuration
* support for automatic IP detection configuration
* support for `Devices`
* tests
* implementation of `Subscriptions` class to manage subscriptions


## v0.2.0 
2020-09-04

* renamed `greengrass.ts` to `index.ts`, meaning that the import of the library is now `import * as gg from '<folder>/lib'`
* renamed `GGLambda` to `Function` and the `Function` namespace to `Functions`
* modified the `memory` property type of `FunctionProps` from `number` to `cdk.Size`
* modified the `timeout` property type of `FunctionProps` from `number` to `cdk.Duration`
* moved the sample stack application in the `./sample` folder