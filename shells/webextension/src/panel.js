import React, { Component } from "react";
import { render } from "react-dom";
import GraphiQL from "graphiql";
import "graphiql/graphiql.css";

class App extends Component {
  state = {
    requests: []
  };

  componentDidMount() {
    // TODO: Is there a way to clean up this listener later? The Chrome docs don't mention it.
    // TODO: Don't use chrome.devtools directly here
    chrome.devtools.network.onRequestFinished.addListener(request => {
      if (request.request.url.includes("/graphql")) {
        this.setState(prevState => ({
          requests: [...prevState.requests, request]
        }));
      }
    });
  }

  render() {
    return (
      <div className="wrapper">
        {this.state.requests.length === 0 ? (
          <p>Waiting for a GraphQL request...</p>
        ) : (
          <GraphiQL
            fetcher={this.graphQLFetcher}
            ref={ref => {
              this.graphiql = ref;
            }}
          >
            <GraphiQL.Toolbar>
              <GraphiQL.Button
                onClick={(...args) => {
                  // XXX Check that the ref has been bound and forward the call to the instance of GraphiQL
                  this.graphiql && this.graphiql.handlePrettifyQuery(...args);
                }}
                title="Prettify Query (Shift-Ctrl-P)"
                label="Prettify"
              />
              <GraphiQL.Button
                onClick={(...args) => {
                  // XXX Check that the ref has been bound and forward the call to the instance of GraphiQL
                  this.graphiql && this.graphiql.handleToggleHistory(...args);
                }}
                title="Show History"
                label="History"
              />
            </GraphiQL.Toolbar>
          </GraphiQL>
        )}
      </div>
    );
  }

  graphQLFetcher = graphQLParams => {
    // TODO: Handle "Authorization" header. Right now this only works with cookies
    // TODO: Look into handling CORS requests. This might work with a content script
    if (!this.state.requests.length) {
      return;
    }

    let { url, headers } = this.state.requests[0].request;
    headers = headers
      .filter(
        ({ name }) =>
          // Whitelisted headers
          ["accept", "content-type"].includes(name.toLowerCase()) ||
          // Custom headers
          /^x-/.test(name.toLowerCase())
      )
      .reduce((acc, { name, value }) => ({ ...acc, [name]: value }), {});

    return window
      .fetch(url, {
        method: "POST",
        headers,
        credentials: "same-origin",
        body: JSON.stringify(graphQLParams)
      })
      .then(response => response.json());
  };
}

render(<App />, document.getElementById("app"));
