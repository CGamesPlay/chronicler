// @flow
import * as React from "react";

import { queryPages } from "../queries";
import Query from "../Query";
import { Layout, NonIdealState } from "./components";

const pageSize = 50;

const PagesListPage = () => (
  <Layout title="Saved Pages">
    <Query runQuery={queryPages} variables={{ first: pageSize }}>
      {({ data, error, isLoading }) => {
        if (isLoading) return <div>loading...</div>;
        if (!data) return <div>{error}</div>;
        if (data.pages.length == 0) {
          return (
            <NonIdealState
              title="No pages saved"
              description="There are no pages currently saved for offline viewing. After you record some pages, they will appear here."
            />
          );
        }
        return (
          <table className="table is-fullwidth">
            <thead>
              <tr>
                <th>Page</th>
              </tr>
            </thead>
            <tbody>
              {data.pages.map(page => (
                <tr key={page.id}>
                  <td>
                    <a href={page.url}>{page.title}</a>
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
