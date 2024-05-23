"use es6";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import H3 from "../Text/H3";
import H2 from "../Text/H2";
import P from "../Text/P";
import HR from "../Text/HR";
import Viewport from "./Viewport";

const SubscriptionViewport = ({
  isDesktop = null,
  subscriptionViewportVisible = false,
  setSubscriptionViewportVisible = {},
}) => {
  const navigate = useNavigate();

  const requestConfig = {
    headers: {
      "x-api-key": process.env.REACT_APP_API_KEY,
    },
  };

  return (
    <Viewport
      isDesktop={isDesktop}
      heading={"Wuvu Subscriptions"}
      viewportVisible={subscriptionViewportVisible}
      setViewportVisible={setSubscriptionViewportVisible}
    >
      <div style={{ height: 10 }} />
      <div
        style={{
          margin: "auto",
          justifyContent: "center",
          textAlign: "center",
          maxHeight: 550,
          overflowY: "scroll",
        }}
      >
        Coming soon!
      </div>
    </Viewport>
  );
};

export default SubscriptionViewport;
