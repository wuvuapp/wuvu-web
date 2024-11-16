"use es6";

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Button from "../Buttons/Button";

import xmarkwhite from "../../assets/icons/xmarkwhite.svg";

import P from "../Text/P";
import Loading from "../Loading/Loading";

const NoticeViewport = ({
  type = null,
  credentials = null,
  updateCredentials = {},
  setSettingsViewportVisible = {},
  setNoticeViewportVisible = {},
}) => {
  const navigate = useNavigate();

  const [deletingAccount, setDeletingAccount] = useState(false);
  const [email, setEmail] = useState("");
  const [requestingEmail, setRequestingEmail] = useState(false);

  const requestConfig = {
    headers: {
      "x-api-key": process.env.REACT_APP_API_KEY,
    },
  };

  const handleDeleteAccount = async () => {
    await axios
      .post(
        `${process.env.REACT_APP_ACCOUNTS_API_URL}/accounts/${credentials.id}`,
        { deleting: true, deleteimage: credentials.image },
        requestConfig
      )
      .then(() => {
        const requestBody = {
          deleteAllNotifications: true,
        };
        axios
          .post(
            `${process.env.REACT_APP_NOTIFICATIONS_API_URL}/notifications/${credentials.id}`,
            requestBody,
            requestConfig
          )
          .catch((error) => {});
      })
      .catch((error) => {});
  };

  const disconnect = async (id) => {
    axios
      .get(
        `${process.env.REACT_APP_ACCOUNTS_API_URL}/accounts/${id}`,
        requestConfig
      )
      .then((res) => {
        let newConnections = { ...res.data.connections };
        delete newConnections[credentials.id];
        axios
          .post(
            `${process.env.REACT_APP_ACCOUNTS_API_URL}/accounts/${id}`,
            { connections: newConnections },
            requestConfig
          )
          .then(() => {
            let newConnections = { ...credentials.connections };
            delete newConnections[id];
            axios
              .post(
                `${process.env.REACT_APP_ACCOUNTS_API_URL}/accounts/${credentials.id}`,
                { connections: newConnections },
                requestConfig
              )
              .then((res) => {
                if (res.data.account.id === credentials.id) {
                  updateCredentials(res.data.account);
                }
                setNoticeViewportVisible(false);
              })
              .catch((error) => {});
          })
          .catch((error) => {});
      })
      .catch((error) => {});
  };

  const handleForgotPassword = async (to) => {
    setRequestingEmail(true);
    const otp = Math.random().toString(36).slice(2, 10);

    await axios
      .get(
        `${process.env.REACT_APP_ACCOUNTS_API_URL}/accounts/${to}`,
        requestConfig
      )
      .then(async (res) => {
        await axios
          .post(
            `${process.env.REACT_APP_ACCOUNTS_API_URL}/accounts/${res.data.id}`,
            {
              oldpassword: null,
              password: otp,
            },
            requestConfig
          )
          .then(async () => {
            await axios.post(
              `${process.env.REACT_APP_EMAILS_API_URL}/authenticate`,
              { message: "reset", to: to, otp: otp },
              requestConfig
            );
            setNoticeViewportVisible(false);
            alert(
              "A password recovery code has been sent to your email, and should be delivered shortly."
            );
            setRequestingEmail(false);
          })
          .catch((error) => {
            alert(
              "The supplied email is not currenly associated with a Wuvu account."
            );
            setRequestingEmail(false);
          });
      });
  };

  window.onclick = function (event) {
    if (event.target.id == "backdrop") {
      setNoticeViewportVisible(false);
    }
  };

  return (
    <div
      id="backdrop"
      style={{
        position: "fixed",
        zIndex: 60,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: "rgba(0,0,0,.10)",
      }}
    >
      <div
        style={{
          position: "fixed",
          top: "50%",
          right: "50%",
          bottom: "50%",
          left: "50%",
          margin: "auto",
          backgroundColor: "#ffffff",
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
          borderBottomRightRadius: 8,
          borderBottomLeftRadius: 8,
          width: "90%",
          maxWidth: 400,
          display: "table",
          transform: "translate(-50%, 0)",
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "#101010",
            borderTopRightRadius: 8,
            borderTopLeftRadius: 8,
            borderBottomStyle: "solid",
            borderBottomWidth: 1,
            borderBottomColor: "#101010",
          }}
        >
          <div
            style={{
              cursor: "pointer",
            }}
            onClick={() => {
              setNoticeViewportVisible(null);
            }}
          >
            <img
              src={xmarkwhite}
              style={{ width: 24, height: 24, margin: 4, marginTop: 6 }}
            />
          </div>
          <P
            style={{
              marginTop: 8,
              color: "#ffffff",
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            {type === "signout"
              ? "Sign Out?"
              : type === "deleteaccount"
              ? "Delete Account?"
              : type === "forgotpassword"
              ? "Forgot Password?"
              : null}
            ?
          </P>
          <div style={{ width: 24, height: 24 }} />
        </div>
        <P style={{ margin: 20 }}>
          {type === "deleteaccount"
            ? "We're sorry to see you go, but appreciate the time you spent with us!"
            : type === "forgotpassword"
            ? "No worries! Just enter in the email address you used to create your account and we will send you a link to reset your password."
            : null}
          {type === "signout"
            ? "You are about to sign out of your Wuvu account."
            : type === "deleteaccount"
            ? "Press the button below to permanently delete your account."
            : null}
        </P>
        {type === "forgotpassword" ? (
          <input
            className="textinput"
            style={{
              width: 340,
              marginTop: 20,
              marginLeft: 20,
              marginRight: 20,
              padding: 10,
              borderStyle: "solid",
              borderRadius: 8,
              borderWidth: 0.5,
              borderColor: "#cccccc",
              backgroundColor: "#eeeff0",
            }}
            type="text"
            value={email}
            placeholder={"Email address..."}
            maxLength="24"
            onChange={(event) => setEmail(event.target.value)}
          />
        ) : null}
        <div
          style={{
            display: "flex",
            margin: 20,
            justifyContent: "space-between",
          }}
        >
          <Button
            type="solid"
            style={{
              width: 125,
              opacity: deletingAccount || requestingEmail ? "50%" : "100%",
            }}
            onClick={() => {
              if (!deletingAccount && !requestingEmail) {
                setNoticeViewportVisible(false);
              }
            }}
          >
            <P style={{ fontWeight: "600" }}>Cancel</P>
          </Button>
          {type === "signout" ? (
            <Button
              type="solid"
              style={{
                backgroundColor: "#101010",
                width: 125,
              }}
              onClick={() => {
                setNoticeViewportVisible(false);
                updateCredentials(null);
                navigate("/");
              }}
            >
              <P style={{ fontWeight: "600" }}>Sign Out</P>
            </Button>
          ) : type === "deleteaccount" ? (
            <Button
              type="solid"
              style={{
                backgroundColor: "#EB5757",
                width: 125,
                opacity: deletingAccount ? "50%" : "100%",
              }}
              onClick={async () => {
                if (!deletingAccount) {
                  setDeletingAccount(true);
                  await handleDeleteAccount();
                  setNoticeViewportVisible(false);
                  updateCredentials(null);
                  navigate("/");
                }
              }}
            >
              <P style={{ fontWeight: "600" }}>Delete Account</P>
            </Button>
          ) : type === "forgotpassword" ? (
            <Button
              type="solid"
              style={{
                backgroundColor: "#101010",
                width: 125,
                opacity: requestingEmail ? "50%" : "100%",
              }}
              onClick={async () => {
                if (!requestingEmail) {
                  handleForgotPassword(email);
                }
              }}
            >
              <P style={{ fontWeight: "600" }}>Send</P>
            </Button>
          ) : null}
        </div>
        {deletingAccount ? (
          <P
            style={{ color: "#888888", textAlign: "center", marginBottom: 10 }}
          >
            {"Deleting account..."}
          </P>
        ) : null}
        {requestingEmail ? (
          <Loading
            style={{
              width: 20,
              height: 20,
              zIndex: 20,
              marginTop: 0,
              marginBottom: 10,
            }}
          />
        ) : null}
      </div>
    </div>
  );
};

export default NoticeViewport;
