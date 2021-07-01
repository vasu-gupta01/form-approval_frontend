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
        <div className="container align-items-center justify-content-center">
          <Switch>
            <Route path="/" component={() => <Login />} />
          </Switch>
        </div>
      );
    } else if (currentUser && currentUser.role.level === 4) {
      return (
        <div>
          <div className="container-fluid">
            <nav className="row navbar navbar-light bg-dark rounded shadow-lg">
              <div className="col-4">
                <p className="navbar-brand text-light mt-1">
                  Welcome, {AuthService.getCurrentUser().firstname}!
                </p>
              </div>
              <div className="col text-end">
                <Link className="btn btn-outline-light" to="/">
                  Home
                </Link>
                <Link to="/dashboard" className="btn btn-outline-warning ms-2">
                  Status Dashboard
                </Link>
                <Link to="/mod/users" className="btn btn-outline-info ms-2">
                  Manage Users
                </Link>
                <Link to="/mod/forms" className="btn btn-outline-info ms-2">
                  Manage Forms
                </Link>
                <button
                  className="btn btn-outline-danger ms-2"
                  onClick={() => {
                    AuthService.logout();
                    window.location.replace("/");
                  }}
                >
                  Logout
                </button>
              </div>
            </nav>
          </div>
          <Switch>
            <Route path="/" component={() => <HomeMod />} />
            <Route exact path="/form/:id" component={() => <FormApproval />} />
          </Switch>
          <div className="container align-items-center justify-content-center">
            <Switch>
              <Route
                exact
                path="/dashboard"
                component={() => <Dashboard />}
              ></Route>
            </Switch>
          </div>
        </div>
      );
    } else if (currentUser && currentUser.role.level === 0) {
      return (
        <div className="">
          <div className="container-fluid">
            <nav className="row navbar navbar-light bg-dark rounded shadow-lg">
              <div className="col-4">
                <p className="navbar-brand text-light mt-1">
                  Welcome, {AuthService.getCurrentUser().firstname}!
                </p>
              </div>
              <div className="col text-end">
                <Link to="/" className="btn btn-outline-warning ms-2">
                  Status Dashboard
                </Link>
                <button
                  className="btn btn-outline-danger ms-2"
                  onClick={() => {
                    AuthService.logout();
                    window.location.reload();
                  }}
                >
                  Logout
                </button>
              </div>
            </nav>
          </div>
          <div className="container align-items-center justify-content-center">
            <Switch>
              <Route exact path="/" component={() => <Dashboard />}></Route>
            </Switch>
          </div>
        </div>
      );
    } else if (currentUser && currentUser.role.level) {
      return (
        <div>
          <div className="container-fluid">
            <nav className="row navbar navbar-light bg-dark rounded shadow-lg">
              <div className="col-4">
                <p className="navbar-brand text-light mt-1">
                  Welcome, {AuthService.getCurrentUser().firstname}!
                </p>
              </div>
              <div className="col text-end">
                <Link className="btn btn-outline-light" to="/">
                  Home
                </Link>
                <Link to="/dashboard" className="btn btn-outline-warning ms-2">
                  Status Dashboard
                </Link>
                <button
                  className="btn btn-outline-danger ms-2"
                  onClick={() => {
                    AuthService.logout();
                    window.location.reload();
                  }}
                >
                  Logout
                </button>
              </div>
            </nav>
          </div>
          <Switch>
            <Route exact path="/" component={() => <Home />} />
            {/* <Route exact path="/home" component={() => <Home />} /> */}

            <Route exact path="/form/:id" component={() => <FormApproval />} />
          </Switch>
          <div className="container align-items-center justify-content-center">
            <Switch>
              <Route
                exact
                path="/dashboard"
                component={() => <Dashboard />}
              ></Route>
            </Switch>
          </div>
        </div>
      );
    } else {
      AuthService.logout();
    }
  }
}

export default App;
