"use es6";

import React, { useState, useEffect } from "react";
import arrowwhite from "../../assets/icons/arrowwhite.svg";
import xmarkwhite from "../../assets/icons/xmarkwhite.svg";
import P from "../Text/P";

const Viewport = ({
  isDesktop = null,
  heading = null,
  children = "[insert text]",
  viewportVisible = false,
  setViewportVisible = {},
}) => {
  window.onclick = function (event) {
    if (event.target.id == "backdrop" && isDesktop) {
      setViewportVisible(false);
    }
  };

  const [initialUrl, setInitialUrl] = useState(window.location.pathname);

  useEffect(() => {
    if (initialUrl !== window.location.pathname) {
      setViewportVisible(false);
    }
  }, [window.location.pathname]);

  return isDesktop ? (
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
          zIndex: 65,
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
          maxWidth: 500,
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
              setViewportVisible(false);
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
            {heading}
          </P>
          <div style={{ width: 24, height: 24 }} />
        </div>

        <div style={{ marginBottom: 20, marginTop: 0 }}>{children}</div>
      </div>
    </div>
  ) : (
    <div
      style={{
        position: "fixed",
        zIndex: 60,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: "#eeeff0",
      }}
    >
      <div
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          height: 36,
          zIndex: 65,
          backgroundColor: "#101010",
          borderBottomStyle: "solid",
          borderBottomWidth: 1,
          borderBottomColor: "#101010",
          display: "flex",
          justifyContent: "space-between",
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            cursor: "pointer",
          }}
          onClick={() => {
            setViewportVisible(false);
          }}
        >
          <img
            src={arrowwhite}
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
          {heading}
        </P>
        <div style={{ width: 24, height: 24 }} />
      </div>
      <div
        style={{
          marginBottom: 0,
          marginTop: 35,
          height: "100%",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Viewport;
