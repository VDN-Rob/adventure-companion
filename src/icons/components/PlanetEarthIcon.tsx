import * as React from "react";
import Svg, { G, Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPlanetEarthIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 55.818 55.818"
    {...props}
  >
    <G data-name="Group 6">
      <Path
        fill={props.color}
        d="M36.592 5.188s-4.5.25-5 6.25a17.9 17.9 0 0 0 2.5 10.5s2.193-1.558-.028 5.971 7.278 14.529 10.778 6.279-.5-11.783 2-12.641a34 34 0 0 0 5.382-2.6l-3.229-6.081-5.21-5.421-7.43-4.027Z"
        data-name="Path 19"
      />
      <Path
        fill={props.color}
        d="M6.417 42.383s2.675-14.195 6.425-10.695.25 5.5 2.5 9 5.25 1.5 5.5 5.5.755 6.979 2.618 7.241-13.441-3.047-17.043-11.046"
        data-name="Path 20"
      />
      <Path
        fill="none"
        stroke={props.color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={4}
        d="M53.818 27.909A25.909 25.909 0 1 1 27.908 2a25.91 25.91 0 0 1 25.91 25.909"
        data-name="Path 21"
      />
      <Path
        fill={props.color}
        d="M27.174 22.017a6.078 6.078 0 1 1-6.078-6.079 6.08 6.08 0 0 1 6.078 6.079"
        data-name="Path 22"
      />
    </G>
  </Svg>
);
export default SvgPlanetEarthIcon;
