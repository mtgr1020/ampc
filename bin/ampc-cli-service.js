#!/usr/bin/env node


const AMPC = require('../lib/AMPC')

const ampc = new AMPC(process.env.AMPC_CLI_CONTEXT || process.cwd());

ampc.run();