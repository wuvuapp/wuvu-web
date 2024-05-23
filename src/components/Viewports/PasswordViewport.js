"use es6";

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import P from "../Text/P";
import Viewport from "./Viewport";
import Loading from "../Loading/Loading";

const PasswordViewport = ({
  isDesktop = null,
  credentials = null,
  updateCredentials = {},
  passwordViewportVisible = false,
  setPasswordViewportVisible = {},
}) => {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordAgain, setNewPasswordAgain] = useState("");

  const [isChanging, setIsChanging] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const requestConfig = {
    headers: {
      "x-api-key": process.env.REACT_APP_API_KEY,
    },
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (
      (credentials.password !== null && currentPassword.trim() === "") ||
      newPassword.trim() === "" ||
      newPasswordAgain.trim() === ""
    ) {
      setErrorMessage("All fields are required.");
      return;
    }
    if (newPassword.trim() !== newPasswordAgain.trim()) {
      setErrorMessage("Your new password fields must match.");
      return;
    }
    setErrorMessage(null);
    const requestConfig = {
      headers: {
        "x-api-key": process.env.REACT_APP_API_KEY,
      },
    };
    const requestBody = {
      oldpassword: currentPassword,
      password: newPassword,
    };

    setIsChanging(true);

    axios
      .post(
        `${process.env.REACT_APP_ACCOUNTS_API_URL}/accounts/${credentials.id}`,
        requestBody,
        requestConfig
      )
      .then((res) => {
        updateCredentials(res.data.account);
        setPasswordViewportVisible(false);
      })
      .catch((error) => {
        setErrorMessage(error.response.data.message);
      });
  };

  return (
    <Viewport
      isDesktop={isDesktop}
      heading={"Change Password"}
      viewportVisible={passwordViewportVisible}
      setViewportVisible={setPasswordViewportVisible}
    >
      <div style={{ height: 10 }} />
      <form
        onSubmit={submitHandler}
        style={{
          textAlign: "center",
          justifyContent: "center",
          margin: "auto",
          maxHeight: 550,
          overflowY: "scroll",
        }}
      >
        {!!credentials.password ? (
          <div>
            <input
              className="textinput"
              style={{
                width: 330,
                margin: 10,
                padding: 10,
                borderStyle: "solid",
                borderRadius: 8,
                borderWidth: 0.5,
                borderColor: "#cccccc",
                backgroundColor: isDesktop ? "#eeeff0" : "#ffffff",
              }}
              type="password"
              value={currentPassword}
              placeholder={"Current password..."}
              maxLength="24"
              onChange={(event) => setCurrentPassword(event.target.value)}
            />
            <br />
          </div>
        ) : null}
        <input
          className="textinput"
          style={{
            width: 330,
            margin: 10,
            padding: 10,
            borderStyle: "solid",
            borderRadius: 8,
            borderWidth: 0.5,
            borderColor: "#cccccc",
            backgroundColor: isDesktop ? "#eeeff0" : "#ffffff",
          }}
          type="password"
          value={newPassword}
          placeholder={"New password..."}
          maxLength="24"
          onChange={(event) => setNewPassword(event.target.value)}
        />
        <br />
        <input
          className="textinput"
          style={{
            width: 330,
            margin: 10,
            padding: 10,
            borderStyle: "solid",
            borderRadius: 8,
            borderWidth: 0.5,
            borderColor: "#cccccc",
            backgroundColor: isDesktop ? "#eeeff0" : "#ffffff",
          }}
          type="password"
          value={newPasswordAgain}
          placeholder={"New password again..."}
          maxLength="24"
          onChange={(event) => setNewPasswordAgain(event.target.value)}
        />
        <div
          style={{
            display: "flex",
            margin: "auto",
            width: 355,
          }}
        >
          <input
            className="textinput"
            type="submit"
            value={"Change Password"}
            style={{
              cursor: "pointer",
              marginTop: 8,
              width: "100%",
              padding: 8,
              fontWeight: 600,
              fontSize: 14,
              borderRadius: 8,
              backgroundColor: "#000000",
              borderColor: "#000000",
              borderStyle: "solid",
              color: "#ffffff",
            }}
          />
        </div>

        {errorMessage && !isChanging ? (
          <P
            style={{
              color: "#EB5757",
              backgroundColor: "rgba(255,255,255,.75)",
              fontWeight: 600,
              padding: 4,
              marginTop: 20,
              borderRadius: 8,
              width: 350,
              textAlign: "center",
              margin: "auto",
            }}
          >
            {errorMessage}
          </P>
        ) : null}
        {isChanging && !errorMessage ? <Loading color="focused" /> : null}
      </form>
    </Viewport>
  );
};

export default PasswordViewport;
