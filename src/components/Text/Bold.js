"use es6";

const Bold = ({ children = "[insert text]", style = {}, ...buttonProps }) => {
  return (
    <p
      style={{
        fontSize: 14,
        fontWeight: 500,
        margin: 0,
        marginBottom: 4,
        ...style,
      }}
      {...buttonProps}
    >
      {children}
    </p>
  );
};

export default Bold;
