// @flow
import * as React from "react";
import type { Location } from "react-router-dom";
import { parse as parseQuery } from "querystring";

import { fullTextSearch, type FullTextResult } from "../queries";
import Query from "../Query";
import { Layout, NonIdealState } from "../components";

type SearchResultsProps = {
  query: string,
  results: Array<FullTextResult>,
};

const SearchResults = ({ query, results }: SearchResultsProps) => {
  if (results.length === 0) {
    return (
      <NonIdealState
        title="No results"
        description="None of the pages you have saved match your query."
      />
    );
  }
  return (
    <div>
      {results.map((result, i) => (
        <div key={i}>
          <h5 className="title is-5 is-marginless">
            <a href={result.url}>{result.title}</a>
          </h5>
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: result.snippet }}
          />
        </div>
      ))}
    </div>
  );
};

type Props = {
  location: Location,
};

export default class SearchPage extends React.Component<Props> {
  render() {
    const query = this.searchQuery();
    return (
      <Layout title="Search Results">
        {query ? (
          <Query runQuery={fullTextSearch} variables={{ query, first: 50 }}>
            {({ data, error, isLoading }) => {
              if (isLoading) return <div>Loading...</div>;
              if (!data) return <div>{JSON.stringify(error)}</div>;
              return <SearchResults query={query} results={data.results} />;
            }}
          </Query>
        ) : (
          <NonIdealState
            title="What are you looking for?"
            description="Use the address bar above to search through all of your recorded pages."
          />
        )}
      </Layout>
    );
  }

  searchQuery(): ?string {
    return parseQuery(this.props.location.search.slice(1))["q"];
  }
}
