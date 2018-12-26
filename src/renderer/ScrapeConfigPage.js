// @flow
import * as React from "react";
import Helmet from "react-helmet";
import { Formik, Form, Field } from "formik";

import type { ScrapeConfig } from "common/events";
import { Icon } from "./components";

const isDevelopment = process.env.NODE_ENV !== "production";

export default class ScrapeConfigPage extends React.Component<{}> {
  handleSubmit = (values: any) => {
    const config = { ...values, rootUrls: values.rootUrls.split("\n") };
    const chrome = window.opener.chrome;
    chrome.startScrape(config);
  };

  testXpath(xpath: string) {
    const chrome = window.opener.chrome;
    chrome.executeJavaScriptInActiveTab(
      `(function() {
        const snap = document.evaluate(
          ${JSON.stringify(xpath)},
          document,
          null,
          XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        );
        const result = [];
        for (let i = 0; i < snap.snapshotLength; i++) {
          result.push(snap.snapshotItem(i));
        }
        let pass = 0;
        const blink = () => {
          result.forEach(el => {
            if (pass % 2 === 0) {
              el.style.outline = 'solid 2px hsl(171, 100%, 41%)';
            } else {
              el.style.outline = '';
            }
          });
          pass += 1;
          if (pass < 6) setTimeout(blink, 500);
        };
        blink();
      }())`,
    );
  }

  render() {
    const chrome = window.opener.chrome;
    const currentUrl = chrome.activeTab.url;
    const rootUrl = currentUrl.slice(0, currentUrl.lastIndexOf("/") + 1);
    const initialValues = {
      firstPage: currentUrl,
      rootUrls: rootUrl,
      linkXpath: "//a",
      ppmLimit: 30,
      dryRun: false,
    };
    return (
      <Formik
        initialValues={initialValues}
        onSubmit={this.handleSubmit}
        render={({ values }) => (
          <Form>
            <Helmet>
              <title>Scrape Site</title>
              <body className="has-background-light" />
            </Helmet>
            <section className="section">
              <div className="container">
                <h3 className="title is-3">Scrape Site</h3>
                <div className="content">
                  <p>
                    This dialog allows you to configure Chronicler to
                    automatically download an entire web site. Chronicler will
                    perform these steps:
                  </p>
                  <ol>
                    <li>Start a new recording session.</li>
                    <li>
                      Find all of the links on the current page that match the
                      settings configured here.
                    </li>
                    <li>Click on each one and wait for it to load.</li>
                    <li>Repeat until the entire site has been visited.</li>
                  </ol>
                </div>
                <div className="field">
                  <button className="button is-primary" type="submit">
                    Start
                  </button>
                </div>
                <label className="label">First page</label>
                <div className="columns">
                  <div className="column is-three-fifths">
                    <Field className="input" name="firstPage" />
                  </div>
                  <div className="column is-size-7 content">
                    <p>Chronicler will start from this URL.</p>
                  </div>
                </div>
                <label className="label">URL prefixes</label>
                <div className="columns">
                  <div className="column is-three-fifths">
                    <Field
                      className="textarea"
                      name="rootUrls"
                      component="textarea"
                      rows="3"
                    />
                  </div>
                  <div className="column content is-size-7">
                    <p>
                      Only links that point to URLs that start with one of these
                      will be followed. Additionally, if a followed link
                      redirects to a page that doesn't start with one of these
                      prefixes, Chronicler will not follow any of the links on
                      that page. Put a single URL prefix on each line.
                    </p>
                    <p>
                      This setting only affects top-level pages. Images and
                      other assets are always loaded regardless of the URL they
                      are on.
                    </p>
                  </div>
                </div>
                <label className="label">Link XPath</label>
                <div className="columns">
                  <div className="column is-three-fifths">
                    <div className="field">
                      <div className="control has-icons-right">
                        <Field
                          className="input"
                          name="linkXpath"
                          style={{ fontFamily: "monospace" }}
                        />
                        <Icon size="xs" className="is-right" icon="check" />
                      </div>
                    </div>
                    <div className="field">
                      <button
                        className="button"
                        type="button"
                        onClick={() => this.testXpath(values.linkXpath)}
                      >
                        Test on current page
                      </button>
                    </div>
                  </div>
                  <div className="column is-size-7 content">
                    <p>
                      Chronicler will only click on links that match this XPath
                      selector and point to a URL that matches one of the
                      prefixes. Generally, the default value is fine, but you
                      might want to customize this to speed up a scrape. Some
                      examples:
                    </p>
                    <ul>
                      <li>
                        <code>{`//a`}</code> - select all links
                      </li>
                      <li>
                        <code>{`//*[@id='navigation']//a`}</code> - select all
                        links inside of the element with{" "}
                        <code>id="navigation"</code>
                      </li>
                    </ul>
                    <p>
                      The "Test on current page" button will cause all matching
                      links on the active page to flash briefly.
                    </p>
                  </div>
                </div>
                <label className="label">Rate limiting</label>
                <div className="columns">
                  <div className="column is-three-fifths">
                    <div className="field has-addons">
                      <div className="control">
                        <Field
                          className="input"
                          name="ppmLimit"
                          type="number"
                          min="1"
                          max="120"
                        />
                      </div>
                      <div className="control">
                        <a className="button is-static">pages / minute</a>
                      </div>
                    </div>
                  </div>
                  <div className="column is-size-7 content">
                    <p>
                      Downloading pages too quickly can lead to the remote site
                      blocking your IP address. 30 pages per minute is a good
                      default.
                    </p>
                  </div>
                </div>
                {isDevelopment && (
                  <>
                    <label className="label">Debugging Settings</label>
                    <div className="columns">
                      <div className="column is-three-fifths">
                        <label className="checkbox">
                          <Field name="dryRun" type="checkbox" />
                          {" Dry run"}
                        </label>
                      </div>
                      <div className="column is-size-7 content">
                        <p>
                          During a dry run, the network adapter will be set to
                          replay mode instead of record mode. This is useful for
                          testing that the crawler is working properly.
                        </p>
                      </div>
                    </div>
                  </>
                )}
                <div className="field">
                  <button className="button is-primary" type="submit">
                    Start
                  </button>
                </div>
              </div>
            </section>
          </Form>
        )}
      />
    );
  }
}
