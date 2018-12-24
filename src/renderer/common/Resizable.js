// @flow
import * as React from "react";

type Props = {
  onResize?: (width: number, height: number) => void,
  children: React.Node,
};

type State = {
  width: number,
  height: number,
};

export default class Resizable extends React.Component<Props, State> {
  state = { width: 0, height: 0 };

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  render() {
    return React.Children.only(this.props.children);
  }

  handleResize = (event: Event) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    if (width !== this.state.width || height !== this.state.height) {
      this.setState({ width, height });
      if (this.props.onResize) {
        this.props.onResize(width, height);
      }
    }
  };
}
