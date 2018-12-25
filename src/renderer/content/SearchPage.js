// @flow
import * as React from "react";
import type { Location } from "react-router-dom";
import { parse as parseQuery } from "querystring";

import { fullTextSearch, type FullTextResult } from "../queries";
import Query from "../Query";
import { Layout, NonIdealState } from "../components";

import "./SearchPage.css";

const snippetHighlight = /\x02(.*)\x03/g;

const renderSnippet = (
  input: string,
  highlighter: string => React.Node,
): React.Node => {
  const parts = [];
  let i = 0;
  while (i < input.length) {
    snippetHighlight.lastIndex = i;
    const match = snippetHighlight.exec(input);
    if (!match) {
      parts.push(input.slice(i));
      break;
    } else {
      parts.push(input.substring(i, match.index).replace(/\t/g, "..."));
      parts.push(highlighter(match[1]));
      i = match.index + match[0].length;
    }
  }
  return React.createElement(React.Fragment, {}, ...parts);
};

type SearchResultProps = {
  result: FullTextResult,
};

const SearchResult = ({ result }: SearchResultProps) => (
  <div className="SearchPage__result">
    <h5 className="title is-5 is-marginless">
      <a href={result.url}>{result.title}</a>
    </h5>
    <p className="has-text-grey">{result.url}</p>
    <p className="content">{renderSnippet(result.snippet, s => <b>{s}</b>)}</p>
  </div>
);

type Props = {
  location: Location,
};

export default class SearchPage extends React.Component<Props> {
  render() {
    const query = this.searchQuery();
    return (
      <Layout title="Search Results">
        <p className="subtitle is-5">
          Results for: <strong>{query}</strong>
        </p>
        {query ? (
          <Query runQuery={fullTextSearch} variables={{ query, first: 50 }}>
            {({ data, error, isLoading }) => {
              if (isLoading) return <div>Loading...</div>;
              if (!data) return <div>{JSON.stringify(error)}</div>;
              if (!data.results || data.results.length === 0) {
                return (
                  <NonIdealState
                    title="No results"
                    description="None of the pages you have saved match your query."
                  />
                );
              }
              return (
                <div>
                  {data.results.map((result, i) => (
                    <SearchResult key={i} result={result} />
                  ))}
                </div>
              );
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
