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
