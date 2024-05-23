"use es6";

const DropdownButton = ({
  type = null,
  children = "[insert text]",
  style = {},
  options = {},
  ...buttonProps
}) => {
  style = {
    backgroundColor: style.backgroundColor || "#000000",
    borderRadius: 8,
    color: "#ffffff",
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 10,
    paddingBottom: 10,
    width: style.width,
    textAlign: "center",
    maxHeight: 20,
    alignContent: "center",
    fontWeight: 600,
    margin: style.margin,
    ...style,
  };
  return (
    <div class="dropdown">
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
        {children}
      </div>
      <div class="dropdown-content">
        {Object.keys(options).map((option, index) => (
          <a key={index} href={options[option]} target="_blank">
            {option}
          </a>
        ))}
      </div>
    </div>
  );
};

export default DropdownButton;
