import './App.css';
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {useEffect, useState} from "react";
import ChatService from "./ChatService";
import Login from "./Login";
import UserContext from "./userContext";
import Chat from "./Chat";


function App() {

    const [username, setUsername] = useState(null)

    useEffect(() => {
        ChatService.init()

        return () => {
            ChatService.shutdown()
        }
    }, [])

  return (
      <UserContext.Provider value={{ username, setUsername }}>
          <div className="App">

              { (username === null) ? <Login /> : <Chat /> }

              {/*<MainContainer>
            <ChatContainer>
                <MessageList>
                    <Message
                        model={{
                            payload: "Hello my friend",
                            sentTime: "just now",
                            direction: 'incoming',
                            sender: "Joe",
                        }}
                    />
                    <Message
                        model={{
                            payload: "wtf man",
                            sentTime: "just now",
                            direction: 'incoming',
                            sender: "Jacinto",
                        }}
                    />
                </MessageList>
                <MessageInput placeholder="Type message here" />
            </ChatContainer>
        </MainContainer>*/}
          </div>
      </UserContext.Provider>

  );
}

export default App;
