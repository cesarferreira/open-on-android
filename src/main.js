#!/usr/bin/env node

'use strict';

const Utils = require('./utils/utils');
const inquirer = require('inquirer');
const adb = require('node-adb-api');
const log = console.log;
const shell = require('shelljs');
const Chalk = require('chalk');



function showDeviceSelection(devices, url) {
    inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));
    inquirer.prompt({
        type: 'list',
        name: 'device',
        message: 'Select A device from the connected device?',
        choices: devices
    }).then(selection => {
        let selectedDevice = selection.device.substr(0, selection.device.indexOf(' '));
        openInBrowser(selectedDevice, url)
    });
}

function openInBrowser(deviceSerialNumber, url) {

    if (!adb.isAnyDeviceConnected(deviceSerialNumber)) {
        Utils.titleError(`None or more than one device/emulator connected`);
        process.exit(2);
    }

    shell.exec(`adb -s ${deviceSerialNumber} shell am start -a android.intent.action.VIEW -d ${url}`, { silent: true }, function(code, stdout, stderr) {
        if (stderr) {
            log(Chalk.red(stderr))
        }
    });
}

function getTheOnlyConnectedDeviceSerial(devices) {
    return devices[0].substr(0, devices[0].indexOf(' '));
}

// Main code //
module.exports = {
    init: (input, flags) => {
        if (input.length < 1) {
            Utils.titleError(`Missing URL parameter`);
            process.exit(1);
        }

        const devices = adb.getListOfDevices();

        if (devices.length === 0) {
            Utils.titleError(`No device/emulator connected \n please connect one or more device/emulator and try again`);
            process.exit(2);
        } else if (devices.length === 1) {
            // only single device is connected proceed with package selection
            const onlyDevice = getTheOnlyConnectedDeviceSerial(devices)

            openInBrowser(onlyDevice, input[0]);
        } else {
            // multiple device connected show device selection
            showDeviceSelection(devices, input[0]);
        }
    }
};