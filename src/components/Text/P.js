"use es6";

const P = ({ children = "[insert text]", style = {}, ...buttonProps }) => {
  return (
    <p
      style={{ fontSize: 14, margin: 0, marginBottom: 4, ...style }}
      {...buttonProps}
    >
      {children}
    </p>
  );
};

export default P;
