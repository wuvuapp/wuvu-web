"use es6";

import { useUpdate, useEffect } from "react";

import GenerateFullIcon from "../../assets/icons/generatefull.svg";
import GenerateFocusedFullIcon from "../../assets/icons/generatefocusedfull.svg";
import GenerateWhiteFullIcon from "../../assets/icons/generatewhitefull.svg";
import GenerateGoldFullIcon from "../../assets/icons/generategoldfull.svg";

const Loading = ({ color = "white", width = 20 }) => {
  return (
    <img
      className="spinner"
      style={{
        width: width,
      }}
      src={
        color === "focused"
          ? GenerateFocusedFullIcon
          : color === "white"
          ? GenerateWhiteFullIcon
          : color === "gold"
          ? GenerateGoldFullIcon
          : GenerateFullIcon
      }
    />
  );
};

export default Loading;
