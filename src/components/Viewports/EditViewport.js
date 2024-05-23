"use es6";

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AWS from "aws-sdk";

import Button from "../Buttons/Button";
import P from "../Text/P";
import Viewport from "./Viewport";
import UploadViewport from "./UploadViewport";
import Loading from "../Loading/Loading";

const S3_BUCKET = "wuvu-avatars";
const REGION = "us-east-1";

AWS.config.update({
  accessKeyId: process.env.REACT_APP_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_S3_SECRET_ACCESS_KEY,
});

const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
});

const EditViewport = ({
  isDesktop = false,
  credentials = null,
  setCredentials = {},
  updateCredentials = {},
  language = null,
  translation = null,
  editViewportVisible = false,
  setEditViewportVisible = {},
  uploadViewportVisible = false,
  setUploadViewportVisible = {},
  setEditTimestamp = {},
}) => {
  const navigate = useNavigate();
  const oldusername = credentials.username;

  const [username, setUsername] = useState(credentials.username || "");
  const [usernameValid, setUsernameValid] = useState(true);
  const [name, setName] = useState(credentials.name || "");
  const [bio, setBio] = useState(credentials.bio || "");
  const [email, setEmail] = useState(credentials.email || "");
  const [emailValid, setEmailValid] = useState(true);
  const [image, setImage] = useState(credentials.image || "");
  const [physique, setPhysique] = useState(
    credentials.characteristics?.physique || ""
  );
  const [aesthetics, setAesthetics] = useState(
    credentials.characteristics?.aesthetics || []
  );

  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const uploadFile = (file, id) => {
    const params = {
      ACL: "public-read",
      Body: file,
      Bucket: S3_BUCKET,
      Key: `${id}.jpeg`,
      ContentEncoding: "base64",
    };

    myBucket
      .putObject(params)
      .on("httpUploadProgress", (evt) => {
        setProgress(Math.round((evt.loaded / evt.total) * 100));
      })
      .send((err) => {
        // if (err) console.log(err);
      });
  };

  const requestConfig = {
    headers: {
      "x-api-key": process.env.REACT_APP_API_KEY,
    },
  };

  const checkUsername = (username) => {
    axios
      .get(
        `${process.env.REACT_APP_ACCOUNTS_API_URL}/accounts/${username}`,
        requestConfig
      )
      .then((res) => {
        if (!res.data || res.data.username === credentials.username) {
          setUsernameValid(true);
        } else {
          setUsernameValid(false);
        }
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  const checkEmail = (email) => {
    axios
      .get(
        `${process.env.REACT_APP_ACCOUNTS_API_URL}/accounts/${email}`,
        requestConfig
      )
      .then((res) => {
        if (!res.data || res.data.email === credentials.email) {
          setEmailValid(true);
        } else {
          setEmailValid(false);
        }
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  const editProfile = async () => {
    setIsLoading(true);
    if (credentials.username !== username) {
      if (
        !window.confirm(
          "Changing your username may affect your login credentials. Be aware of this!"
        )
      ) {
        setIsLoading(false);
        return;
      }
    }

    if (credentials.email !== email) {
      if (
        !window.confirm(
          "Changing your email may affect your login credentials. Be aware of this!"
        )
      ) {
        setIsLoading(false);
        return;
      }
    }

    const id = Date.now();

    uploadFile(selectedFile, id);
    const requestBody = {
      username: username,
      name: name,
      email: email,
      bio: bio,
      image: !!selectedFile
        ? `https://wuvu-avatars.s3.amazonaws.com/${id}.jpeg`
        : !!image
        ? image
        : null,
      characteristics: {
        physique: physique,
        aesthetics: aesthetics,
      },
    };

    await axios
      .post(
        `${process.env.REACT_APP_ACCOUNTS_API_URL}/accounts/${credentials.id}`,
        requestBody,
        requestConfig
      )
      .then(async (res) => {
        updateCredentials(res.data.account);
        setEditTimestamp(Date.now());
        setIsLoading(false);
        setEditViewportVisible(false);
      })
      .catch((error) => {
        setIsLoading(false);
        // console.log(error);
      });
  };

  return (
    <Viewport
      isDesktop={isDesktop}
      heading={"Edit Profile"}
      viewportVisible={editViewportVisible}
      setViewportVisible={setEditViewportVisible}
    >
      <div
        style={{
          margin: "auto",
          justifyContent: "center",
          textAlign: "center",
          maxHeight: isDesktop ? 550 : "100%",
          overflowY: "scroll",
        }}
      >
        <img
          src={
            image || "https://wuvu-defaults.s3.amazonaws.com/defaultprofile.png"
          }
          alt={`${credentials.name}'s profile image.`}
          style={{
            marginTop: 20,
            width: 100,
            height: 100,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#101010",
            borderStyle: "solid",
            objectFit: "cover",
          }}
        />
        <Button
          style={{ color: "#101010", margin: 10 }}
          onClick={() => {
            setUploadViewportVisible(true);
          }}
        >
          <P style={{ fontWeight: "600" }}>Change Image</P>
        </Button>
        <br />

        <div
          style={{
            display: "flex",
            margin: "auto",
            width: 350,
            paddingBottom: 10,
          }}
        >
          <div
            style={{
              textAlign: "left",
              justifyContent: "space-between",
              marginRight: 5,
            }}
          >
            <P style={{ color: "#000000", margin: 0, marginBottom: 10 }}>
              Username:
            </P>
            <input
              className="textinput"
              style={{
                width: 330,
                padding: 10,
                borderStyle: "solid",
                borderRadius: 8,
                borderWidth: 0.5,
                borderColor: "#cccccc",
                backgroundColor: isDesktop ? "#eeeff0" : "#ffffff",
              }}
              type="text"
              value={username}
              placeholder={"Username..."}
              maxLength="24"
              onChange={(event) => {
                setUsername(event.target.value);
                checkUsername(event.target.value);
              }}
            />
            {!usernameValid ? (
              <div
                style={{
                  marginTop: 5,
                  color: "#EB5757",
                  fontSize: 12,
                  textAlign: "center",
                }}
              >
                Username already taken.
              </div>
            ) : null}
          </div>
        </div>

        <P
          style={{
            color: "#000000",
            textAlign: "left",
            margin: "auto",
            width: 350,
            padding: 5,
          }}
        >
          Email Address:
        </P>

        <input
          className="textinput"
          style={{
            width: 330,
            padding: 10,
            marginBottom: 10,
            borderStyle: "solid",
            borderRadius: 8,
            borderWidth: 0.5,
            borderColor: "#cccccc",
            backgroundColor: isDesktop ? "#eeeff0" : "#ffffff",
          }}
          type="text"
          value={email}
          placeholder={"Email address..."}
          maxLength="100"
          onChange={(event) => {
            setEmail(event.target.value);
            checkEmail(event.target.value);
          }}
        />
        {!emailValid ? (
          <div
            style={{
              color: "#EB5757",
              fontSize: 12,
            }}
          >
            Email address already in use.
          </div>
        ) : null}

        <P
          style={{
            color: "#000000",
            textAlign: "left",
            margin: "auto",
            width: 350,
            padding: 5,
          }}
        >
          Bio:
        </P>
        <textarea
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 8,
            backgroundColor: isDesktop ? "#eeeff0" : "#ffffff",
            borderStyle: "solid",
            borderWidth: 0.5,
            borderColor: "#ccc",
            width: 330,
            height: 100,
            resize: "none",
          }}
          value={bio}
          placeholder={"Bio..."}
          onChange={(event) => {
            setBio(event.target.value.substring(0, 300));
          }}
        />
        <br />
        <P
          style={{
            color: "#000000",
            textAlign: "left",
            margin: "auto",
            width: 350,
            padding: 5,
            marginTop: 10,
          }}
        >
          Physique:
        </P>
        <div
          style={{
            width: 350,
            margin: "auto",
            backgroundColor: "#101010",
            borderRadius: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {[
              "Rectangle",
              "Mesomorph",
              "Pear",
              "Ectomorph",
              "Apple",
              "Triangle",
              "Endomorph",
              "Hourglass",
            ].map((category, index) => (
              <Button
                key={index}
                onClick={() => setPhysique(category.toLowerCase())}
                style={{
                  margin: 6,
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <P
                  style={{
                    fontWeight: "600",
                    fontSize: 13,
                    textAlign: "center",
                    color:
                      physique === category.toLowerCase()
                        ? "#ffd971"
                        : "#98a2b3",
                  }}
                >
                  {category}
                </P>
              </Button>
            ))}
            <Button
              onClick={() => setPhysique("")}
              style={{
                margin: 6,
                display: "flex",
                flexDirection: "row",
              }}
            >
              <P
                style={{
                  fontWeight: "600",
                  fontSize: 14,
                  textAlign: "center",
                  color: "#f9fafb",
                }}
              >
                Clear
              </P>
            </Button>
          </div>
        </div>

        <P
          style={{
            color: "#000000",
            textAlign: "left",
            margin: "auto",
            width: 350,
            padding: 5,
            marginTop: 10,
          }}
        >
          Aesthetics:
        </P>
        <div
          style={{
            width: 350,
            margin: "auto",
            backgroundColor: "#101010",
            borderRadius: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {[
              "Athleisure",
              "Classic",
              "Preppy",
              "Chic",
              "Elegant",
              "Artsy",
              "Streetwear",
              "Minimalist",
              "Punk",
              "Academia",
              "Tech",
              "Hipster",
              "Urban",
              "Rugged",
              "Retro",
              "Corporate",
              "Scandi",
              "Indie",
              "Y2K",
              "Old Money",
              "Alt",
              "Goth",
              "Starboy",
            ].map((category, index) => (
              <Button
                key={index}
                onClick={() =>
                  setAesthetics((prevAesthetics) =>
                    prevAesthetics.indexOf(category.toLowerCase()) !== -1
                      ? prevAesthetics.filter(
                          (item) => item !== category.toLowerCase()
                        )
                      : [...prevAesthetics, category.toLowerCase()]
                  )
                }
                style={{
                  margin: 6,
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <P
                  style={{
                    fontWeight: "600",
                    fontSize: 13,
                    textAlign: "center",
                    color:
                      aesthetics.indexOf(category.toLowerCase()) !== -1
                        ? "#ffd971"
                        : "#98a2b3",
                  }}
                >
                  {category}
                </P>
              </Button>
            ))}
            <Button
              onClick={() => setAesthetics([])}
              style={{
                margin: 6,
                display: "flex",
                flexDirection: "row",
              }}
            >
              <P
                style={{
                  fontWeight: "600",
                  fontSize: 14,
                  textAlign: "center",
                  color: "#f9fafb",
                }}
              >
                Clear
              </P>
            </Button>
          </div>
        </div>

        <Button
          type="solid"
          style={{
            textAlign: "center",
            margin: "auto",
            marginTop: 15,
            width: 312.5,
          }}
          onClick={() => {
            editProfile();
          }}
        >
          {!!isLoading ? (
            <Loading color="white" />
          ) : (
            <P style={{ fontWeight: "600" }}>Save</P>
          )}
        </Button>
        {!isDesktop ? <div style={{ height: 80 }} /> : null}
      </div>
      {!!uploadViewportVisible && (
        <UploadViewport
          isDesktop={isDesktop}
          credentials={credentials}
          setCredentials={setCredentials}
          updateCredentials={updateCredentials}
          language={language}
          translation={translation}
          uploadViewportVisible={uploadViewportVisible}
          setUploadViewportVisible={setUploadViewportVisible}
          image={image}
          setImage={setImage}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
        />
      )}
    </Viewport>
  );
};

export default EditViewport;
