"use es6";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useWindowDimensions } from "./utils/CustomHooks";

import { gapi } from "gapi-script";
import logo from "./logo.svg";
import google from "./google.svg";
import appstore from "./appstore.svg";
import googleplay from "./googleplay.svg";

import EditViewport from "./components/Viewports/EditViewport";
import NoticeViewport from "./components/Viewports/NoticeViewport";
import PasswordViewport from "./components/Viewports/PasswordViewport";
import SubscriptionViewport from "./components/Viewports/SubscriptionViewport";

import P from "./components/Text/P";
import Button from "./components/Buttons/Button";
import Loading from "./components/Loading/Loading";
import H2 from "./components/Text/H2";

const checkThirdPartyCookies = () => {
  try {
    document.cookie = "testcookie=1; SameSite=None; Secure; path=/";
    const hasCookies = document.cookie.indexOf("testcookie") !== -1;
    document.cookie =
      "testcookie=1; SameSite=None; Secure; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
    return hasCookies;
  } catch (e) {
    return false;
  }
};

const promptForThirdPartyCookies = () => {
  if (!checkThirdPartyCookies()) {
    alert(
      "Please enable third-party cookies for this website to function properly."
    );
  }
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [credentials, setCredentials] = useState(null);

  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const [noticeViewportVisible, setNoticeViewportVisible] = useState(false);
  const [editViewportVisible, setEditViewportVisible] = useState(false);
  const [passwordViewportVisible, setPasswordViewportVisible] = useState(false);
  const [subscriptionViewportVisible, setSubscriptionViewportVisible] =
    useState(false);
  const [uploadViewportVisible, setUploadViewportVisible] = useState(false);

  const [editTimestamp, setEditTimestamp] = useState(Date.now());

  const dimensions = useWindowDimensions();

  const isDesktop = dimensions.width > 980;

  const requestConfig = {
    headers: {
      "x-api-key": process.env.REACT_APP_API_KEY,
    },
  };

  const getCredentials = async () => {
    const data = await JSON.parse(localStorage.getItem("wuvu-credentials"));
    if (data) {
      setCredentials(data);
    }
    refreshCredentials(credentials?.id);
  };

  const refreshCredentials = async (id) => {
    if (!!id) {
      const requestConfig = {
        headers: {
          "x-api-key": process.env.REACT_APP_API_KEY,
        },
      };

      await axios
        .get(
          `${process.env.REACT_APP_ACCOUNTS_API_URL}/accounts/${id}`,
          requestConfig
        )
        .then(async (res) => {
          setCredentials(res.data);
          updateCredentials(res.data);
        })
        .catch((error) => {
          console.log(error);
          clearCredentials();
        });
    }
  };

  const clearCredentials = async () => {
    try {
      localStorage.removeItem("wuvu-credentials");
      setCredentials(null);
    } catch (error) {
      console.log(error);
    }
  };

  const updateCredentials = async (data) => {
    setCredentials(data);
    localStorage.setItem("wuvu-credentials", JSON.stringify(data));
  };

  useEffect(() => {
    getCredentials();
  }, [editTimestamp, location.pathname]);

  const handleCallbackResponse = async (email) => {
    const requestBody = {
      identifier: email,
      password: password,
      federated: true,
      weblogin: true,
    };
    setIsAuthenticating(true);

    await axios
      .post(
        `${process.env.REACT_APP_ACCOUNTS_API_URL}/signin`,
        requestBody,
        requestConfig
      )
      .then(async (res) => {
        if (res.data.account) {
          setIsAuthenticating(false);
          updateCredentials(res.data.account);
        } else {
          setIsAuthenticating(false);
        }
      })
      .catch((error) => {
        setIsAuthenticating(false);
        setErrorMessage(error.response.data.message);
      });
  };

  const signinGoogle = () => {
    setErrorMessage("");
    const attachSignin = (element) => {
      auth2.attachClickHandler(
        element,
        {},
        (googleUser) => {
          const email = googleUser.getBasicProfile().getEmail();
          handleCallbackResponse(email);
        },
        (error) => {
          setIsAuthenticating(false);
        }
      );
    };

    var auth2;
    gapi.load("auth2", function () {
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      auth2 = gapi.auth2.init({
        client_id: `${process.env.REACT_APP_OAUTH2_CLIENT_ID}.apps.googleusercontent.com`,
        ux_mode: "popup",
        callback: handleCallbackResponse,
      });
      attachSignin(document.getElementById("SigninDiv"));
    });
  };

  useEffect(() => {
    signinGoogle();
    setIsAuthenticating(false);
  }, [credentials]);

  useEffect(() => {
    promptForThirdPartyCookies();
  }, []);

  // var accessToken = gapi.auth.getToken().access_token;

  const submitHandler = async (event) => {
    setErrorMessage("");
    event.preventDefault();

    setErrorMessage(null);
    const requestConfig = {
      headers: {
        "x-api-key": process.env.REACT_APP_API_KEY,
      },
    };
    const requestBody = {
      identifier: identifier.toLowerCase(),
      password: password,
    };

    // console.log(requestBody);

    setIsAuthenticating(true);

    await axios
      .post(
        `${process.env.REACT_APP_ACCOUNTS_API_URL}/${"signin"}`,
        requestBody,
        requestConfig
      )
      .then(async (res) => {
        if (
          res.data.account.newaccount ||
          res.data.account.newaccount === null ||
          res.data.account.newaccount === undefined
        ) {
          await axios
            .post(
              `${process.env.REACT_APP_EMAILS_API_URL}/authenticate`,
              { message: "create", to: res.data.account.email },
              requestConfig
            )
            .then(async () => {
              await axios
                .post(
                  `${process.env.REACT_APP_ACCOUNTS_API_URL}/accounts/${res.data.account.id}`,
                  { newaccount: false },
                  requestConfig
                )
                .then((newres) => {
                  updateCredentials(newres.data.account);
                })
                .catch((error) => {
                  setIsAuthenticating(false);
                  setErrorMessage(error.response.data.message);
                });
            });
        } else {
          updateCredentials(res.data.account);
        }
      })
      .catch((error) => {
        setIsAuthenticating(false);
        setErrorMessage(error.response.data.message);
      });
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        color: "#000000",
        margin: "auto",
        justifyContent: "center",
        textAlign: "center",
        height: "100%",
        background:
          "linear-gradient(0deg, rgba(16,16,16,1) 0%, rgba(51,51,51,1) 100%)",
        flex: 1,
      }}
    >
      {!!editViewportVisible ? (
        <EditViewport
          isDesktop={isDesktop}
          credentials={credentials}
          setCredentials={setCredentials}
          updateCredentials={updateCredentials}
          setEditTimestamp={setEditTimestamp}
          editViewportVisible={editViewportVisible}
          setEditViewportVisible={setEditViewportVisible}
          uploadViewportVisible={uploadViewportVisible}
          setUploadViewportVisible={setUploadViewportVisible}
        />
      ) : null}
      {!!passwordViewportVisible ? (
        <PasswordViewport
          isDesktop={isDesktop}
          credentials={credentials}
          setCredentials={setCredentials}
          updateCredentials={updateCredentials}
          passwordViewportVisible={passwordViewportVisible}
          setPasswordViewportVisible={setPasswordViewportVisible}
        />
      ) : null}
      {!!noticeViewportVisible ? (
        <NoticeViewport
          type={noticeViewportVisible}
          credentials={credentials}
          setCredentials={setCredentials}
          updateCredentials={updateCredentials}
          noticeViewportVisible={noticeViewportVisible}
          setNoticeViewportVisible={setNoticeViewportVisible}
        />
      ) : null}
      {!!subscriptionViewportVisible ? (
        <SubscriptionViewport
          isDesktop={isDesktop}
          credentials={credentials}
          setCredentials={setCredentials}
          updateCredentials={updateCredentials}
          setEditTimestamp={setEditTimestamp}
          subscriptionViewportVisible={subscriptionViewportVisible}
          setSubscriptionViewportVisible={setSubscriptionViewportVisible}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {!!!credentials ? (
          <div>
            <div style={{ height: 500 }}>
              <img
                src={logo}
                style={{ maxWidth: 400, marginLeft: 20 }}
                alt="logo"
              />
              <H2 style={{ color: "#ffd971" }}>Account Console</H2>
              <div
                style={{
                  position: "fixed",
                  top: "33%",
                  bottom: "50%",
                  left: "50%",
                  margin: "auto",
                  justifyContent: "center",
                  textAlign: "center",
                  transform: "translate(-50%, 0%)",
                }}
              >
                <form
                  onSubmit={isAuthenticating ? null : submitHandler}
                  style={{
                    textAlign: "center",
                    justifyContent: "center",
                    margin: "auto",
                    opacity: !!isAuthenticating ? "50%" : "100%",
                  }}
                >
                  <input
                    className="textinput"
                    style={{
                      width: 330,
                      margin: 10,
                      padding: 10,
                      borderStyle: "solid",
                      borderRadius: 8,
                      borderColor: "#ffffff",
                    }}
                    type="text"
                    value={identifier}
                    placeholder={"Email or Username"}
                    onChange={(event) => setIdentifier(event.target.value)}
                  />
                  <br />
                  <input
                    className="textinput"
                    style={{
                      width: 330,
                      padding: 10,
                      borderStyle: "solid",
                      borderRadius: 8,
                      borderColor: "#ffffff",
                    }}
                    type="password"
                    value={password}
                    placeholder={"Password"}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  {isAuthenticating && !errorMessage ? (
                    <div
                      style={{
                        cursor: "pointer",
                        width: 350,
                        margin: 10,
                        paddingTop: 6,
                        paddingBottom: 4,
                        fontWeight: "600",
                        fontSize: 14,
                        borderRadius: 8,
                        backgroundColor: "#000000",
                        borderColor: "#000000",
                        borderStyle: "solid",
                        color: "#ffffff",
                      }}
                    >
                      <Loading color="white" />
                    </div>
                  ) : (
                    <input
                      className="textinput"
                      type="submit"
                      value={"Sign In"}
                      style={{
                        cursor: "pointer",
                        width: 355,
                        margin: 10,
                        height: 40,
                        fontWeight: "600",
                        fontSize: 14,
                        borderRadius: 8,
                        backgroundColor: "#000000",
                        borderColor: "#000000",
                        borderStyle: "solid",
                        color: "#ffffff",
                      }}
                    />
                  )}

                  <Button
                    type="solid"
                    style={{
                      paddingTop: 5,
                      paddingBottom: 7,
                      backgroundColor: "#ffffff",
                      margin: "auto",
                      width: 315,
                      justifyContent: "space-between",
                      opacity: isAuthenticating ? "50%" : "100%",
                      textAlign: "center",
                    }}
                    onClick={() => {
                      if (!isAuthenticating) {
                        signinGoogle();
                      }
                    }}
                    id="SigninDiv"
                  >
                    <div
                      style={{
                        margin: "auto",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={google}
                        style={{ width: 26, height: 26, marginTop: 1 }}
                      />
                      <span
                        style={{
                          color: "#000000",
                          fontSize: 14,
                          margin: 5,
                        }}
                      >
                        Sign In With Google
                      </span>
                    </div>
                  </Button>
                  <div style={{ marginTop: 20 }}>
                    <Button
                      style={{
                        textAlign: "center",
                        fontSize: 14,
                        margin: "auto",
                        color: "#ffffff",
                        opacity: isAuthenticating ? "50%" : "100%",
                      }}
                      onClick={() => {
                        if (!isAuthenticating) {
                          setNoticeViewportVisible("forgotpassword");
                        }
                      }}
                    >
                      Forgot password? Request a recovery.
                    </Button>
                  </div>

                  {!!errorMessage && !isAuthenticating ? (
                    <P
                      style={{
                        color: "#EB5757",
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
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div>
              <div style={{ height: 500, width: 355 }}>
                <div
                  style={{
                    marginBottom: 15,
                    marginRight: 0,
                    padding: 15,
                    backgroundColor: "#f9fafb",
                    borderRadius: 8,
                    borderStyle: "solid",
                    borderWidth: 1,
                    borderColor: "#98a2b3",
                    boxShadow:
                      "0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <div>
                      <img
                        style={{
                          width: 84,
                          height: 84,
                          borderRadius: 12,
                          aspectRatio: 1,
                          marginRight: 15,
                          marginBottom: 5,
                          objectFit: "cover",
                          borderWidth: 1,
                          borderColor: "#98a2b3",
                          borderStyle: "solid",
                        }}
                        src={
                          credentials.image ||
                          "https://wuvu-defaults.s3.amazonaws.com/defaultcredentials.png"
                        }
                      />
                    </div>
                    <div style={{ width: 355, textAlign: "left" }}>
                      <div style={{ display: "flex" }}>
                        <P
                          style={{
                            color: "#101010",
                            fontSize: 16,
                            fontWeight: "600",
                            marginBottom: 10,
                          }}
                        >
                          @{credentials.username}
                        </P>
                      </div>
                      {!!credentials.bio ? (
                        <P style={{ color: "#555555", marginBottom: 10 }}>
                          {credentials.bio}
                        </P>
                      ) : null}
                      <Button
                        style={{
                          color: "#98a2bc",
                          width: 84,
                        }}
                        onClick={() => {
                          setEditViewportVisible(true);
                        }}
                      >
                        <P
                          style={{
                            fontWeight: "600",
                            fontSize: 12,
                          }}
                        >
                          Edit Profile
                        </P>
                      </Button>
                    </div>
                  </div>

                  <hr />
                  <div style={{ textAlign: "left" }}>
                    <div style={{ display: "flex" }}>
                      <P
                        style={{
                          color: "#555555",
                          marginTop: 0,
                        }}
                      >
                        Physique:
                      </P>
                      <div
                        style={{
                          color: "#ffffff",
                          marginTop: 1,
                          marginLeft: 10,
                          fontSize: 10,
                          paddingLeft: 8,
                          paddingRight: 8,
                          paddingTop: 2,
                          paddingBottom: 2,
                          borderRadius: 4,
                          backgroundColor: "#101010",
                          textAlign: "left",
                          marginRight: 5,
                          marginBottom: 5,
                          fontStyle: "italic",
                          fontWeight: "600",
                        }}
                      >
                        {credentials.characteristics.physique
                          .slice(0, 1)
                          .toUpperCase() +
                          credentials.characteristics.physique.slice(1)}
                      </div>
                    </div>

                    <P
                      style={{
                        color: "#555555",
                        marginTop: 5,
                        marginBottom: 10,
                      }}
                    >
                      Aesthetics:
                    </P>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                      }}
                    >
                      {credentials.characteristics.aesthetics.map(
                        (category, index) => (
                          <div
                            key={index}
                            style={{
                              color: "#ffffff",
                              fontSize: 10,
                              paddingLeft: 8,
                              paddingRight: 8,
                              paddingTop: 2,
                              paddingBottom: 2,
                              borderRadius: 4,
                              backgroundColor: "#101010",
                              textAlign: "left",
                              marginRight: 5,
                              marginBottom: 5,
                              fontStyle: "italic",
                              fontWeight: "600",
                            }}
                          >
                            {category.slice(0, 1).toUpperCase() +
                              category.slice(1)}
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <hr />
                  <div style={{ display: "flex" }}>
                    <P
                      style={{
                        color: "#555555",
                        marginTop: 0,
                        marginBottom: 10,
                      }}
                    >
                      Subscription:
                    </P>
                    <div
                      style={{
                        marginBottom: 5,
                        marginTop: -2,
                        marginLeft:
                          credentials.subscription === "max" ||
                          credentials.subscription === "pro"
                            ? 15
                            : 5,
                        paddingLeft:
                          credentials.subscription === "max" ||
                          credentials.subscription === "pro"
                            ? 15
                            : 2.5,
                        paddingRight: 15,
                        paddingTop: 5,
                        paddingBottom: 2,
                        borderRadius: 8,
                        background:
                          credentials.subscription === "max"
                            ? "linear-gradient(to right, #fda29b, #ffd971, #6ce9a6, #84caff, #d6bbfb)"
                            : credentials.subscription === "pro"
                            ? "#ffd971"
                            : "#ffffff",
                        color: "#101010",
                      }}
                    >
                      <P
                        style={{
                          fontWeight: "600",
                          fontSize: 11,
                          fontStyle:
                            credentials.subscription === "max" ||
                            credentials.subscription === "pro"
                              ? "italic"
                              : "normal",
                        }}
                      >
                        {credentials.subscription === "max"
                          ? "Wuvu MAX"
                          : credentials.subscription === "pro"
                          ? "Wuvu Pro"
                          : "Wuvu Free"}
                      </P>
                    </div>
                  </div>

                  <Button
                    type="solid"
                    style={{
                      color: "#ffd971",
                      marginTop: 4,
                    }}
                    onClick={() => {
                      setSubscriptionViewportVisible(true);
                    }}
                  >
                    <P style={{ fontWeight: "600" }}>Manage Subscription</P>
                  </Button>
                </div>

                <Button
                  type="solid"
                  style={{
                    color: "#ffffff",
                  }}
                  onClick={() => {
                    setPasswordViewportVisible(true);
                  }}
                >
                  <P style={{ fontWeight: "600" }}>Change Password</P>
                </Button>
                <div style={{ display: "flex", width: "100%", marginTop: 15 }}>
                  <Button
                    type="solid"
                    style={{
                      color: "#000000",
                      backgroundColor: "#98a2b3",
                      flex: 1,
                    }}
                    onClick={() => {
                      setNoticeViewportVisible("signout");
                    }}
                  >
                    <P style={{ fontWeight: "600" }}>Sign Out</P>
                  </Button>
                </div>
                <div style={{ display: "flex", width: "100%", marginTop: 15 }}>
                  <Button
                    type="solid"
                    style={{
                      color: "#ffffff",
                      backgroundColor: "#eb5757",
                      flex: 1,
                    }}
                    onClick={() => {
                      setNoticeViewportVisible("deleteaccount");
                    }}
                  >
                    <P style={{ fontWeight: "600" }}>Delete Account</P>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div style={{ display: "flex", marginTop: 60 }}>
          <img
            onClick={() => {
              window.open(
                "https://www.apple.com/app-store/",
                "_blank",
                "noreferrer"
              );
            }}
            onMouseOver={({ currentTarget }) => {
              currentTarget.style.opacity = "50%";
            }}
            onMouseOut={({ currentTarget }) => {
              currentTarget.style.opacity = "100%";
            }}
            src={appstore}
            style={{ cursor: "pointer", width: 170, marginRight: 7.5 }}
            alt="Download Wuvu on the Apple App Store!"
          />
          <img
            onClick={() => {
              window.open(
                "https://play.google.com/store/apps",
                "_blank",
                "noreferrer"
              );
            }}
            onMouseOver={({ currentTarget }) => {
              currentTarget.style.opacity = "50%";
            }}
            onMouseOut={({ currentTarget }) => {
              currentTarget.style.opacity = "100%";
            }}
            src={googleplay}
            style={{ cursor: "pointer", width: 170, marginLeft: 7.5 }}
            alt="Download Wuvu on the Google Play Store!"
          />
        </div>
      </div>
    </div>
  );
}

export default App;
