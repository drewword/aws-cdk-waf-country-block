import * as cdk from '@aws-cdk/core';
import { HelloWorldLambda } from './HelloWorldLambda';
import { CountryCodeBlocker } from './CountryCodeBlocker';

export class WafCountryGatewayDemoStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {

    super(scope, id, props);

    const restAPI = new HelloWorldLambda(this).restAPI;
    new CountryCodeBlocker(this,restAPI, this.region, ['US']);

  } 
}
