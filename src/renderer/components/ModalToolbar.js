// @flow
import * as React from "react";

import "./ModalToolbar.css";

type Props = {
  onHide?: () => void,
  children: React.Node,
};

const ModalToolbar = ({ onHide, children }: Props) => {
  return (
    <div className="ModalToolbar">
      <div className="columns is-vcentered">
        {children}
        <div className="column is-narrow">
          <button className="delete" onClick={onHide} />
        </div>
      </div>
    </div>
  );
};

export default ModalToolbar;
