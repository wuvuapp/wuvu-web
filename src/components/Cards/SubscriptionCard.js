"use es6";

import { useState, useEffect } from "react";
import H1 from "../Text/H1";
import H2 from "../Text/H2";

import axios from "axios";
import P from "../Text/P";

import GenerateFocusedFullIcon from "../../assets/icons/generatefocusedfull.svg";
import Button from "../Buttons/Button";
import Loading from "../Loading/Loading";

const SubscriptionCard = ({
  type = "free",
  isDesktop = {},
  credentials = {},
  children = "[insert text]",
  updateCredentials = {},
  subscriptionViewportVisible = false,
  setSubscriptionViewportVisible = {},
  setEditTimestamp = {},
  style = {},
  ...buttonProps
}) => {
  const [plan, setPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const requestConfig = {
    headers: {
      "x-api-key": process.env.REACT_APP_API_KEY,
    },
  };

  const getPlan = async (type) => {
    await axios
      .get(
        `${process.env.REACT_APP_SUBSCRIPTIONS_API_URL}/plans/${type}`,
        requestConfig
      )
      .then(async (res) => {
        setPlan(res.data);
      });
  };

  const checkoutSubscription = async (type, cancelling) => {
    setIsLoading(true);
    await axios
      .post(
        `${process.env.REACT_APP_SUBSCRIPTIONS_API_URL}/checkout`,
        {
          accountId: credentials.id,
          subscription: type,
          cancelling: cancelling,
        },
        requestConfig
      )
      .then(async (res) => {
        setIsLoading(false);
        alert(
          `You just ${cancelling ? "cancelled" : "purchased"} ${
            type === "max"
              ? "Wuvu MAX"
              : type === "pro"
              ? "Wuvu Pro"
              : "Wuvu Free"
          }.`
        );
        updateCredentials(res.data.account);
        setEditTimestamp(Date.now());
        setSubscriptionViewportVisible(false);
      })
      .catch((error) => {
        setIsLoading(false);
        // console.log(error);
      });
  };

  useEffect(() => {
    getPlan(type);
  }, []);

  return (
    <div
      style={{
        minWidth: 250,
        margin: 10,
        padding: 15,
        backgroundColor: "#f9fafb",
        borderRadius: 8,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#98a2b3",
        boxShadow:
          "0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.1)",
        ...style,
      }}
      {...buttonProps}
      onMouseOver={({ currentTarget }) => {
        currentTarget.style.opacity = "50%";
      }}
      onMouseOut={({ currentTarget }) => {
        currentTarget.style.opacity = "100%";
      }}
    >
      {!!plan ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <H1
              style={{
                borderRadius: 8,
                fontWeight: "600",
                background:
                  type === "max"
                    ? "linear-gradient(to right, #fda29b, #ffd971, #6ce9a6, #84caff, #d6bbfb)"
                    : type === "pro"
                    ? "#ffd971"
                    : "#f9fafb",
                color: "#101010",
                fontStyle:
                  type === "max" || type === "pro" ? "italic" : "normal",
              }}
            >
              {type === "max"
                ? "Wuvu MAX"
                : type === "pro"
                ? "Wuvu Pro"
                : "Wuvu Free"}
            </H1>
            <H1 style={{ margin: 20, marginBottom: 0, fontSize: 64 }}>
              Free (Demo)
              {/* {!!plan.price ? `$${plan.price}` : "Free"} */}
            </H1>
            <div style={{ height: 120 }}>
              {credentials.subscription === type ? <P>(Current Plan)</P> : null}
            </div>
            <div style={{ textAlign: "left", height: 180 }}>
              <div style={{ display: "flex", marginBottom: 10 }}>
                <img
                  style={{
                    width: 16,
                    marginTop: 2,
                    marginRight: 10,
                  }}
                  src={GenerateFocusedFullIcon}
                />
                <H2>
                  {plan.details.clothes > 999999
                    ? "Unlimited Clothes"
                    : `${plan.details.clothes} Clothes`}
                </H2>
              </div>
              <div style={{ display: "flex", marginBottom: 10 }}>
                <img
                  style={{
                    width: 16,
                    marginTop: 2,
                    marginRight: 10,
                  }}
                  src={GenerateFocusedFullIcon}
                />
                <H2>
                  {plan.details.credits > 999999
                    ? "Unlimited Credits"
                    : `${plan.details.credits} 
                  Daily Credits`}
                </H2>
              </div>
              {!!plan.details.calendar ? (
                <div style={{ display: "flex", marginBottom: 10 }}>
                  <img
                    style={{
                      width: 16,
                      marginTop: 2,
                      marginRight: 10,
                    }}
                    src={GenerateFocusedFullIcon}
                  />
                  <H2>Calendar Exclusives</H2>
                </div>
              ) : null}
              {!!plan.details.shop ? (
                <div style={{ display: "flex", marginBottom: 10 }}>
                  <img
                    style={{
                      width: 16,
                      marginTop: 2,
                      marginRight: 10,
                    }}
                    src={GenerateFocusedFullIcon}
                  />
                  <H2>Shop Exclusives</H2>
                </div>
              ) : null}
            </div>
          </div>
          {credentials.subscription !== "free" &&
          credentials.subscription === type ? (
            <Button
              type="solid"
              style={{
                background: "#eb5757",
                color: "#ffffff",
              }}
              onClick={() => {
                checkoutSubscription(type, true);
              }}
            >
              {isLoading ? (
                <Loading color="white" />
              ) : (
                <P style={{ fontWeight: "600" }}>Cancel</P>
              )}
            </Button>
          ) : type === "free" ? null : (
            <Button
              type="solid"
              style={{
                color: "#ffd971",
              }}
              onClick={() => {
                checkoutSubscription(type, false);
              }}
            >
              {isLoading ? (
                <Loading color="gold" />
              ) : (
                <P style={{ fontWeight: "600" }}>Purchase!</P>
              )}
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default SubscriptionCard;
