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
import { login, facebookLogin, findValidUser, getUserById } from "../util/ApiUtil";
import "./Signin.css";

/*global FB*/

const Signin = (props) => {
  const [loading, setLoading] = useState(false);
  const [senderUser, setSenderUser] = useState("");
  const [validSender, setValidSender] = useState(true);
  const [validReceiver, setValidReceiver] = useState(true);
  const [facebookLoading, setFacebookLoading] = useState(false);
  const [test, setTest] = useState(localStorage.getItem("accessToken"));
  const [messages, setMessages] = useRecoilState(chatMessages);

  useEffect(() => {
    // if (localStorage.getItem("sender") !== null) {
    //   props.history.push("/");
    // }
    setMessages([]);
  }, []);


  const verifyUser = (values, userType)  => {
    getUserById(values.senderId).then((response) => {
      console.log("response", response);
      localStorage.setItem("sender", JSON.stringify(response));
        // localStorage.setItem("sender", JSON.stringify(response));
        // localStorage.setItem("receiver", JSON.stringify(response));
        // setLoading(false);
        // props.history.push("/chat");

      findValidUser(values.receiverId).then((response) => {
        console.log("response", response);
        
        // localStorage.setItem("sender", JSON.stringify(response));
        localStorage.setItem("receiver", JSON.stringify(response));
        setLoading(false);
        props.history.push("/chat");
      }).catch((error) => {
        notification.error({
          message: "Error",
          description: "Receiver not available",
        });
      });
    })
    // .catch((error) => {
    //   notification.error({
    //     message: "Error",
    //     description: "Sender not available",
    //   });
    // });
  }

  const onFinish = async (values) => {
    console.log("values" , values);
    setLoading(true);
    verifyUser(values, "sender");
    setLoading(false);
  };


  return (
    <div className="login-container">
      {/* <DingtalkOutlined style={{ fontSize: 50 }} /> */}
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="senderId"
          rules={[{ required: true, message: "Please input your user id!" }]}
        >
          <Input
            size="large"
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="user id"
          />
        </Form.Item>
        
        <Form.Item
          name="receiverId"
          rules={[{ required: true, message: "Please input receiver user id!" }]}
        >
          <Input
            size="large"
            prefix={<UserOutlined className="site-form-item-icon" />}
            // type="password"
            placeholder="user id"
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
        {/* <Divider>OR</Divider> */}
        {/* <Form.Item>
          <Button
            icon={<FacebookFilled style={{ fontSize: 20 }} />}
            loading={facebookLoading}
            className="login-with-facebook"
            shape="round"
            size="large"
            onClick={getFacebookAccessToken}
          >
            Log in With Facebook
          </Button>
        </Form.Item> */}
        {/* Not a member yet? <a href="/signup">Sign up</a> */}
      </Form>
    </div>
  );
};

export default Signin;
