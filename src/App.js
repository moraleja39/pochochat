import './App.css';
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {useState} from "react";
import Login from "./Login";
import UserContext from "./userContext";
import Chat from "./Chat";


function App() {

    const [username, setUsername] = useState(null)

  return (
      <UserContext.Provider value={{ username, setUsername }}>
          <div className="App">

              { (username === null) ? <Login /> : <Chat /> }

          </div>
      </UserContext.Provider>

  );
}

export default App;
