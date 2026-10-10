import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPlusEmptyIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <Path
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6M12 9v6"
    />
    <Path
      stroke={props.color}
      strokeWidth={2}
      d="M3 12c0-7.411 1.588-9 9-9s9 1.588 9 9-1.588 9-9 9c-7.411 0-9-1.588-9-9Z"
    />
  </Svg>
);
export default SvgPlusEmptyIcon;
