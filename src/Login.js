import "./Login.scss"
import {useContext, useState} from "react";
import userContext from "./userContext";
import {Button, Card, Input} from "antd";
import ChatService from "./ChatService";

function Login() {

    const { setUsername } = useContext(userContext);
    const [value, setValue] = useState('')

    function handleSubmit() {
        ChatService.logIn(value)
        setUsername(value)
    }

    return(
            <Card className='Login'>
                <p>Tu nombre:</p>
                <Input value={value} onChange={e => setValue(e.target.value)}></Input>
                <Button className='login-submit' type="primary" onClick={handleSubmit}>Entrar al chat</Button>
            </Card>
    )
}

export default Login
