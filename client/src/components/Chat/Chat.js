import React, { useState, useEffect, useContext } from 'react';
import  { useHistory } from 'react-router-dom'
import io from "socket.io-client";

import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import TextContainer from '../TextContainer/TextContainer';
import { UserContext } from '../../context';

import './Chat.css';

let socket;

const Chat = ({ location }) => {
    const [username, setName] = useState('');
    const [chatRoom, setRoom] = useState('');
    const [users, setUsers] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const ENDPOINT = 'https://chatapp-react-node.herokuapp.com/';

    let history = useHistory();

    const { name, room } = useContext(UserContext);

    useEffect(() => {

        socket = io(ENDPOINT);

        setName(name);
        setRoom(room);

        socket.emit('join', { name, room }, (error) => {
            if(error) {
                alert(error);
                history.push("/");
            }
        });

        return () => {
            socket.emit('disconnect');

            socket.off();
        }
    }, [ENDPOINT, name, room, history]);

    useEffect(() => {
        socket.on('message', (message) => {
          setMessages([ ...messages, message ]);
        });

        socket.on("roomData", ({ users }) => {
            setUsers(users);
        });
    }, [messages]);

    const sendMessage = (event) => {
        event.preventDefault();
    
        if(message) {
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }

    console.log(message, messages);

    return(
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={chatRoom} />
                <Messages messages={messages} name={username} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
            <TextContainer users={users}/>
        </div>
    );
}

export default Chat;