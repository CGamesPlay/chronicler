// @flow
import * as React from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

type Props = {
  value: string,
  format: "date" | "relative",
};

const Timestamp = ({ value, format }: Props) => {
  const date = new Date(value);
  const formatted =
    format === "date" ? date.toLocaleDateString() : timeAgo.format(date);
  return <span title={date.toLocaleString()}>{formatted}</span>;
};

Timestamp.defaultProps = {
  format: "date",
};

export default Timestamp;
