"use es6";

const HR = ({ style = {} }) => {
  return (
    <hr
      style={{
        position: "relative",
        top: -2,
        padding: 0,
        margin: 0,
        height: 0,
        borderTopWidth: 0,
        ...style,
      }}
    />
  );
};

export default HR;
