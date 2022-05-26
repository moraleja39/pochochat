import "./Login.scss"
import {useContext, useEffect, useState} from "react";
import userContext from "./userContext";
import {Button, Card, Input} from "antd";
import ChatService from "./ChatService";

function Login() {

    const { setUsername } = useContext(userContext);
    const [value, setValue] = useState('')

    function handleSubmit() {
        window.localStorage.setItem('username', value)
        ChatService.logIn(value)
        setUsername(value)
    }

    useEffect(() => {
        const saved = window.localStorage.getItem('username')
        if (saved !== null) {
            ChatService.logIn(saved)
            setUsername(saved)
        }
    })

    return(
            <Card className='Login'>
                <p>Tu nombre:</p>
                <Input value={value} onChange={e => setValue(e.target.value)}></Input>
                <Button className='login-submit' type="primary" onClick={handleSubmit}>Entrar al chat</Button>
            </Card>
    )
}

export default Login
