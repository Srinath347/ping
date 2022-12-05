import React, { useEffect, useState } from "react";
import { Form, Input, Button, Divider, notification } from "antd";
import {
  UserOutlined,
  LockOutlined,
  DingtalkOutlined,
  FacebookFilled,
} from "@ant-design/icons";
import { useRecoilValue, useRecoilState } from "recoil";
import {
  chatMessages,
} from "../atom/globalState";
import { login, facebookLogin, findValidUser, getUserById, getUserByName, findIdleUsers } from "../util/ApiUtil";
import "./Signin.css";

/*global FB*/

const Signin = (props) => {
  const [loading, setLoading] = useState(false);
  // const [senderId, setSenderId] = useState("");
  const [senderDetails, setSenderDetails] = useState([]);
  const [selectedSender, setSelectedSender] = useState("");
  const [selectedReceiver, setselectedReceiver] = useState("");
  const [facebookLoading, setFacebookLoading] = useState(false);
  const [test, setTest] = useState(localStorage.getItem("accessToken"));
  const [messages, setMessages] = useRecoilState(chatMessages);
  const [users, setUsers] = useState([]);
  // const users = (JSON.parse(localStorage.getItem("idleUsers")) || []);
  const send = localStorage.getItem("senderFirstName") || "";
  let senderId = 0;
  useEffect(() => {
    // if (localStorage.getItem("sender") !== null) {
    //   props.history.push("/");
    // }
    getUsers();
    getSenderDetails();
    setMessages([]);
  }, []);

  const getUsers = () => {
    findIdleUsers().then((response) => {
        console.log("response", response);
        setUsers(response);
        localStorage.setItem("idleUsers", JSON.stringify(response));
        // localStorage.setItem("receiver", JSON.stringify(response));
        // setLoading(false);
        // props.history.push("/chat");
      }).catch((error) => {
        notification.error({
          message: "Error",
          description: "Something happened!!",
        });
      });
}


  const getSenderDetails = () => {
    getUserByName(send).then((response) => {
      // localStorage.setItem()

      senderId = response.id;
      // setSenderDetails(JSON.stringify(response));
      console.log("scswefcswefws", JSON.stringify(response), response.id);
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
      console.log("response", response);
      localStorage.setItem("sender", JSON.stringify(response));
        // localStorage.setItem("sender", JSON.stringify(response));
        // localStorage.setItem("receiver", JSON.stringify(response));
        // setLoading(false);
        // props.history.push("/chat");

      findValidUser(selectedReceiver).then((response) => {
        console.log("response", response);
        
        // localStorage.setItem("sender", JSON.stringify(response));
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
    // .catch((error) => {
    //   notification.error({
    //     message: "Error",
    //     description: "Sender not available",
    //   });
    // });
  }

  const onFinish = async (values) => {
    console.log("values" , values);
    // users.forEach(element => {
    //   if(element.firstName === values.senderName) {
    //     setSenderId(element.id);
    //   }
    // });
    // console.log("senderId" , senderId);
    setLoading(true);
    verifyUser(values, "sender");
    setLoading(false);
  };

  const setSender = (e) => {
    console.log(e.target.value);
    setSelectedSender(e.target.value);
  }

  const setReceiver = (e) => {
    setselectedReceiver(e.target.value);
  }


  return (
    <div className="login-container">
      {/* <DingtalkOutlined style={{ fontSize: 50 }} /> */}
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
       {/* <Form.Item
          name="senderName"
          rules={[{ required: true, message: "Please input your user id!" }]}
        >
          <Input
            size="large"
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Enter sender's first name"
          />
        </Form.Item>
        
        <Form.Item
          name="receiverName"
          rules={[{ required: true, message: "Please input receiver user id!" }]}
        >
          <Input
            size="large"
            prefix={<UserOutlined className="site-form-item-icon" />}
            // type="password"
            placeholder="Enter receiver's first name"
          />
        </Form.Item>
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
      </Form> */}
      <div className="dynamic-dropdown">
          <select className="select-dropdown"
            value={selectedSender}
            onChange={setSender}
          >
            <option value="">Please select Sender</option>
            <option value={senderDetails.id} key={senderDetails?.id}>{send}</option>
            {/* {users.filter((u) => u.firstName == send).map((user, i) => {
                return <option value={user.id} key={i}>{user.firstName}</option>;
            })} */}
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
