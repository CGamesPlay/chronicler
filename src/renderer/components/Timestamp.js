// @flow
import * as React from "react";

const relativeString = (msec: number): string => {
  let secs = msec / 1000;
  let append = "";
  if (secs < 0) {
    append = " ago";
    secs *= -1;
  }
  let approx;
  if (secs < 60) {
    approx = "<1m";
  } else if (secs < 3600) {
    approx = `${Math.round(secs / 60)}m`;
  } else if (secs < 86400) {
    approx = `${Math.round(secs / 3600)}h`;
  } else if (secs < 604800) {
    approx = `${Math.round(secs / 86400)}d`;
  } else if (secs < 22896000) {
    approx = `${Math.round(secs / 604800)}w`;
  } else {
    approx = `${Math.round(secs / 22896000)}y`;
  }
  return approx + append;
};

type Props = {
  value: string,
  format: "date" | "relative",
};

const Timestamp = ({ value, format }: Props) => {
  const date = new Date(value);
  const formatted =
    format === "date"
      ? date.toLocaleDateString()
      : relativeString(date - new Date());
  return <span title={date.toLocaleString()}>{formatted}</span>;
};

Timestamp.defaultProps = {
  format: "date",
};

export default Timestamp;
