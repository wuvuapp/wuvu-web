"use es6";

import React from "react";
import Viewport from "./Viewport";
import SubscriptionCard from "../Cards/SubscriptionCard";
import { useWindowDimensions } from "../../utils/CustomHooks";

const SubscriptionViewport = ({
  credentials = {},
  isDesktop = null,
  updateCredentials = {},
  subscriptionViewportVisible = false,
  setSubscriptionViewportVisible = {},
  setEditTimestamp = {},
}) => {
  const dimensions = useWindowDimensions();

  const requestConfig = {
    headers: {
      "x-api-key": process.env.REACT_APP_API_KEY,
    },
  };

  return (
    <Viewport
      isDesktop={isDesktop}
      heading={"Subscriptions"}
      viewportVisible={subscriptionViewportVisible}
      setViewportVisible={setSubscriptionViewportVisible}
    >
      <div style={{ height: 5 }} />
      <div
        style={{
          margin: "auto",
          justifyContent: "center",
          textAlign: "center",
          overflowY: "scroll",
          maxHeight: dimensions.height - 60,
        }}
      >
        <div
          style={{
            display: isDesktop ? "flex" : "block",
            justifyContent: "space-around",
          }}
        >
          {["free", "pro", "max"].map((type, index) => (
            <SubscriptionCard
              key={index}
              type={type}
              isDesktop={isDesktop}
              credentials={credentials}
              updateCredentials={updateCredentials}
              subscriptionViewportVisible={subscriptionViewportVisible}
              setSubscriptionViewportVisible={setSubscriptionViewportVisible}
              setEditTimestamp={setEditTimestamp}
            />
          ))}
        </div>
      </div>
    </Viewport>
  );
};

export default SubscriptionViewport;
