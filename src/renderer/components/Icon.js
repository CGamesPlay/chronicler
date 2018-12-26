// @flow
import * as React from "react";
import classnames from "classnames";

type Props = {
  size: "xs" | "s" | "m" | "l",
  icon: string,
  label?: string,
  className?: string,
};

const Icon = ({ size, icon, label, className }: Props) => {
  const style = label ? { marginRight: 0 } : undefined;
  const iconEl = (
    <span
      className={classnames("icon", className, {
        "is-small": size === "xs",
        "is-medium": size === "m",
        "is-large": size === "l",
      })}
      style={style}
    >
      <i className={classnames("fas", "fa-" + icon)} />
    </span>
  );
  if (label) {
    return (
      <>
        {iconEl}
        {label}
      </>
    );
  } else {
    return iconEl;
  }
};

Icon.defaultProps = {
  size: "s",
};

export default Icon;
