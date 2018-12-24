// @flow
import * as React from "react";

import "./ModalToolbar.css";

type Props = {
  onHide?: () => void,
  children: React.Node,
};

const ModalToolbar = ({ onHide, children }: Props) => {
  return (
    <div className="ModalToolbar level">
      <div className="level-left">{children}</div>
      <div className="level-right">
        <button className="delete" onClick={onHide} />
      </div>
    </div>
  );
};

export default ModalToolbar;
