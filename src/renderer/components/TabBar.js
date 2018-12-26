// @flow
import * as React from "react";
import classnames from "classnames";

import "./TabBar.css";

type TabProps = {
  active?: boolean,
  onClose?: MouseEvent => void,
  onClick?: MouseEvent => void,
  showClose: boolean,
  className?: string,
  children: React.Node,
};

const Tab = ({
  active,
  onClose,
  onClick,
  showClose,
  className,
  children,
}: TabProps) => (
  <li className={classnames(className, { "is-active": active })}>
    <a onClick={onClick}>
      {showClose && (
        <span
          className="delete is-small"
          onClick={e => {
            e.stopPropagation();
            if (onClose) onClose(e);
          }}
        />
      )}
      <span>{children}</span>
    </a>
  </li>
);

Tab.defaultProps = {
  showClose: true,
};

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
