import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPlusFilledIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <Path fill={props.color} d="M0 0h24v24H0z" />
    <Path
      fill={props.color}
      fillRule="evenodd"
      d="M13 9a1 1 0 1 0-2 0v2H9a1 1 0 1 0 0 2h2v2a1 1 0 1 0 2 0v-2h2a1 1 0 1 0 0-2h-2zM7.25 2.388C8.55 2.099 10.124 2 12 2s3.451.1 4.75.388c1.31.291 2.399.788 3.236 1.626s1.335 1.926 1.626 3.236C21.901 8.55 22 10.124 22 12s-.1 3.451-.388 4.75c-.291 1.31-.788 2.399-1.626 3.236s-1.926 1.335-3.236 1.626C15.45 21.901 13.876 22 12 22s-3.451-.1-4.75-.388c-1.31-.291-2.399-.788-3.236-1.626S2.679 18.06 2.388 16.75C2.099 15.45 2 13.876 2 12s.1-3.451.388-4.75c.291-1.31.788-2.399 1.626-3.236S5.94 2.679 7.25 2.388"
      clipRule="evenodd"
    />
  </Svg>
);
export default SvgPlusFilledIcon;
