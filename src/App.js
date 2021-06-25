import "bootstrap/dist/css/bootstrap.min.css";
import { Component } from "react";
import { Route, Switch, Link } from "react-router-dom";

import AuthService from "./services/auth.service";

import "./App.css";
import Home from "./components/Home";
import HomeMod from "./components/HomeMod";
import FormApproval from "./components/FormApproval";
import Login from "./components/Login";
import Loading from "./components/Loading";
import Dashboard from "./components/Dashboard";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: null,
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
        <div className="App-Container container align-items-center justify-content-center">
          <Switch>
            <Route
              exact
              path="/dashboard"
              component={() => <Dashboard />}
            ></Route>
            <Route path="/" component={() => <Login />} />
          </Switch>
        </div>
      );
    } else if (currentUser && currentUser.role.level) {
      return currentUser.role.level === 3 ? (
        <div className="">
          <Switch>
            <Route path="/" component={() => <HomeMod />} />
            {/* <Route exact path="/home" component={() => <Home />} /> */}
            <Route exact path="/form/:id" component={() => <FormApproval />} />
          </Switch>
        </div>
      ) : (
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
