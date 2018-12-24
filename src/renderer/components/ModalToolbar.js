// @flow
import * as React from "react";

import "./ModalToolbar.css";

type Props = {
  showCloseButton: boolean,
  onHide?: () => void,
  children: React.Node,
};

const ModalToolbar = ({ showCloseButton, onHide, children }: Props) => {
  return (
    <div className="ModalToolbar">
      <div className="columns is-vcentered">
        {children}
        {showCloseButton && (
          <div className="column is-narrow">
            <button className="delete" onClick={onHide} />
          </div>
        )}
      </div>
    </div>
  );
};

ModalToolbar.defaultProps = {
  showCloseButton: true,
};

export default ModalToolbar;
