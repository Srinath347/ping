import React, { useEffect, useState } from "react";
import { Button, message, notification } from "antd";

import {
  getUsers,
  countNewMessages,
  findChatMessages,
  findChatMessage,
  updateUserStatus
} from "../util/ApiUtil";
import { useRecoilValue, useRecoilState } from "recoil";
import {
  loggedInUser,
  chatActiveContact,
  chatMessages,
} from "../atom/globalState";
import ScrollToBottom from "react-scroll-to-bottom";
import "./Chat.css";
import { List } from "rc-field-form";

var stompClient = null;
const Chat = (props) => {
  // const currentUser = useRecoilValue(loggedInUser);
  const [text, setText] = useState("");
  // const [newChat, isNewChat] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useRecoilState(chatActiveContact);
  const [messages, setMessages] = useRecoilState(chatMessages);
  const [chatMssgs, setChatMssgs] = useRecoilState(chatMessages);
  const [subscription, setSubscription] = useState("");
  // const currentUser = {
  //   id: localStorage.getItem("senderId"),

  // }
  const sender = JSON.parse(localStorage.getItem("sender"));
  // const sender = localStorage.getItem("sender");
  const receiver = JSON.parse(localStorage.getItem("receiver"));
  const count = sessionStorage.getItem("byeCount") || 0;

  useEffect(() => {
    
    if (localStorage.getItem("sender") === null) {
      props.history.push("/chat");
    }
    console.log("Sender: ", sender);
    console.log("Receiver: ", receiver);
    // updateStatus(sender.id, "busy");
    updateStatus(receiver.id, "busy");
    // getUser(receiver)
    connect();
    // loadContacts();
  }, []);

  useEffect(() => {
    const messages = sessionStorage.getItem("chatMessages");
    if(messages == null || messages.length == 0) {
      setChatMssgs([]);
    }
  }, []);

  // useEffect(() => {
  //   // if (activeContact === undefined) return;
  //   // if(newChat) return;
  //   // findChatMessages(receiver, sender).then((msgs) =>
  //   //   setMessages(msgs)
  //   // );
  //   // if (messages != null && messages.length > 0) {
  //   //   isNewChat(false);
  //   // } 
  //   // else {
  //   //   setMessages([]);
  //   // }
  //   // console.log("Messsages so far" , messages);
  //   // loadContacts();
  // }, 
  // // [activeContact]
  // []);

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
    // console.log(currentUser);
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
    console.log("message: ", msg);
    // isNewChat(false);
    const chat = JSON.parse(msg.body);
    console.log("messge received: " + sender.id, chat.senderId);
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
          console.log("unsubscribing", msg.headers.subscription);
          stompClient.unsubscribe(msg.headers.subscription);  
          // count = count +1;
          let count = parseInt(sessionStorage.getItem("byeCount") || 0);
          sessionStorage.setItem("byeCount", count+1);
        }
        
        const newMessages = JSON.parse(sessionStorage.getItem("chatMessages") || "[]");
        console.log("Messages : " , newMessages);
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
      console.log("Newmssg: " , newMessages);
      setMessages(newMessages);

      const newChatMessages = [...chatMssgs];
      newChatMessages.push(message);
      setMessages(newChatMessages);
      console.log("newChatMessages: " , newChatMessages);
      sessionStorage.setItem("chatMessages", JSON.stringify(newChatMessages));
      console.log("chatMssgs: " , chatMssgs);
      printMessages();
      if(message.content.toLowerCase() == "bye") {  
        // count = count +1;
        let count = parseInt(sessionStorage.getItem("byeCount") || 0);
        sessionStorage.setItem("byeCount", count+1);
      }
      closeConnection();
    }
  };

  const closeConnection = () => {
    let c = parseInt(sessionStorage.getItem("byeCount") || 0);
    console.log("Closing connection......", c)
    if(c >= 2) {
      console.log("Closing connection......", c)
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

  const printMessages = () => {
    const mssgs = JSON.parse(sessionStorage.getItem("chatMessages") || "[]");
    console.log(mssgs);
  }

  const loadContacts = () => {
    const promise = getUsers().then((users) =>
      users.map((contact) =>
        countNewMessages(contact.id, sender).then((count) => {
          contact.newMessages = count;
          return contact;
        })
      )
    );

    promise.then((promises) =>
      Promise.all(promises).then((users) => {
        setContacts(users);
        if (activeContact === undefined && users.length > 0) {
          setActiveContact(users[0]);
        }
      })
    );
  };

  return (
    <div id="frame">
      <div id="sidepanel">
        <div id="profile">
          <div class="wrap">
            {/* <img
              id="profile-img"
              src={currentUser.profilePicture}
              class="online"
              alt=""
            /> */}
            <p>{sender?.firstName +  " " +sender?.lastName}</p>
            <div id="status-options">
              <ul>
                <li id="status-online" class="active">
                  <span className="status-circle"></span> <p>Online</p>
                </li>
                <li id="status-away">
                  <span class="status-circle"></span> <p>Away</p>
                </li>
                <li id="status-busy">
                  <span class="status-circle"></span> <p>Busy</p>
                </li>
                <li id="status-offline">
                  <span class="status-circle"></span> <p>Offline</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div id="search" />
        <div id="contacts">
          <ul>
            {contacts.map((contact) => (
              <li
                onClick={() => setActiveContact(contact)}
                class={
                  activeContact && contact.id === activeContact.id
                    ? "contact active"
                    : "contact"
                }
              >
                <div class="wrap">
                  <span class="contact-status online"></span>
                  <img id={contact.id} src={contact.profilePicture} alt="" />
                  <div class="meta">
                    <p class="name">{contact.name}</p>
                    {contact.newMessages !== undefined &&
                      contact.newMessages > 0 && (
                        <p class="preview">
                          {contact.newMessages} new messages
                        </p>
                      )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div class="content">
        <div class="contact-profile">
          <img src={activeContact && activeContact.profilePicture} alt="" />
          <p>{activeContact && activeContact.name}</p>
        </div>
        <ScrollToBottom className="messages">
          <ul>
            {/* {newChat } */}
            {messages != null && messages.map((msg) => (
              <li class={msg.senderId === sender?.id? "sent" : "replies"}>
                {/* {msg.senderId !== sender} */}
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