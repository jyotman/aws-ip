#!/usr/bin/env node

'use strict';

const AWS = require('aws-sdk'),
    EC2 = require('aws-sdk/clients/ec2'),
    https = require('https');

AWS.config.loadFromPath('./config.json');
const config = require(process.env.CONFIG);

const ec2 = new EC2();

(async () => {
    try {
        const ips = config.ip || [await getIpAddress()];
        const port = config.port || 22;
        const groupIds = config.groupIds || await getAllSecurityGroupIds();
        const addresses = ips.map(ip => ({ip: ip, port: port, protocol: 'tcp'}));
        await addIPsToGroups(addresses, groupIds);
        console.log('Done!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();

/**
 * Add the addresses to each GroupId
 * @param {[Object]} addresses
 * @param {[String]} groupIds
 * @return {Promise.<*>}
 */
function addIPsToGroups(addresses, groupIds) {
    return Promise.all(groupIds.map(groupId => addIPsToGroup(addresses, groupId)));
}

/**
 * Add the addresses to the GroupId
 * @param {[Object]} addresses
 * @param {String} groupId
 * @return {Promise}
 */
function addIPsToGroup(addresses, groupId) {
    return new Promise((resolve, reject) => {
        ec2.authorizeSecurityGroupIngress({
            GroupId: groupId,
            IpPermissions: addresses.map(address => ({
                FromPort: address.port,
                ToPort: address.port,
                IpProtocol: address.protocol,
                IpRanges: [{CidrIp: address.ip + '/32'}]
            }))
        }, function (err, data) {
            if (err)
                reject(err);
            else
                resolve(data);
        });
    });
}

/**
 * Get the current IP address
 * @return {Promise.<String>}
 */
function getIpAddress() {
    return new Promise((resolve, reject) => {
        https.get('https://wtfismyip.com/json', (res) => {
            res.on('data', (data) => {
                resolve(JSON.parse(data.toString()).YourFuckingIPAddress);
            });
        }).on('error', (err) => {
            reject(err);
        })
    });
}

/**
 * Get GroupId of all the security groups in the region
 * @return {Promise.<Array>}
 */
function getAllSecurityGroupIds() {
    return new Promise((resolve, reject) => {
        ec2.describeSecurityGroups(function (err, data) {
            if (err)
                reject(err);
            else
                resolve(data.SecurityGroups.map(group => group.GroupId));
        });
    });
}