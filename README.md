# p2pd3

p2p simulation framework network visualisation demo using d3 - **WIP**

## Dependencies

to run this project you will need...

* [Git](http://git-scm.com/) (install using your package manager)
* [Node.js](http://nodejs.org/) (install using your package manager)
* [Bower](http://bower.io/) `npm install -g bower`
* [Ember CLI](http://ember-cli.com/) `npm install -g ember-cli`

## Install

```
git clone git@github.com:significance/p2p-d3.git
npm install && bower install

```

## Run Server

```
ember s
```

Then navigate to [http://localhost:4200/visualisation](http://localhost:4200/visualisation)

## Network Simulation Server

p2pd3 requires you to install geth and run the go simulation server

```
go run ./whisper/whisperv5/simulations/network.go ./whisper/whisperv5/simulations/common.go
```

Currently using commit 

```0321360a9827de3819704c8a252ea9dcf742e733```

of [https://github.com/ethersphere/go-ethereum](https://github.com/ethersphere/go-ethereum)

