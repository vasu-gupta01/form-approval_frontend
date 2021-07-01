import React, { Component } from "react";

import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import FormResult from "./FormResult";

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      message: "",
      role: "",
      firstname: "",
      lastname: "",
      email: "",
      invalidLogin: false,
      roles: [],
    };

    this.handleSignup = this.handleSignup.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    //get roles
    UserService.getRoles().then((res) => {
      if (res.data) {
        this.setState({ roles: res.data });
      }
    });
  }

  handleChange(e, field) {
    let state = this.state;
    state[field] = e.target.value;

    this.setState(state);
  }

  handleSignup(e) {
    e.preventDefault();

    AuthService.register(
      this.state.username,
      this.state.firstname,
      this.state.lastname,
      this.state.role,
      this.state.password,
      this.state.email
    ).then(
      () => {
        window.location.replace("users");
      },
      (error) => {
        this.setState({ invalidLogin: true });
      }
    );
  }

  hideModal() {
    this.setState({ invalidLogin: false });
  }

  render() {
    const { roles } = this.state;
    return (
      <div className="container-form mt-5">
        <form
          className="card bg-light bg-gradient"
          onSubmit={this.handleSignup}
        >
          <div className="card-header">
            <div className="card-title">
              <h2 className="text-center">Create new user</h2>
            </div>
          </div>
          <div className="card-body">
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Username:</label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  onChange={(e) => this.handleChange(e, "username")}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Password:</label>
              <div className="col-sm-8">
                <input
                  type="password"
                  className="form-control"
                  onChange={(e) => this.handleChange(e, "password")}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Firstname:</label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  onChange={(e) => this.handleChange(e, "firstname")}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Lastname:</label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  onChange={(e) => this.handleChange(e, "lastname")}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Roles:</label>
              <div className="col-sm-8">
                <select
                  className="form-select"
                  onChange={(e) => this.handleChange(e, "role")}
                >
                  <option selected value="">
                    -- role --
                  </option>
                  {roles.map((role) => {
                    return (
                      <option value={role._id}>
                        {role.name} - {role.description}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Email:</label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  onChange={(e) => this.handleChange(e, "email")}
                />
              </div>
            </div>
          </div>
          {/* {this.state.invalidLogin ? "Invalid Login" : ""} */}
          <div className="card-footer text-end">
            <button className="btn btn-outline-primary">Create</button>
          </div>
        </form>
        <FormResult show={this.state.invalidLogin} hideModal={this.hideModal} />
      </div>
    );
  }
}

export default Signup;
