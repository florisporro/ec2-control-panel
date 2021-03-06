# Amazon EC2 Instance Control Panel

This is a very simple webtool to allow basic control of a single Amazon EC2 instance. We use it at my company to allow non-IT crew to reboot an instance that may have become unresponsive, and to upgrade the instance type to something with more power when we have a larger scale project. It works by accessing the Amazon SDK with an IAM key id and secret that you set in environment variables.

![](https://github.com/florisporro/ec2-control-panel/blob/master/screenshot.png)

## Getting Started

### From source

Clone to a local folder.

```bash
yarn install
yarn run dev
```

You need to create a .env file with the following contents:

```
TOOLNAME=Name of the tool / application, set to anything you like (defaults to 'Amazon EC2 Instance Controller')
INSTANCENAME=Name of the server you are controlling, set to anything you like (defaults to 'Amazon EC2 Instance')
AWS_REGION=Your region (defaults to eu-central-1)
AWS_INSTANCE_ID=Your instance ID
AWS_ACCESS_KEY_ID=Your access key (get it by creating an Amazon IAM account with the right access level)
AWS_SECRET_ACCESS_KEY=Your access secret (get it by creating an Amazon IAM account with the right access level)
AWS_INSTANCETYPE_SMALL=The instance type when the user uses the 'low performance' activation button (defaults to 't3.nano')
AWS_INSTANCETYPE_LARGE=The instance type when the user uses the 'high performance' activation button (defaults to 't3.2xlarge')
```

### With Docker

The docker image automatically exposes port 3000.

```bash
docker pull florisporro/ec2-control-panel
```

Make sure to set the above environment variables and forward port 3000 to a port of your choosing.

### Building

To build client-side for production:
```bash
yarn run build
```

To compile the docker image:

```bash
docker build -t {username}/{reponame} .
```