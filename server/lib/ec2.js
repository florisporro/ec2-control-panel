// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const EventEmitter = require('events').EventEmitter;
const logging = require('./logging');

class EC2_Controller extends EventEmitter {
  constructor() {
    super();
    
    if (process.env.AWS_REGION === undefined) logging.log("No region defined, defaulting to eu-central-1.", "info");
    this.AWS_REGION = process.env.AWS_REGION || 'eu-central-1';
    
    if (process.env.AWS_INSTANCE_ID === undefined) throw new Error("No instance ID defined!");
    this.AWS_INSTANCE_ID = process.env.AWS_INSTANCE_ID;
    
    if (process.env.AWS_INSTANCETYPE_SMALL === undefined) logging.log("No small instancetype defined, defaulting to t1.micro.", "info");
    this.AWS_INSTANCETYPE_SMALL = process.env.AWS_INSTANCETYPE_SMALL || 't3.nano';
    
    if (process.env.AWS_INSTANCETYPE_LARGE === undefined) logging.log("No large instancetype defined, defaulting to t3.2xlarge.", "info");
    this.AWS_INSTANCETYPE_LARGE = process.env.AWS_INSTANCETYPE_LARGE || 't3.2xlarge';
    
    if (process.env.AWS_ACCESS_KEY_ID === undefined) throw new Error("No access key ID given!");
    
    if (process.env.AWS_SECRET_ACCESS_KEY === undefined) throw new Error("No secret key given!");
    
    // Set the region 
    AWS.config.update({region: this.AWS_REGION});
    this.ec2 = new AWS.EC2({apiVersion: '2016-11-15'});
  }
  
  get params() {
    return {
      InstanceIds: [this.AWS_INSTANCE_ID]
    }
  }
  
  getStatus() {
    let params = {
      InstanceIds: [this.AWS_INSTANCE_ID],
      IncludeAllInstances: true
    };

    this.ec2.describeInstanceStatus(params, (err, data) => {
      if (err) logging.log(err.stack, 'danger');
      else     this.emit('status', data);
    });

    params = {
      InstanceId: this.AWS_INSTANCE_ID,
      Attribute: "instanceType"
    };
    
     this.ec2.describeInstanceAttribute(params, (err, data) => {
      if (err) logging.log(err.stack, 'danger');
      else     this.emit('instanceTypeStatus', data);
    });
  }
  
  startInstance() {
    this.ec2.startInstances(this.params, (err, data) => {
      if (err) logging.log(err.stack, 'danger');
      setTimeout(() => { this.getStatus() }, 5000);
    });
  }
  
  stopInstance() {
    this.ec2.stopInstances(this.params, (err, data) => {
      if (err) logging.log(err.stack, 'danger');
      setTimeout(() => { this.getStatus() }, 5000);
    });
  }
  
  rebootInstance() {
    this.ec2.rebootInstances(this.params, (err, data) => {
      if (err) logging.log(err.stack, 'danger');
      setTimeout(() => { this.getStatus() }, 5000);
    });
  }
  
  changeInstanceType(type) {
    let params = {
      InstanceId: this.AWS_INSTANCE_ID,
      InstanceType: {
        Value: type === 'large' ? this.AWS_INSTANCETYPE_LARGE : this.AWS_INSTANCETYPE_SMALL
      }
    };
    this.ec2.modifyInstanceAttribute(params, (err, data) => {
      if (err) logging.log(err.stack, 'danger');
      setTimeout(() => { this.getStatus() }, 5000);
    });
  }
}

module.exports = EC2_Controller;