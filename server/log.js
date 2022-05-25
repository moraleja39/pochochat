const pino = require('pino')
const log = pino({
    level: 'debug',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
})

module.exports = log
