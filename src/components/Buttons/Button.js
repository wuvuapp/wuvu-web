"use es6";

const Button = ({
  type = null,
  children = "[insert text]",
  style = {},
  ...buttonProps
}) => {
  if (type === "solid") {
    style = {
      backgroundColor: style.backgroundColor || "#000000",
      borderRadius: 8,
      color: "#ffffff",
      paddingRight: 20,
      paddingLeft: 20,
      paddingTop: 10,
      paddingBottom: 8,
      width: style.width,
      textAlign: "center",
      alignContent: "center",
      fontWeight: "600",
      margin: style.margin,
      ...style,
    };
  }

  return (
    <div
      style={{ cursor: "pointer", ...style }}
      {...buttonProps}
      onMouseOver={({ currentTarget }) => {
        currentTarget.style.opacity = "50%";
      }}
      onMouseOut={({ currentTarget }) => {
        currentTarget.style.opacity = "100%";
      }}
    >
      <div>{children}</div>
    </div>
  );
};

export default Button;
