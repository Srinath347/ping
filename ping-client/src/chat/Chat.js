import React, { useEffect, useState } from "react";
import { Button, message } from "antd";
import {
  getUsers,
  countNewMessages,
  findChatMessages,
  findChatMessage,
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
  // const currentUser = {
  //   id: localStorage.getItem("senderId"),

  // }
  const sender = localStorage.getItem("senderId");
  const receiver = localStorage.getItem("receiverId");

  useEffect(() => {

    if (localStorage.getItem("senderId") === null) {
      props.history.push("/login");
    }
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
    stompClient.subscribe(
      "/user/" + sender + "/queue/messages",
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
    console.log("messge received: " + sender, chat.senderId);
    if (receiver == chat.senderId) {
        const message = chat;
        const formattedMessage = {
          senderId: chat.senderId,
          recipientId: chat.recipientId,
          senderName: "joe",
          recipientName: "harry",
          content: chat.content,
          timestamp: chat.timestamp,
        };
        const newMessages = JSON.parse(sessionStorage.getItem("chatMessages") || "[]");
        console.log("Messages : " , newMessages);
        newMessages.push(formattedMessage);
        setMessages(newMessages);
        sessionStorage.setItem("chatMessages", JSON.stringify(newMessages));
    }
  };

  const sendMessage = (msg) => {
    if (msg.trim() !== "") {
      const message = {
        senderId: sender,
        recipientId: receiver,
        senderName: "joe",
        recipientName: "harry",
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
    }
  };

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
            <p>{sender}</p>
            <div id="status-options">
              <ul>
                <li id="status-online" class="active">
                  <span class="status-circle"></span> <p>Online</p>
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
        <div id="bottom-bar">
          <button id="addcontact">
            <i class="fa fa-user fa-fw" aria-hidden="true"></i>{" "}
            <span>Profile</span>
          </button>
          <button id="settings">
            <i class="fa fa-cog fa-fw" aria-hidden="true"></i>{" "}
            <span>Settings</span>
          </button>
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
              <li class={msg.senderId === sender ? "sent" : "replies"}>
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
