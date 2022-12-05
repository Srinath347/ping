import React, { useEffect, useState } from "react";
import { Form, Input, Button, Divider, notification } from "antd";
import { login, facebookLogin, findValidUser, getUserById, findIdleUsers } from "../util/ApiUtil";
import "./Users.css";

const Users = (props) => {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        getUsers();
      }, []);

    const getUsers = () => {
        findIdleUsers().then((response) => {
            console.log("response", response);
            setUsers(response);
            // localStorage.setItem("sender", JSON.stringify(response));
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

    const login = () => {
        props.history.push("/login");
    }

  return (
    <section className="row" className="margin-top-44">
        <p className="title">Select any users from below list</p>
    <div className="user-list">
        <ul>
            {users?.map((data) => (
                <li key={data.id}> 
                    <p>{data.firstName + " " + data.lastName + " (" + data.id + ")"}</p>
                </li>
            ))}
        </ul>
        <Button
            shape="round"
            size="large"
            htmlType="submit"
            className="login-form-button"
            onClick={() => login()}
          >
            Next
          </Button>
    </div>
    </section>
    
    
  );
};
export default Users;