# Catapult Angular App

Catapult Angular App is a general-purpose frontend Angular Web App that uses federated identity providers to authenticate app users. This app is designed to be hosted using [AWS Amplify Hosting](https://docs.aws.amazon.com/amplify/latest/userguide/welcome.html).

## Create Developer Machine
This tutorial assumes you have an [AWS Account](https://aws.amazon.com/account/), and you have [Administrator job function](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_job-functions.html) access to the AWS Management Console.

To get started:

* Select your [AWS Region](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html). Supported AWS Regions include: us-east-1, us-east-2, us-west-2, eu-west-1, eu-central-1, ap-southeast-1, ap-southeast-2, ap-northeast-1, ap-northeast-2, and ap-south-1.
* [Create a new VPC](https://docs.aws.amazon.com/vpc/latest/userguide/create-vpc.html#create-vpc-only), or use the existing default VPC in your selected region (highly recommnended).
* In your selected VPC, enure you have at least one [public subnet](https://docs.aws.amazon.com/vpc/latest/userguide/create-subnets.html) available. 
* If you do not already have an Amazon EC2 key pair, [create a new Amazon EC2 key pair](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html#prepare-key-pair). You will need the key pair name to specify the `KeyName` parameter when creating the CloudFormation stack below.
* Clone this Git repository on your laptop using [`git clone `](https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository).

### Create Developer Machine
Use the AWS CloudFormation template [angular-dev-machine.yaml](cfn/angular-dev-machine.yaml) from your cloned  repository to create a new CloudFormation stack using the [ AWS Management console](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-console-create-stack.html), or using the [AWS CLI](https://docs.aws.amazon.com/cli/latest/reference/cloudformation/create-stack.html).

The template [angular-dev-machine.yaml](cfn/angular-dev-machine.yaml) creates [AWS Identity and Access Management (IAM)](https://aws.amazon.com/iam/) resources. If you are creating CloudFormation Stack using the console, in the review step, you must check 
**I acknowledge that AWS CloudFormation might create IAM resources.** If you use the `aws cloudformation create-stack` CLI, you must use `--capabilities CAPABILITY_NAMED_IAM`. 

### Connect to Developer Machine using SSH

* Once the stack status in CloudFormation console is `CREATE_COMPLETE`, find the Angular Developer Machine instance launched in your stack in the Amazon EC2 console, and [connect to the instance using SSH](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstancesLinux.html) as user `ubuntu`, using your SSH key pair.
* When you connect using SSH, and you see the message `"Cloud init in progress! Logs: /var/log/cloud-init-output.log. Machine will REBOOT after cloud init is complete!!"`, disconnect and try later after about 15 minutes. 
* If you see the message `Angular Developer Machine is ready!`, run the command `sudo passwd ubuntu` to set a new password for user `ubuntu`. Now you are ready to connect to the developer machine using the [Amazon DCV client](https://docs.aws.amazon.com/dcv/latest/userguide/client.html)

### Connect to Machine using Amazon DCV Client
* Download and install the [Amazon DCV client](https://docs.aws.amazon.com/dcv/latest/userguide/client.html) on your laptop.
* Use the Amazon DCV Client to login to the developer machine as user `ubuntu`
* When you first login to the developer machine using the Amazon DCV client, you may be be asked if you would like to upgrade the OS version. **Do not upgrade the OS version** .

## AWS Setup for Catapult Angular App

Below we describe the steps for Catapult Angular App setup.

### Register a Domain in Amazon Route 53

To get started, first, either [register a new domain in Amazon Route 53](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/domain-register.html), or, if you already have a domain you want to use, transfer it into Route 53.

### Request Public Certificate

[Request a public certificate](https://docs.aws.amazon.com/acm/latest/userguide/acm-public-certificates.html#request-public-console) in AWS Region `us-east-1` for use with [AWS Amplify Hosting](https://aws.amazon.com/amplify/hosting/). AWS Amplify Hosting requires the public certificate to be in `us-east-1`.

For domain names in the requested public certificate, include `*.yourdomain` and `yourdomain`. For example, `*.example.com` and `example.com`.  Use Route 53 **DNS validation** to validate requested public certificate. Make sure the validation CNAME record value you add to Route 53 for DNS validation **does not end in a period**.

### Configure Cognito User Pool with Federated Identity Provider (IdP)

We configure a Google OAuth 2.0 client for web application within Google Cloud Platform (GCP), and a Cognito User Pool within AWS cloud. Our Angular web application authenticates via Cognito User pool. 

For the purposes of OAuth 2.0 flow, AWS Cognito user pool acts as a web application client to GCP OAuth 2.0 IdP, and uses [Google OAuth 2.0 Authorization code flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow) with Google IdP to autheticate Angular web application user.

#### Configure Google as a Federated IdP: 

Create a Google Cloud project: You'll need to create a Google Cloud project and configure an OAuth 2.0 client ID for your Cognito User Pool. This client ID will be used to connect your Cognito User Pool to Google.  

* [Create a Google Cloud Application](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-social-idp.html#cognito-user-pools-social-idp-step-1): In the Google Cloud console, create a new OAuth 2.0 application. This will generate your Client ID and Client Secret.
    * For application name, we suggest `cognito-google`
    * For **Authorized JavaScript origins**, use **Add a URI**: `https://your-registered-domain`, for example, `https://foo.example.com`
    * For **Authorized redirct URIs**, use **Add a URI**: `https://your-registered-domain/oauth2/idpresponse`

* [Add Google as a Federated IdP in Cognito](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-social-idp.html#cognito-user-pools-social-idp-step-2)

* [Configure your registered domain in Cognito](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-add-custom-domain.html) using Managed Login option


### Setup Git Hub Repository

For hosting your Catapult Angular App using Amplify, you must create a **fork** of this Git Hub repository in your Github account. Git clone your forked repository under `/home/ubuntu` on the developer machine, and use that for your Catapult Angular App development with Amplify Hosting.  

**Make sure your forked Github repository is private.**

### Install Local Packages

To develop code using Visual Code on the developer machine, you need to install required packages locally in your cloned project using:

    npm install

Be sure to not check in the installed packages into your forked Github repository.

In Visual Code, edit [auth-config.ts](src/app/auth/auth.config.ts), [app.component.ts](src/app/app.component.ts) with required configuration information.

### Amplify Hosting

Deploy your app in AWS Amplify using your forked Github. Every time you check in code in your forked Github, it will redeploy the app.











