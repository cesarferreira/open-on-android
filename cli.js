#!/usr/bin/env node

'use strict';

const meow = require('meow');
const router = require('./src/main');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');

updateNotifier({
    pkg
}).notify();

const cli = meow(`
Usage
   $ ooa
`, {
    alias: {
        v: 'version'
    },
    boolean: ['version']
});

router.init(cli.input, cli.flags);