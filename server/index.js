const express = require('express')
const http = require('http')
const log = require("./log")
const io = require("./io");

require('./Chat')

const app = express()
const server = http.createServer(app)

io.listen(server)

server.listen(3333, () => {
    log.info('Server listening')
})
