// @flow
import * as React from "react";
import classnames from "classnames";

type TabProps = {
  active?: boolean,
  onClick?: MouseEvent => void,
  className?: string,
  children: React.Node,
};

const Tab = ({ active, onClick, className, children }: TabProps) => (
  <li className={classnames(className, { "is-active": active })}>
    <a onClick={onClick}>{children}</a>
  </li>
);

type Props = {
  className?: string,
  children: React.Node,
};

const TabBar = ({ className, children }: Props) => (
  <div
    className={classnames(className, "tabs is-toggle is-fullwidth is-small")}
  >
    <ul>{children}</ul>
  </div>
);

TabBar.Tab = Tab;

export default TabBar;
