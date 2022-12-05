import React, { useEffect, useState } from "react";
import { Form, Button, notification } from "antd";
import { useRecoilValue, useRecoilState } from "recoil";
import {
  chatMessages,
} from "../atom/globalState";
import { findValidUser, getUserById, getUserByName, findIdleUsers } from "../util/ApiUtil";
import "./Signin.css";


const Signin = (props) => {
  const [loading, setLoading] = useState(false);
  const [senderDetails, setSenderDetails] = useState([]);
  const [selectedSender, setSelectedSender] = useState("");
  const [selectedReceiver, setselectedReceiver] = useState("");
  const [messages, setMessages] = useRecoilState(chatMessages);
  const [users, setUsers] = useState([]);
  const send = localStorage.getItem("senderFirstName") || "";
  let senderId = 0;
  useEffect(() => {
    const verified = localStorage.getItem("authorized");
    if(verified === null) {
      props.history.push("/");
    } 
    getUsers();
    getSenderDetails();
    setMessages([]);
  }, []);

  const getUsers = () => {
    findIdleUsers().then((response) => {
        setUsers(response);
        localStorage.setItem("idleUsers", JSON.stringify(response));
      }).catch((error) => {
        notification.error({
          message: "Error",
          description: "Something happened!!",
        });
      });
}


  const getSenderDetails = () => {
    getUserByName(send).then((response) => {

      senderId = response.id;
    }).catch(error => {
      notification.error({
        message: "Error",
        description: "Sender not available",
      });
    }); 
  };

  const verifyUser = (values, userType)  => {
    getUserByName(send).then((response) => {
    
    getUserById(response.id).then((response) => {
      localStorage.setItem("sender", JSON.stringify(response));

      findValidUser(selectedReceiver).then((response) => {
      
        localStorage.setItem("receiver", JSON.stringify(response));
        setLoading(false);
        props.history.push("/chatroom");
      }).catch((error) => {
        notification.error({
          message: "Error",
          description: "Receiver not available",
        });
      });
    });
  }).catch((error) => {
    notification.error({
      message: "Error",
      description: "Sender not available",
    });
  });
  }

  const onFinish = async (values) => {
    setLoading(true);
    verifyUser(values, "sender");
    setLoading(false);
  };

  const setSender = (e) => {
    setSelectedSender(e.target.value);
  }

  const setReceiver = (e) => {
    setselectedReceiver(e.target.value);
  }


  return (
    <div className="login-container">
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
       
      <div className="dynamic-dropdown">
          <select className="select-dropdown"
            value={selectedSender}
            onChange={setSender}
          >
            <option value="">Please select Sender</option>
            <option value={senderDetails.id} key={senderDetails?.id}>{send}</option>
          </select>
          <br />
          <select className="select-dropdown" value={selectedReceiver} onChange={setReceiver}>
            <option value="">Please select Receiver</option>
            {users?.filter((u) => u.firstName != send).map((user, i) => {
              return <option value={user.id} key={i}>{user.firstName + " " + user.lastName}</option>;
            })}
          </select>
        </div>
        <Form.Item>
          <Button
            shape="round"
            size="large"
            htmlType="submit"
            className="login-form-button"
            loading={loading}
          >
            Enter
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Signin;
