dash-insight-installer.sh
=======

Related: [dashd-installer.sh](https://github.com/dashhive/dashd-installer.sh) |
[dash-insight-installer.sh](https://github.com/dashhive/dash-insight-installer.sh)

The **Dash Insight API** is the free, open source Dash Block Explorer (a fork of bitcore for the Dash Community).
It allows you to view, transact and create payments on the Dash Blockchain.
You can think of it like a Free, Open Source version of [BlockCypher](https://www.blockcypher.com/dev/dash/)'s Dash API.

By using the Insight API directly you can create raw signed transactions without a proxy service.

Screencast
----------

[![How to Install Dash Insights the Quick'n'Easy Way](https://img.youtube.com/vi/27dqEkhzCIc/0.jpg)](https://www.youtube.com/watch?v=27dqEkhzCIc)

Installation
============

This script installs the Dash Insight API on Debian based systems such as Ubuntu (i.e. on Digital Ocean) and Raspbian (i.e. on Raspberry Pi)

It installs the following components (and their dependencies) as a self-contained app in `/opt/dashpay`:

* Dash Full Node [`dashpay/dash`](https://github.com/dashpay/dash)
  * **Note**: You will need several gigabytes of free space (10GB+ at the time of this writing)
* Insight API [`dashevo/insight-api-dash`](https://github.com/dashevo/insight-api-dash#getting-started)

```bash
git clone https://github.com/dashhive/dash-insight-installer.sh.git
pushd ./dash-insight-installer.sh
bash install.sh
```

Everything for Insight API installs to `/opt/dashpay`:

```
/opt/dashpay/bitcore/bin/bitcore-node-dash
/opt/dashpay/bin/node
/opt/dashpay/bin/npm
```

*Uninstall*: `rm -rf /opt/dashpay`

Configuration
--------

The configs can be edited at:

```
/opt/dashpay/etc/bitcore-node-dash.json
/etc/systemd/system/dash-insight.service
```

Usage
-----

You can access the API

<http://IP-ADDR/insight-api-dash/addrs/ygwNQgE5f15Ygopbs2KPRYMS4TcffqBpsz,ygw5yCtVkx3hREke4L8qDqQtnNoAiPKTSx/utxo>

Or the Insight UI

<http://IP-ADDR/insight/>

daemon control
--------

`dashd` can be restarted with `systemctl`:

```bash
systemctl restart dash-insight
```

You can see the logs with `journalctl`:

```bash
journalctl -xefu dash-insight
```

You can disable and enable `dash-insight` loading on startup:

```bash
systemctl enable dash-insight
systemctl disable dash-insight
```

You will need to have `dashd` compiled and installed for the sake of native dependencies which
are needed for `dash-insight`.

If you do not actually need a full node on this machine (you're going to connect to an RPC on another system),
you should disable it to conserve disk space and RAM:

```bash
systemctl disable dash-insight
```


Manual daemon control
-----------------

```
/opt/dashpay/bitcore/bin/bitcore-node-dash start -c /opt/dashpay/etc/ # where bitcore-node-dash.json is
```

Setting rpc auth
--------

You will need to make sure that the `rpcuser`, `rpcpassword`, and IP and port information match between the two config files:

* `/opt/dashpay/etc/bitcore-node-dash.json`
* `/opt/dashpay/etc/dash.conf`

Resources
====

Based on https://medium.com/@obusco/setup-instant-send-transaction-the-comprehensive-way-a80a8a0572e
and http://raspnode.com/diyBitcoin.html

Troubleshooting
=====

Can't find Python executable 'python'
------------

Problem:

```
> bufferutil@1.2.1 install /root/insight/bitcore-node-dash/node_modules/bufferutil
> node-gyp rebuild

gyp ERR! configure error
gyp ERR! stack Error: Can't find Python executable "python", you can set the PYTHON env variable.
gyp ERR! stack     at PythonFinder.failNoPython (/usr/local/lib/node_modules/npm/node_modules/node-gyp/lib/configure.js:483:19)
gyp ERR! stack     at PythonFinder.<anonymous> (/usr/local/lib/node_modules/npm/node_modules/node-gyp/lib/configure.js:397:16)
gyp ERR! stack     at F (/usr/local/lib/node_modules/npm/node_modules/which/which.js:68:16)
gyp ERR! stack     at E (/usr/local/lib/node_modules/npm/node_modules/which/which.js:80:29)
gyp ERR! stack     at /usr/local/lib/node_modules/npm/node_modules/which/which.js:89:16
gyp ERR! stack     at /usr/local/lib/node_modules/npm/node_modules/which/node_modules/isexe/index.js:42:5
gyp ERR! stack     at /usr/local/lib/node_modules/npm/node_modules/which/node_modules/isexe/mode.js:8:5
gyp ERR! stack     at FSReqWrap.oncomplete (fs.js:166:21)
```

Solution:

```bash
apt install -y python
```

zmq.h: No such file or directory
-------

Problem:

```
make: Entering directory '/root/insight/bitcore-node-dash/node_modules/zmq/build'
  CXX(target) Release/obj.target/zmq/binding.o
../binding.cc:28:17: fatal error: zmq.h: No such file or directory
compilation terminated.
zmq.target.mk:95: recipe for target 'Release/obj.target/zmq/binding.o' failed
make: *** [Release/obj.target/zmq/binding.o] Error 1
make: Leaving directory '/root/insight/bitcore-node-dash/node_modules/zmq/build'
gyp ERR! build error
gyp ERR! stack Error: `make` failed with exit code: 2
```

Solution:

```bash
apt install -y libzmq3-dev
```

configure: error: libdb_cxx headers missin
------------------------

Problem:

```
./configure

...

checking for Berkeley DB C++ headers... no
configure: error: libdb_cxx headers missing, Dash Core requires this library for wallet functionality (--disable-wallet to disable wallet functionality)
```

Solution:

```bash
sudo apt-get install libdb4.8-dev libdb4.8++-dev -y --allow-unauthenticated
```

Or, if that fails:

```bash
wget http://download.oracle.com/berkeley-db/db-4.8.30.NC.tar.gz
tar -xzvf db-4.8.30.NC.tar.gz
pushd db-4.8.30.NC/build_unix/
  ../dist/configure --prefix=/usr/local --enable-cxx
  make -j4
  sudo make install

  sudo bash -c 'echo "/usr/local/lib" > /etc/ld.so.conf.d/db-4.8.30.conf'
  sudo ldconfig
popd
```

configure: error: No working boost sleep implementation found.
------

Problem:

```
./configure

...

checking for mismatched boost c++11 scoped enums... ok
configure: error: No working boost sleep implementation found.
```

Solution:

```
sudo apt install -y libboost-system-dev libboost-filesystem-dev libboost-chrono-dev libboost-program-options-dev libboost-test-dev libboost-thread-dev
```

Error: Failed to load masternode cache
--------

Problem:

```
Error: Failed to load masternode cache from /opt/dashpay/var/mncache.dat
```

Solution:

You've probably run out of disk space.

```bash
# assuming -datadir=/opt/dashpay/var/
rm /opt/dashpay/var/debug.log
```

You'll need to delete the caches:

```bash
# rm /opt/dashpay/var/{banlist.dat,fee_estimates.dat,governance.dat,mncache.dat,mnpayments.dat,netfulfilled.dat,peers.dat}

pushd /opt/dashpay/var/
  rm banlist.dat
  rm fee_estimates.dat
  rm governance.dat
  rm mncache.dat
  rm mnpayments.dat
  rm netfulfilled.dat
  rm peers.dat
popd
```

Killed
------

Problem:

Starts and then dies with no explanation.

It may think it's still running... ?

Solution:

In at least one case all I had to do was delete the lock and pid files:

```
rm .lock dashd.pid
```

ZMQ connection delay
------

Problem:

```
[2017-12-12T11:39:04.523Z] warn: ZMQ connection delay: tcp://127.0.0.1:28332
```

```
netcat -v localhost 28332
# Connection refused
```

[Test](https://bitcoin.stackexchange.com/a/65066/68465):

You can know for sure that the

```
grep -r 'ENABLE_ZMQ' /opt/dashpay/deps/dash/config.log
```

If you see `#define ENABLE_ZMQ 0` instead of `#define ENABLE_ZMQ 1`, then you definitely don't have ZMQ support compiled in.

Solution:

You should use `--prefix=/usr/local` when compiling libsodium, libzmq3, and then again
when compiling `bitcore`/`dashd` itself.

```
./configure --prefix=/usr/local
```
