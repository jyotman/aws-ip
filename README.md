# AWS-IP

##### Update your IP address to multiple security groups on AWS EC2

### Installation
```bash
npm install -g aws-ip
```

### Usage
A simple config file with the name *config.json* needs to be created which contains all the information required to access the security groups and put the relevant IP addresses and ports.

A sample config file - 

```json
{
  "accessKeyId": "SDJFF9NIGNFOG09340MD",
  "secretAccessKey": "bb2+KJIUjkif8934nfjke/sfefneurifneirn+sf",
  "region": "ap-south-1",
  "port": 22,
  "ip": ["192.168.1.1", "122.162.228.18"],
  "groupIds": ["sg-d2ebd6bb"]
}
```

* accessKeyId - AWS profile's access key ID.
* secretAccessKey - AWS profile's secret access key.
* region - AWS region in which you want to update security groups.
* port (optional) - Port number to access through your security groups. Default is 22 (SSH).
* ip (optional) - IP addresses which need to be given inbound access. Defaults to the current IP address.
* groupIds (optional) - All the security groups which need be updated with the IP addresses. Defaults to all security groups in the region.

After creating the *config.json* file, simply run this app providing the absolute path to the config file - 

```bash
CONFIG=/home/username/config.json aws-ip
```

This will handle all the things from here and the security groups would be updated with the information provided.

### Permissions
Make sure the AWS credentials you provide, has the following permissions -
1. "ec2:AuthorizeSecurityGroupIngress"
2. "ec2:DescribeSecurityGroups"
  
A sample policy could look like this - 

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "Stmt1215115857555",
            "Effect": "Allow",
            "Action": [
                "ec2:AuthorizeSecurityGroupIngress",
                "ec2:DescribeSecurityGroups"
            ],
            "Resource": [
                "*"
            ]
        }
    ]
}
```

### Requirements
1. Node.js version >= 7.6.0