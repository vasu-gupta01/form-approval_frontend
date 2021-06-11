import "bootstrap/dist/css/bootstrap.min.css";
import { Component } from "react";
import { Route, Switch } from "react-router-dom";

import AuthService from "./services/auth.service";

import "./App.css";
import Home from "./components/Home";
import FormApproval from "./components/FormApproval";
import Login from "./components/Login";
import Loading from "./components/Loading";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
      });
    }
  }

  render() {
    const { currentUser } = this.state;

    if (!currentUser) {
      return (
        <div className="App-Container container d-flex align-items-center justify-content-center">
          <Login />
        </div>
      );
    } else {
      return (
        <div className="">
          <Switch>
            <Route exact path="/" component={() => <Home />} />
            {/* <Route exact path="/home" component={() => <Home />} /> */}
            <Route exact path="/form/:id" component={() => <FormApproval />} />
          </Switch>
        </div>
      );
    }
  }
}

export default App;
