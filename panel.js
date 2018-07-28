class App extends React.Component {
  render() {
    return React.createElement("h1", null, "Hello from React!");
  }
}

ReactDOM.render(React.createElement(App), document.getElementById("react-app"));
