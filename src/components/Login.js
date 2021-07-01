import React, { Component } from "react";

import AuthService from "../services/auth.service";
import FormResult from "./FormResult";
import { Link } from "react-router-dom";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      message: "",
      invalidLogin: false,
      clicked_login: false,
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value,
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value,
    });
  }

  handleLogin(e) {
    e.preventDefault();
    this.setState({ clicked_login: true });
    AuthService.login(this.state.username, this.state.password).then(
      () => {
        // this.props.history.push("/home");
        this.setState({ clicked_login: false });
        window.location.reload();
      },
      (error) => {
        this.setState({ clicked_login: false });
        this.setState({ invalidLogin: true });
      }
    );
  }

  hideModal() {
    this.setState({ invalidLogin: false });
  }

  render() {
    return (
      <div className="row justify-content-center mt-5">
        <div className="container-form ">
          <form
            className="card bg-light bg-gradient"
            onSubmit={this.handleLogin}
          >
            <div className="card-header">
              <div className="card-title">
                <h2 className="text-center">Approver Login</h2>
              </div>
            </div>
            <div className="card-body">
              <div className="mb-3 row">
                <label className="col-sm-4 col-form-label">Username:</label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    onChange={this.onChangeUsername}
                  />
                </div>
              </div>
              <div className="mb-3 row">
                <label className="col-sm-4 col-form-label">Password:</label>
                <div className="col-sm-8">
                  <input
                    type="password"
                    className="form-control"
                    onChange={this.onChangePassword}
                  />
                </div>
              </div>
            </div>
            {/* {this.state.invalidLogin ? "Invalid Login" : ""} */}
            <div className="card-footer text-end">
              {this.state.clicked_login ? (
                <button className="btn btn-primary" type="button" disabled>
                  <span
                    class="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Loading...
                </button>
              ) : (
                <button className="btn btn-outline-primary">Login</button>
              )}
            </div>
          </form>
          <FormResult
            show={this.state.invalidLogin}
            hideModal={this.hideModal}
          />
        </div>
      </div>
    );
  }
}

export default Login;
