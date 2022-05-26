const express = require('express')
const http = require('http')
const log = require("./log")
const io = require("./io");
const { ExpressPeerServer } = require("peer");

require('./Chat')

const app = express()
const server = http.createServer(app)

const peerApp = express()
const peerServer = http.createServer(peerApp)

const peer = ExpressPeerServer(peerServer, {
    debug: true
})
peerApp.use("/peerjs", peer)

io.listen(server)

server.listen(3333, () => {
    log.info('Server listening')
})
peerServer.listen(3334, () => {
    log.info('Peer server listening')
})
