// @flow
import * as React from "react";

type Props = {
  title: React.Node,
  description?: React.Node,
  action?: React.Node,
};

const NonIdealState = ({ title, description, action }: Props) => (
  <div className="notification has-text-centered">
    <h2 className="title is-5">{title}</h2>
    {description ? <p>{description}</p> : null}
  </div>
);

export default NonIdealState;
