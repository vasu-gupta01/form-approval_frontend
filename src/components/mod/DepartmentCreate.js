import React, { Component } from "react";

import UserService from "../../services/user.service";

class DepartmentCreate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      clicked_create: false,
      error: false,
      field_missing: false,
    };

    this.handleCreate = this.handleCreate.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {}

  handleChange(e, field) {
    let state = this.state;
    state[field] = e.target.value;

    this.setState(state);
  }

  handleCreate(e) {
    e.preventDefault();
    this.setState({ clicked_create: true });

    const nm = this.state.name;

    if (nm === "") {
      this.setState({ field_missing: true });
      this.setState({ clicked_create: false });
    } else {
      this.setState({ field_missing: false });
      UserService.createDepartment({
        name: nm,
      }).then(
        () => {
          this.setState({ clicked_create: false });
          window.location.replace("/mod/roles");
        },
        (error) => {
          this.setState({ clicked_create: false });
          this.setState({ error: true });
        }
      );
    }
  }

  render() {
    return (
      <div className="container-form mt-5">
        <form
          className="card bg-light bg-gradient"
          onSubmit={this.handleCreate}
        >
          <div className="card-header">
            <div className="card-title">
              <h2 className="text-center">Add Department</h2>
            </div>
          </div>
          <div className="card-body">
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Name:</label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  onChange={(e) => this.handleChange(e, "name")}
                />
              </div>
            </div>

            {this.state.error ? (
              <strong className="text-danger mt-2">
                Error submitting request. Check connection.
              </strong>
            ) : (
              ""
            )}
            {this.state.field_missing ? (
              <strong className="text-danger">Name field is required.</strong>
            ) : (
              ""
            )}
          </div>

          <div className="card-footer text-end">
            {this.state.clicked_create ? (
              <button className="btn btn-primary" type="button" disabled>
                <span
                  class="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                Loading...
              </button>
            ) : (
              <button className="btn btn-outline-primary">Create</button>
            )}
          </div>
        </form>
      </div>
    );
  }
}

export default DepartmentCreate;
