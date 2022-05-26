import io from "socket.io-client";
import {BehaviorSubject, Subject} from "rxjs";
import {assign, clone} from "lodash";
import {v4 as uuid} from 'uuid';
import {DateTime} from "luxon";
import Peer from "peerjs";

let socket = null
let peer

const ChatService = {

    usersList$: new BehaviorSubject([]),
    users: [],
    messages$: new Subject(),
    messages: [],
    videoStreams$: new BehaviorSubject([]),
    videos: [],

    username: null,
    selfVideoStream: null,
    peerCalls: [],

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

        // connect to peer after connecting to socket.io, to share the same user id
        socket.on('connect', me => {
            console.log('connected to socket.io')
            peer = new Peer(socket.id, {
                path: '/peerjs',
                host: 'localhost',
                port: 3334
            })

            peer.on('call', call => {
                console.log(`got a call from ${call.peer}`)
                console.log(call)
                const callerName = this.users.find(u => u.id === call.peer).name
                call.answer()
                call.on('stream', remoteStream => {
                    this.receiveCall(remoteStream, callerName, call.connectionId)
                })
                call.on('close', () => {
                    console.log(`${call.peer} hung up`)
                    this.pullVideo(call.connectionId)
                })
                call.on('error', err => {
                    console.log(`call error:`)
                    console.log(err)
                    this.pullVideo(call.connectionId)
                })
            })
        })

    },

    shutdown() {
        socket?.disconnect()
        peer?.disconnect()
    },

    logIn(username) {
        this.username = username
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

    async initVideo() {
        if (this.selfVideoStream != null) return
        this.selfVideoStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        })
        this.videos.unshift({
            name: this.username + " (Tú)",
            stream: this.selfVideoStream,
            id: this.selfVideoStream.id
        })
        this.videoStreams$.next(clone(this.videos))
        this.streamVideo()
    },

    streamVideo() {
        this.users.forEach(user => {
            const call = peer.call(user.id, this.selfVideoStream)
            this.peerCalls.push(call)
        })
    },

    async stopVideo() {
        if (this.selfVideoStream == null) return
        for (const call of this.peerCalls) {
            await call.close()
        }
        this.peerCalls = []
        this.pullVideo(this.selfVideoStream.id)
        this.selfVideoStream.getTracks().forEach(track => track.stop())
        this.selfVideoStream = null
        // close remote calls
    },

    receiveCall(stream, name, id) {
        const maybeExisting = this.videos.findIndex(v => v.id === id)
        if (maybeExisting > -1) {
            this.videos[maybeExisting] = {name, stream, id}
        } else {
            this.videos.push({name, stream, id})
        }
        this.videoStreams$.next(clone(this.videos))
    },

    pullVideo(id) {
        this.videos = this.videos.filter(v => v.id !== id)
        this.videoStreams$.next(clone(this.videos))
    }
}

export default ChatService
