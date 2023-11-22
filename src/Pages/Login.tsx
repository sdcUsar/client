import React from "react";
import "./../App.css";
import logo from "../img/logo.png";
import Logform from "../components/LoginForm";
import TeacherLogform from "../components/TeacherLoginForm";

interface Props {
  Name: string;
  Description: string;
  Form: string;
}

const Login: React.FC<Props> = ({ Name, Description, Form }) => {
  return (
    <>
      <div className="login-bg">
        <div className="login-inner">
          <div className="login-left">
            <h2 className="login-h2">Student Attendance System</h2>
            <h1 className="login-h1">Welcome</h1>
          </div>
          <div className="login-right">
            <div className="right-inner container m-4 d-flex flex-column justify-content-center">
              <img className="logo m-auto" src={logo} alt="logo" />
              <div className="login-form container">
                <h3 className="log-h3">{Name}</h3>
                <p className="log-p">{Description}</p>
                {Form === "Student" ? <Logform /> : <TeacherLogform />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
