import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Message {
    _id: string;
    message: string;
    author: string;
    datetime: string;
}

const ChatApp: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchMessages();
        }, 3000);

        return () => clearInterval(intervalId);
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await axios.get<Message[]>('http://146.185.154.90:8000/messages');
            setMessages(response.data.reverse());
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const postMessage = async () => {
        try {
            await axios.post('http://146.185.154.90:8000/messages', {
                message: newMessage,
                author: 'YourName', // Замените на ваше имя
            });

            console.log('Message sent successfully!');
            setNewMessage('');
            fetchMessages();
        } catch (error) {
            console.error('Error posting message:', error);
        }
    };

    return (
        <div>
            <div>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                />
                <button onClick={postMessage}>Send</button>
            </div>
            <div>
                {messages.map((msg) => (
                    <div key={msg._id}>
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
