import React, { useEffect, useState } from "react";
import { Form, Input, Button, notification } from "antd";
import { verifyUser } from "../util/ApiUtil";
import {
    UserOutlined,
  } from "@ant-design/icons";
import "./Verify.css";

const Verify = (props) => {

    const [users, setUsers] = useState([]);

    useEffect(() => {
      }, []);

    const userSignIn = (values) => {
        console.log("values", values);
        verifyUser(values.firstName).then((response) => {
            console.log("response", response);
            localStorage.setItem("authorized", true);
            localStorage.setItem("senderFirstName", values.firstName);
            props.history.push("/chat")
          }).catch((error) => {
            notification.error({
              message: "Error",
              description: "Failed to authorize user!!",
            });
            localStorage.clear("authorized");
          });
    }

  return (
    <div className="login-container">
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={userSignIn}
      >
        <Form.Item
          name="firstName"
          rules={[{ required: true, message: "Please input your user id!" }]}
        >
          <Input
            size="large"
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Enter first name"
          />
        </Form.Item>
        <Form.Item>
          <Button
            shape="round"
            size="large"
            htmlType="submit"
            className="login-form-button"
          >
            Enter
          </Button>
        </Form.Item>
      </Form>
    </div>
    
  );
};
export default Verify;