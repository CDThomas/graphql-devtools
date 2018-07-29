import React, { Component } from "react";
import { render } from "react-dom";
import GraphiQL from "graphiql";
import { host, headers as configHeaders } from "./requestConfig";
import "graphiql/graphiql.css";

function graphQLFetcher(graphQLParams) {
  // TODO: make headers, host, path, and credentials configurable

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...configHeaders
  };

  return window
    .fetch(`${host}/graphql`, {
      method: "POST",
      headers,
      credentials: "same-origin",
      body: JSON.stringify(graphQLParams)
    })
    .then(response => response.json());
}

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
        <GraphiQL
          fetcher={graphQLFetcher}
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
            <GraphiQL.Button onClick={() => {}} title="title" label="Network" />
          </GraphiQL.Toolbar>
        </GraphiQL>
      </div>
    );
  }
}

render(<App />, document.getElementById("app"));
