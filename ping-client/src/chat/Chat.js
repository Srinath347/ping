import React, { useEffect, useState } from "react";
import { Button, notification } from "antd";

import {
  getUsers,
  countNewMessages,
  updateUserStatus
} from "../util/ApiUtil";
import { useRecoilValue, useRecoilState } from "recoil";
import {
  chatActiveContact,
  chatMessages,
} from "../atom/globalState";
import ScrollToBottom from "react-scroll-to-bottom";
import "./Chat.css";

var stompClient = null;
const Chat = (props) => {
  const [text, setText] = useState("");
  // const [contacts, setContacts] = useState([]);
  // const [activeContact, setActiveContact] = useRecoilState(chatActiveContact);
  const [messages, setMessages] = useRecoilState(chatMessages);
  const [chatMssgs, setChatMssgs] = useRecoilState(chatMessages);
  const [subscription, setSubscription] = useState("");
  const sender = JSON.parse(localStorage.getItem("sender"));
  const receiver = JSON.parse(localStorage.getItem("receiver"));
  const count = sessionStorage.getItem("byeCount") || 0;

  useEffect(() => {
    
    if (localStorage.getItem("sender") === null) {
      props.history.push("/chat");
    }
    updateStatus(receiver.id, "busy");
    connect();
  }, []);

  useEffect(() => {
    const messages = sessionStorage.getItem("chatMessages");
    if(messages == null || messages.length == 0) {
      setChatMssgs([]);
    }
  }, []);

  const updateStatus = (id, status) => {
    updateUserStatus(id, status).then((response) => {
      console.log("Updating status of", response);
    }).catch((error) => {
      notification.error({
        message: "Error",
        description: "Error updating user status",
      });
      props.history.push("/chat");
    });
  }

  const connect = () => {
    const Stomp = require("stompjs");
    var SockJS = require("sockjs-client");
    SockJS = new SockJS("http://localhost:8080/ws");
    stompClient = Stomp.over(SockJS);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    console.log("connected");
    setSubscription("/user/" + sender.id + "/queue/messages");
    stompClient.subscribe(
      "/user/" + sender.id + "/queue/messages",
      onMessageReceived
    );
  };

  const onError = (err) => {
    console.log(err);
  };

  const onMessageReceived = (msg) => {
    const chat = JSON.parse(msg.body);
    console.log("messge received: " + chat);
    if (receiver.id == chat.senderId) {
        const message = chat.content;
        const formattedMessage = {
          senderId: chat.senderId,
          recipientId: chat.recipientId,
          senderName: sender.firstName + " " + sender.lastName,
          recipientName: receiver.firstName + " " + receiver.lastName,
          content: chat.content,
          timestamp: chat.timestamp,
        };
        
        if(message.toLowerCase() == "bye") {
          stompClient.unsubscribe(msg.headers.subscription);
          let count = parseInt(sessionStorage.getItem("byeCount") || 0);
          sessionStorage.setItem("byeCount", count+1);
        }
        
        const newMessages = JSON.parse(sessionStorage.getItem("chatMessages") || "[]");
        newMessages.push(formattedMessage);
        setMessages(newMessages);
        sessionStorage.setItem("chatMessages", JSON.stringify(newMessages));
        closeConnection();
    }
  };

  const sendMessage = (msg) => {
    if (msg.trim() !== "") {
      const message = {
        senderId: sender.id,
        recipientId: receiver.id,
        senderName: sender.firstName + " " + sender.lastName,
        recipientName: receiver.firstName + " " + receiver.lastName,
        content: msg,
        timestamp: new Date(),
      };
      stompClient.send("/app/chat", {}, JSON.stringify(message));
    
      const newMessages = [...messages];
      newMessages.push(message);
      setMessages(newMessages);

      const newChatMessages = [...chatMssgs];
      newChatMessages.push(message);
      setMessages(newChatMessages);
      sessionStorage.setItem("chatMessages", JSON.stringify(newChatMessages));
      if(message.content.toLowerCase() == "bye") {  
        let count = parseInt(sessionStorage.getItem("byeCount") || 0);
        sessionStorage.setItem("byeCount", count+1);
      }
      closeConnection();
    }
  };

  const closeConnection = () => {
    let c = parseInt(sessionStorage.getItem("byeCount") || 0);
    if(c >= 2) {
      updateStatus(receiver.id, "idle");
      updateStatus(sender.id, "idle");
      sessionStorage.clear("byeCount")
      sessionStorage.clear("chatMessages")
      setMessages([]);
      setChatMssgs([]);
      localStorage.clear()
      props.history.push("/")
    }
  }

  return (
    <div id="frame">
      <div id="sidepanel">
        <div id="profile">
          <div class="wrap">
            <p>{sender?.firstName +  " " +sender?.lastName}</p>
            <div id="status-options">
            </div>
          </div>
        </div>
        <div id="search" />
        <div id="contacts">
        </div>
      </div>
      <div class="content">
        <div class="contact-profile">
        </div>
        <ScrollToBottom className="messages">
          <ul>
            {messages != null && messages.map((msg) => (
              <li class={msg.senderId === sender?.id? "sent" : "replies"}>
                <p>{msg.content}</p>
              </li>
            ))}
          </ul>
        </ScrollToBottom>
        <div class="message-input">
          <div class="wrap">
            <input
              name="user_input"
              size="large"
              placeholder="Write your message..."
              value={text}
              onChange={(event) => setText(event.target.value)}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  sendMessage(text);
                  setText("");
                }
              }}
            />

            <Button
              icon={<i class="fa fa-paper-plane" aria-hidden="true"></i>}
              onClick={() => {
                sendMessage(text);
                setText("");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
