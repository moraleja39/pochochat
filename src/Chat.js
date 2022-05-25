import "./Chat.scss"
import {Avatar, Badge} from "antd";
import ChatService from "./ChatService";
import {useEffect, useState} from "react";
import {bind, Subscribe} from "@react-rxjs/core";
import {
    ChatContainer,
    ConversationHeader,
    Message,
    MessageInput,
    MessageList,
    MessageSeparator,
    VideoCallButton
} from "@chatscope/chat-ui-kit-react";
import {DateTime} from "luxon";
import Video from "./Video";

const [useUsers] = bind(ChatService.usersList$.asObservable())
const [useMessages] = bind(ChatService.messages$.asObservable(), null)

function UserList() {

    const users = useUsers()

    const avatars = users.map(user => {
        return <Badge dot color={"green"} key={user.id}>
            <Avatar size={48} shape='square'>{user.name}</Avatar>
        </Badge>
    })

    return (
        <section className='users-list'>
            <Badge dot color={"green"}>
                <Avatar size={48} shape='square'>YO</Avatar>
            </Badge>
            { avatars }
        </section>

    )
}

function ChatContent() {

    const msgReceiver = useMessages()
    const [msgs, setMsgs] = useState([])
    const [grouped, setGrouped] = useState([])

    useEffect(() => {
        if (msgReceiver == null) {
            return
        }
        setMsgs(m => [...m, msgReceiver])
        console.log(msgReceiver)
    }, [msgReceiver])

    /*useEffect(() => {
        // group consecutive messages from the same user
        const groups = [];
        for (let i = 0; i < msgs.length; i++) {
            if (msgs[i].type !== 'message') {
                groups.push(msgs[i])
                continue
            }
            const sender = msgs[i].from
            const previousSender = msgs[i - 1]?.from
            if (sender !== previousSender) {
                groups.push([])
            }
            groups[groups.length - 1].push(msgs[i])
        }
        console.log(groups)
    }, [msgs])*/

    const messagesList = msgs.map((msg, i) => {
        switch (msg.type) {
            case 'separator':
                return <MessageSeparator key={msg.id}>{ msg.message }</MessageSeparator>
            case 'message':
                const time = DateTime.fromISO(msg.when).toLocaleString(DateTime.TIME_24_SIMPLE)
                const model = {
                    message: msg.message,
                    sentTime: time
                }
                if (msg.from === 'self') {
                    model.direction = 'outgoing'
                }
                return <Message model={model} key={msg.id}>
                    <Message.Footer sender={msg.from} sentTime={time} />
                </Message>
            default:
                return <></>
        }
    })

    /*function renderSingleMessage(msg) {
        switch (msg.type) {
            case 'separator':
                return <MessageSeparator key={msg.id}>{ msg.message }</MessageSeparator>
            case 'message':
                const time = DateTime.fromISO(msg.when).toLocaleString(DateTime.TIME_24_SIMPLE)
                const model = {
                    message: msg.message,
                    sentTime: time
                }
                if (msg.from === 'self') {
                    model.direction = 'outgoing'
                }
                return <Message model={model} key={msg.id}>
                    <Message.Footer sentTime={time} />
                </Message>
            default:
                return <></>
        }
    }

    const groupedMessagesList = grouped.map(group => {
        if (!isArray(group)) {
            return renderSingleMessage(group)
        }

    })*/

    function sendMsg(_, msg) {
        ChatService.sendMessage(msg)
    }

    return (
        <ChatContainer className='ChatContent'>

            <ConversationHeader>
                <ConversationHeader.Content>
                    <UserList />
                </ConversationHeader.Content>
                <ConversationHeader.Actions>
                    <VideoCallButton title="Videollamada" />
                </ConversationHeader.Actions>
            </ConversationHeader>

            <MessageList>
                { messagesList }
            </MessageList>
            <MessageInput placeholder="Dí algo" attachButton={false} onSend={sendMsg} />
        </ChatContainer>
    )
}

export default function Chat() {
    return(
        <div className='Chat'>

            <Subscribe>
                <div className="text">
                    <ChatContent></ChatContent>
                </div>

                <Video />
            </Subscribe>
        </div>
    )
}
