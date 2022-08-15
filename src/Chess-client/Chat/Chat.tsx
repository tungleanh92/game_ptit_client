import React, { useState, useEffect, useContext } from "react";
import "./Chat.css";
import { Datacontext } from "../../context/Datacontext";
import ScrollToBottom from "react-scroll-to-bottom";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Message } from "../Message/Message";

export const Chat = () => {
    const [messages, setMessages] = useState<any>([]);
    const [message, setMessage] = useState("");
    const { username, gameId, socket } = useContext<any>(Datacontext);

    useEffect(() => {
        socket.on('message', (receivedMessage: any) => {
            setMessages([...messages, receivedMessage]);
        });

        return () => {
            socket.off('message');
        }

    }, [messages]);

    const sendMessage = (event: any) => {
        event.preventDefault();

        if (message) {
            socket.emit("sendMessage", message, gameId, username, () => setMessage(""));
        }

    }
    return (
        <>
            <div className="chat-container">
                <div>
                    <ScrollToBottom className="messages">
                        {messages.map((message: any, i: any) => (<div key={i}><Message message={message} name={username} /></div>))}
                    </ScrollToBottom>
                </div>
                <form>

                    <div className="input-container">
                        <TextField
                            id="standard-basic"
                            className="input"
                            label="Write a Message!"
                            value={message}
                            onChange={(event: any) => setMessage(event.target.value)}
                            onKeyPress={(event: any) => event.key === 'Enter' ? sendMessage(event) : null}
                        />
                        <Button variant="contained" className="send-btn" color="primary" onClick={(event: any) => sendMessage(event)}>
                            Send
                        </Button>
                    </div>
                </form>
            </div>
        </>
    )
}