#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { WafCountryGatewayDemoStack } from '../lib/WafCountryGatewayDemoStack';

const app = new cdk.App();
new WafCountryGatewayDemoStack(app, 'WafCountryDemoStack');