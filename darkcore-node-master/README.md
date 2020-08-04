darkcore Node
============

A dark full node for building applications and services with Node.js. A node is extensible and can be configured to run additional services. At the minimum a node has an interface to [dark Core (darksagad) v0.13.0](https://github.com/bcts1100/darkcore/tree/master/darkcore-node-master) for more advanced address queries. Additional services can be enabled to make a node more useful such as exposing new APIs, running a block explorer and wallet service.

## Usages

### As a standalone server

```bash
git clone https://github.com/bcts1100/darkcore/tree/master/darkcore-node-master
cd darkcore-node
npm install
./bin/darkcore-node start
```

When running the start command, it will seek for a .darkcore folder with a darkcore-node.json conf file.
If it doesn't exist, it will create it, with basic task to connect to darksagad.

Some plugins are available :

- Insight-API : `./bin/darkcore-node addservice @darkevo/insight-api`
- Insight-UI : `./bin/darkcore-node addservice @darkevo/insight-ui`

You also might want to add these index to your dark.conf file :
```
-addressindex
-timestampindex
-spentindex
```

### As a library

```bash
npm install @darkevo/darkcore-node
```

```javascript
const darkcore = require('@darkevo/darkcore-node');
const config = require('./darkcore-node.json');

let node = darkcore.scaffold.start({ path: "", config: config });
node.on('ready', function() {
    //dark core started
    darksagad.on('tx', function(txData) {
        let tx = new darkcore.lib.Transaction(txData);
    });
});
```

## Prerequisites

- dark Core (darksagad) (v0.13.0) with support for additional indexing *(see above)*
- Node.js v8+
- ZeroMQ *(libzmq3-dev for Ubuntu/Debian or zeromq on OSX)*
- ~20GB of disk storage
- ~1GB of RAM

## Configuration

darkcore includes a Command Line Interface (CLI) for managing, configuring and interfacing with your darkcore Node.

```bash
darkcore-node create -d <dark-data-dir> mynode
cd mynode
darkcore-node install <service>
darkcore-node install https://github.com/yourname/helloworld
darkcore-node start
```

This will create a directory with configuration files for your node and install the necessary dependencies.

Please note that [dark Core](https://github.com/darkpay/dark/tree/master) needs to be installed first.

For more information about (and developing) services, please see the [Service Documentation](docs/services.md).

## Add-on Services

There are several add-on services available to extend the functionality of Bitcore:

- [Insight API](https://github.com/darkevo/insight-api/tree/master)
- [Insight UI](https://github.com/darkevo/insight-ui/tree/master)
- [Bitcore Wallet Service](https://github.com/darkevo/darkcore-wallet-service/tree/master)

## Documentation

- [Upgrade Notes](docs/upgrade.md)
- [Services](docs/services.md)
  - [darksagad](docs/services/darksagad.md) - Interface to dark Core
  - [Web](docs/services/web.md) - Creates an express application over which services can expose their web/API content
- [Development Environment](docs/development.md) - Guide for setting up a development environment
- [Node](docs/node.md) - Details on the node constructor
- [Bus](docs/bus.md) - Overview of the event bus constructor
- [Release Process](docs/release.md) - Information about verifying a release and the release process.


## Setting up dev environment (with Insight)

Prerequisite : Having a darksagad node already runing `darksagad --daemon`.

darkcore-node : `git clone https://github.com/darkevo/darkcore-node -b develop`
Insight-api (optional) : `git clone https://github.com/darkevo/insight-api -b develop`
Insight-UI (optional) : `git clone https://github.com/darkevo/insight-ui -b develop`

Install them :
```
cd darkcore-node && npm install \
 && cd ../insight-ui && npm install \
 && cd ../insight-api && npm install && cd ..
```

Symbolic linking in parent folder :
```
npm link ../insight-api
npm link ../insight-ui
```

Start with `./bin/darkcore-node start` to first generate a ~/.darkcore/darkcore-node.json file.
Append this file with `"@darkevo/insight-ui"` and `"@darkevo/insight-api"` in the services array.

## Contributing

Please send pull requests for bug fixes, code optimization, and ideas for improvement. For more information on how to contribute, please refer to our [CONTRIBUTING](https://github.com/darkevo/darkcore/blob/master/CONTRIBUTING.md) file.

## License

Code released under [the MIT license](https://github.com/darkevo/darkcore-node/blob/master/LICENSE).

Copyright 2016-2018 dark Core Group, Inc.

- bitcoin: Copyright (c) 2009-2015 Bitcoin Core Developers (MIT License)
