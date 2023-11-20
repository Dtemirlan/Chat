import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ChatApp.css'

interface Message {
    _id: string;
    message: string;
    author: string;
    datetime: string;
}

interface PostMessageData {
    message: string;
    author: string;
}

const ChatApp: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [lastMessageDate, setLastMessageDate] = useState<string | null>(null);

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchMessages();
        }, 3000);

        return () => clearInterval(intervalId);
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await axios.get<Message[]>('http://146.185.154.90:8000/messages', {
                params: { lastMessageDate },
            });

            const newMessages = response.data;
            newMessages.sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());

            setMessages((prevMessages) => [...prevMessages, ...newMessages]);

            if (newMessages.length > 0) {
                setLastMessageDate(newMessages[0].datetime);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const postMessage = async () => {
        const postData: PostMessageData = {
            message: newMessage,
            author: 'YourName',
        };

        try {
            await axios.post('http://146.185.154.90:8000/messages', postData);

            console.log('Message sent successfully!');
            setNewMessage('');
            await fetchMessages();
        } catch (error) {
            console.error('Error posting message:', error);
        }
    };

    return (
        <div className="container">
            <div className="inputContainer">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                />
                <button onClick={postMessage}>Send</button>
            </div>
            <div className="messagesContainer">
                {messages.map((msg) => (
                    <div key={msg._id} className="message">
                        <p>{msg.author}:</p>
                        <p>{msg.message}</p>
                        <p>{new Date(msg.datetime).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatApp;
