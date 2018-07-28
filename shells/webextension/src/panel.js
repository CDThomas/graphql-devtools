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
        <GraphiQL fetcher={graphQLFetcher} />
      </div>
    );
  }
}

render(<App />, document.getElementById("app"));
