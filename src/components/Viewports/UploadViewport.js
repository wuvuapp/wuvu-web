"use es6";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../Buttons/Button";

import P from "../Text/P";
import Viewport from "./Viewport";

const UploadViewport = ({
  isDesktop = null,
  uploadViewportVisible = false,
  setUploadViewportVisible = {},
  setImage = {},
  selectedFile = null,
  setSelectedFile = {},
}) => {
  const navigate = useNavigate();
  const [imageLink, setImageLink] = useState("");

  const requestConfig = {
    headers: {
      "x-api-key": process.env.REACT_APP_API_KEY,
    },
  };

  return (
    <Viewport
      isDesktop={isDesktop}
      heading={"Upload Image"}
      viewportVisible={uploadViewportVisible}
      setViewportVisible={setUploadViewportVisible}
    >
      <div style={{ textAlign: "center", maxHeight: 550, overflowY: "scroll" }}>
        <label
          id="browse-files-label"
          for="browse-files"
          style={{
            display: "flex",
            alignItems: "center",
            textAlign: "center",
            marginTop: 20,
          }}
        >
          <div
            style={{
              position: "relative",
              margin: "auto",
              padding: 5,
              height: "fit-content",
            }}
          >
            <P style={{ fontWeight: 600, fontSize: 16 }}>Browse</P>
          </div>
        </label>

        <input
          id="browse-files"
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />
        <br />
        <input
          type="text"
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
          placeholder="Or paste an image URL here:"
          onChange={(event) => {
            setImageLink(event.target.value);
            setSelectedFile(null);
          }}
        />

        {!!selectedFile ? (
          <div>
            <img
              id="blah"
              src={URL.createObjectURL(selectedFile) || "#"}
              style={{
                maxHeight: 300,
                maxWidth: 335,
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 4,
                borderStyle: "solid",
                margin: 15,
                objectFit: "cover",
                padding: 10,
              }}
            />
            <Button
              type="solid"
              style={{ width: 315, margin: "auto" }}
              onClick={() => {
                setImage(URL.createObjectURL(selectedFile));
                setUploadViewportVisible(false);
              }}
            >
              Select
            </Button>
          </div>
        ) : !!imageLink ? (
          <div>
            <img
              id="blah"
              src={imageLink}
              style={{
                maxHeight: 300,
                maxWidth: 335,
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 4,
                borderStyle: "solid",
                margin: 15,
                objectFit: "cover",
                padding: 10,
              }}
            />
            <Button
              type="solid"
              style={{ width: 315, margin: "auto" }}
              onClick={() => {
                setImage(imageLink);
                setUploadViewportVisible(false);
              }}
            >
              Select
            </Button>
          </div>
        ) : (
          <P style={{ margin: 50, marginTop: 20 }}>
            Your image preview will appear here.
          </P>
        )}
      </div>
    </Viewport>
  );
};

export default UploadViewport;
