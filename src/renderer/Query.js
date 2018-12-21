// @flow
import * as React from "react";

type ChildrenProps<Q, R> = {
  data: ?R,
  isLoading: boolean,
  error: any,
  fetchMore: ({
    variables: Q,
    updateQuery: (previous: R, next: R) => R,
  }) => void,
};

type Props<Q, R> = {
  runQuery: Q => Promise<R>,
  variables: Q,
  children: (ChildrenProps<Q, R>) => React.Node,
};

type State<R> = {
  data: ?R,
  isLoading: boolean,
  error: any,
};

export default class Query<Q, R> extends React.Component<
  Props<Q, R>,
  State<R>,
> {
  state: State<R> = { data: null, isLoading: true, error: undefined };

  componentDidMount() {
    this.props
      .runQuery(this.props.variables)
      .then(
        data => this.setState({ isLoading: false, error: undefined, data }),
        error => this.setState({ isLoading: false, data: null, error }),
      );
  }

  render() {
    const { data, isLoading, error } = this.state;
    return this.props.children({
      data,
      isLoading,
      error,
      fetchMore: () => {},
    });
  }
}
