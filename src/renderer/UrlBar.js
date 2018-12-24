// @flow
import * as React from "react";
import classnames from "classnames";
import { URL } from "url";

import { contentRoot, contentUrl, searchUrl } from "common/urls";
import { parseUrl } from "./utils";

const displayedUrl = (url: string): string => {
  if (!url.startsWith(contentRoot)) return url;
  let parsed;
  try {
    parsed = new URL(`http://x${url.slice(contentRoot.length)}`);
  } catch (_) {
    return "";
  }
  if (parsed.pathname === searchUrl()) {
    return decodeURIComponent(parsed.searchParams.get("q") || "");
  }
  return "";
};

type Props = {
  className?: string,
  url: string,
  onChangeUrl?: string => void,
};

type State = {
  isEditing: boolean,
};

export default class UrlBar extends React.PureComponent<Props, State> {
  state = { isEditing: false };
  urlInput: ?HTMLInputElement;

  componentDidMount() {
    const inputEl = this.urlInput;
    if (!inputEl) return;
    inputEl.value = displayedUrl(this.props.url);
  }

  componentDidUpdate(prevProps: Props) {
    if (!this.state.isEditing) {
      const inputEl = this.urlInput;
      if (!inputEl) return;
      inputEl.value = displayedUrl(this.props.url);
    }
  }

  handleUrlSubmit = (event: Event) => {
    event.preventDefault();
    const inputEl = this.urlInput;
    if (inputEl) {
      const typedUrl = inputEl.value;
      let parsedUrl;
      try {
        parsedUrl = parseUrl(typedUrl).toString();
      } catch (_) {
        parsedUrl = contentUrl(searchUrl(typedUrl));
      }
      if (this.props.onChangeUrl) {
        this.props.onChangeUrl(parsedUrl);
      }
      this.setState({ isEditing: false });
    }
  };

  handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Escape" || event.key === "Esc") {
      event.preventDefault();
      this.setState({ isEditing: false });
      const inputEl = this.urlInput;
      if (inputEl) {
        inputEl.value = displayedUrl(this.props.url);
      }
    } else {
      this.setState({ isEditing: true });
    }
  };

  handleClick = (event: Event) => {
    const inputEl = this.urlInput;
    if (!inputEl) return;
    event.preventDefault();
    inputEl.select();
  };

  handleBlur = (event: Event) => {
    const inputEl = this.urlInput;
    if (!inputEl) return;
    event.preventDefault();
    inputEl.setSelectionRange(0, 0);
  };

  render() {
    return (
      <div className={this.props.className}>
        <form onSubmit={this.handleUrlSubmit}>
          <input
            ref={e => (this.urlInput = e)}
            className={classnames("input", {
              "is-primary": this.state.isEditing,
            })}
            onKeyDown={this.handleKeyPress}
            onClick={this.handleClick}
            onBlur={this.handleBlur}
          />
        </form>
      </div>
    );
  }
}
