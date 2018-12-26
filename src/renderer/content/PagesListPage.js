// @flow
import * as React from "react";
import { Redirect } from "react-router-dom";

import { welcomeUrl } from "common/urls";
import { queryPages } from "../queries";
import Query from "../Query";
import { Layout, NonIdealState, Timestamp } from "../components";

const pageSize = 50;

const PagesListPage = () => (
  <Layout title="Saved Pages">
    <Query runQuery={queryPages} variables={{ first: pageSize }}>
      {({ data, error, isLoading }) => {
        if (isLoading) return <div>loading...</div>;
        if (!data) return <div>{JSON.stringify(error)}</div>;
        if (data.pages.length == 0) {
          return <Redirect to={welcomeUrl} />;
        }
        return (
          <table className="table is-fullwidth">
            <thead>
              <tr>
                <th>Page</th>
                <th>First Recorded</th>
                <th>Recording Updated</th>
              </tr>
            </thead>
            <tbody>
              {data.pages.map(page => (
                <tr key={page.id}>
                  <td>
                    <a href={page.url}>{page.title}</a>
                  </td>
                  <td>
                    <Timestamp value={page.createdAt} />
                  </td>
                  <td>
                    <Timestamp value={page.updatedAt} format="relative" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      }}
    </Query>
  </Layout>
);

export default PagesListPage;
