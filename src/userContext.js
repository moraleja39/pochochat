import {createContext} from "react";

const UserContext = createContext({
    username: null,
    setUsername: () => {}
})

export default UserContext
