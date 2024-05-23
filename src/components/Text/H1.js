"use es6";

import { useWindowDimensions } from "../../utils/CustomHooks";

const H1 = ({ children = "[insert text]", style = {}, ...buttonProps }) => {
  const dimensions = useWindowDimensions();

  return (
    <p
      style={{
        fontSize: dimensions.width > 500 ? 36 : 28,
        margin: 0,
        ...style,
      }}
      {...buttonProps}
    >
      {children}
    </p>
  );
};

export default H1;
