"use es6";

import { useWindowDimensions } from "../../utils/CustomHooks";

const H2 = ({ children = "[insert text]", style = {}, ...buttonProps }) => {
  const dimensions = useWindowDimensions();

  return (
    <p
      style={{
        fontSize: dimensions.width > 500 ? 24 : 20,
        margin: 0,
        ...style,
      }}
      {...buttonProps}
    >
      {children}
    </p>
  );
};

export default H2;
