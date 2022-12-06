import React, { useEffect, useState } from "react";
import { Button, message, notification } from "antd";
import hmacSHA512 from 'crypto-js/hmac-sha512';
import Base64 from 'crypto-js/enc-base64';

import {
  updateUserStatus
} from "../util/ApiUtil";
import { useRecoilValue, useRecoilState } from "recoil";
import {
  chatMessages,
} from "../atom/globalState";
import ScrollToBottom from "react-scroll-to-bottom";
import "./Chat.css";

var stompClient = null;
var CryptoJS = require("crypto-js");
const dynamicValue = '12/05/2022';
const Chat = (props) => {
  const [text, setText] = useState("");
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
    const privateKey = '${dynamicValue} b1mylEEnVURSeTPwg51';
    console.log("received encrypted message: "+ chat.content);
    if (receiver.id == chat.senderId) {
        const hashMsg = Base64.stringify(hmacSHA512(chat.content, privateKey));
        if (hashMsg !== chat.hash)  {
            console.log("Security Breach!! Hash authentication failed");
            notification.error({
                message: "Error",
                description: "Security Breach!! Hash authentication failed",
             });
             closeConnection();
        }
        const bytes = CryptoJS.AES.decrypt(chat.content, privateKey);
        const message = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        const formattedMessage = {
          senderId: chat.senderId,
          recipientId: chat.recipientId,
          senderName: sender.firstName + " " + sender.lastName,
          recipientName: receiver.firstName + " " + receiver.lastName,
          content: message,
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
    const privateKey = '${dynamicValue} b1mylEEnVURSeTPwg51';
    if (msg.trim() !== "") {
      const message = {
        senderId: sender.id,
        recipientId: receiver.id,
        senderName: sender.firstName + " " + sender.lastName,
        recipientName: receiver.firstName + " " + receiver.lastName,
        content: msg,
        hash: msg,
        timestamp: new Date(),
      };
      const encryptedMsg = CryptoJS.AES.encrypt(JSON.stringify(msg), privateKey).toString();
      const hashMsg = Base64.stringify(hmacSHA512(encryptedMsg, privateKey));
      const message1 = {
          senderId: sender.id,
          recipientId: receiver.id,
          senderName: sender.firstName + " " + sender.lastName,
          recipientName: receiver.firstName + " " + receiver.lastName,
          content: encryptedMsg,
          hash: hashMsg,
          timestamp: new Date(),
      };
      console.log("sending encrypted message: "+ message1.content);
      stompClient.send("/app/chat", {}, JSON.stringify(message1));

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
