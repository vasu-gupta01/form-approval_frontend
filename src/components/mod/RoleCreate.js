import React, { Component } from "react";

import UserService from "../../services/user.service";

class RoleCreate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      type: "",
      description: "",
      department: "",
      level: "",
      clicked_create: false,
      error: false,
      field_missing: false,
      departments: [],
    };

    this.handleCreate = this.handleCreate.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    UserService.getDepartments().then((res) => {
      if (res.data) {
        this.setState({ departments: res.data });
      }
    });
  }

  handleChange(e, field) {
    let state = this.state;
    state[field] = e.target.value;

    this.setState(state);
  }

  handleCreate(e) {
    e.preventDefault();
    this.setState({ clicked_create: true });

    const type = this.state.type;
    const desc = this.state.description;
    const dep = this.state.department;
    const lvl = this.state.level;

    if (type === "" && lvl === "") {
      this.setState({ field_missing: true });
      this.setState({ clicked_create: false });
    } else {
      this.setState({ field_missing: false });
      UserService.createRole({
        name: type,
        description: desc,
        department: dep,
        level: lvl,
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
    const { departments } = this.state;
    return (
      <div className="container-form mt-5">
        <form
          className="card bg-light bg-gradient"
          onSubmit={this.handleCreate}
        >
          <div className="card-header">
            <div className="card-title">
              <h2 className="text-center">Create new role</h2>
            </div>
          </div>
          <div className="card-body">
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Type:</label>
              <div className="col-sm-8">
                <input
                  placeholder="e.g. HOD"
                  type="text"
                  className="form-control"
                  onChange={(e) => this.handleChange(e, "type")}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Description:</label>
              <div className="col-sm-8">
                <input
                  placeholder="e.g. Head of IT"
                  type="text"
                  className="form-control"
                  onChange={(e) => this.handleChange(e, "description")}
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Department:</label>
              <div className="col-sm-8">
                <select
                  className="form-select"
                  onChange={(e) => this.handleChange(e, "department")}
                >
                  <option selected value="">
                    -- department --
                  </option>
                  {departments.map((dep) => {
                    return <option value={dep._id}>{dep.name}</option>;
                  })}
                </select>
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Access level:</label>
              <div className="col-sm-8">
                <select
                  className="form-select"
                  onChange={(e) => this.handleChange(e, "level")}
                >
                  <option selected value="">
                    -- access level --
                  </option>
                  <option value="0">level 0 -- only view</option>
                  <option value="1">
                    level 1 -- view/approve department only
                  </option>
                  <option value="2">level 2 -- view/approve all</option>
                  <option value="3">level 3 -- view/approve all</option>
                </select>
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
              <strong className="text-danger">
                Type and Access level fields are required.
              </strong>
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

export default RoleCreate;
