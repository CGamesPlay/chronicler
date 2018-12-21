// @flow
import * as React from "react";
import Helmet from "react-helmet";

type Props = {
  title: string,
  children?: React.Node,
};

const Layout = ({ title, children }: Props) => (
  <section className="section">
    <Helmet>
      <title>{title}</title>
    </Helmet>
    <div className="container">
      <h1 className="title">{title}</h1>
      {children}
    </div>
  </section>
);

export default Layout;
