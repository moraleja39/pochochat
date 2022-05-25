import io from "socket.io-client";
import {BehaviorSubject, Subject} from "rxjs";
import {assign, clone} from "lodash";
import {v4 as uuid} from 'uuid';
import {DateTime} from "luxon";

let socket

const ChatService = {

    usersList$: new BehaviorSubject([]),
    users: [],
    messages$: new Subject(),
    messages: [],
    videos$: new BehaviorSubject([]),
    videos: [],

    init() {
        socket = io('localhost:3333')
        socket.on('users-list', users => {
            console.log('got users list')
            this.users = users
            this.usersList$.next(clone(this.users))
        })
        socket.on('user-left', ({ id, name }) => {
            console.log(`User ${id} left`)
            this.users.splice(this.users.findIndex(u => u.id === id))
            this.usersList$.next(clone(this.users))
            this.showSeparator(`${name} se ha desconectado`)
        })
        socket.on('user-joined', newUser => {
            console.log(`User ${newUser.id} joined`)
            this.users.push(newUser)
            this.usersList$.next(clone(this.users))
            this.showSeparator(`${newUser.name} se ha conectado`)
        })
        socket.on('message', msg => {
            const name = this.users.find(u => u.id === msg.from)?.name ?? ''
            this.pushMsg(assign(msg, { type: 'message', from: name }))
        })
    },

    shutdown() {
        socket?.disconnect()
    },

    logIn(username) {
        socket.emit('login', username)
    },

    pushMsg(msg) {
        this.messages.push(msg)
        this.messages$.next(msg)
    },

    showSeparator(content) {
        const msg = {
            id: uuid(),
            type: 'separator',
            message: content
        }
        this.pushMsg(msg)
    },

    sendMessage(msg) {
        // show the message locally
        this.pushMsg({
            id: uuid(),
            type: 'message',
            from: 'self',
            when: DateTime.now(),
            message: msg
        })
        // send the message to socket.io
        socket.emit('message', msg)
    },

    initVideo() {

    }
}

export default ChatService
