const log = require("./log");
const io = require("./io");
const {DateTime} = require("luxon");
const { pick } = require("lodash");
const { v4: uuid } = require('uuid')

class Chat {
    users = []

    addUser(socket) {
        const user = {
            name: null,
            id: socket.id,
            socket
        }
        this.users.push(user)
        this.initUser(user)
    }

    initUser(user) {
        // set all our listeners

        user.socket.on('login', username => {
            log.info(`User ${user.id} set his name to ${username}`)
            user.name = username
            // inform other users that someone connected
            user.socket.broadcast.emit('user-joined', {
                id: user.id,
                name: username
            })
            // send the logged user a list of other users
            this.sendUsersList(user)
        })

        user.socket.on('disconnect', () => {
            log.info(`${user.id} left`)
            // on disconnect, inform everyone
            io.emit('user-left', { id: user.id, name: user.name })
            // and remove the user from the users array
            this.users.splice(this.users.findIndex(u => u.id === user.id))
        })

        user.socket.on('message', (msg) => {
            // broadcast to everyone except the user
            user.socket.broadcast.emit('message', {
                id: uuid(),
                from: user.id,
                when: DateTime.now().toISO(),
                message: msg
            })
        })

        user.socket.on('video-ended', id => {
            user.socket.broadcast.emit('video-ended', id)
        })
    }

    sendUsersList(user) {
        // sends a list of all the connected users except self
        const list = this.users.filter(u => u.id !== user.id && u.name !== null).map(u => pick(u, ['id', 'name']))
        user.socket.emit('users-list', list)
    }
}

const chat = new Chat()

io.on('connection', socket => {
    log.debug(`${socket.id} connected`)
    chat.addUser(socket)
})

module.exports = chat
