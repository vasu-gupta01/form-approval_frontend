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
      departments: {},
      new_departments: {},
      counter: 0,
    };

    this.handleCreate = this.handleCreate.bind(this);
    this.handleNewChange = this.handleNewChange.bind(this);
    this.handleUpdatedChange = this.handleUpdatedChange.bind(this);

    this.handleDelete = this.handleDelete.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
  }

  componentDidMount() {
    UserService.getDepartments().then((resp) => {
      if (resp.data) {
        let deps = {};
        resp.data.map((d) => {
          deps[d._id] = d;
        });
        this.setState({ departments: deps });
      }
    });
  }

  handleNewChange(e, field) {
    let deps = this.state.new_departments;
    deps[field].name = e.target.value;

    this.setState({ new_departments: deps });
  }

  handleUpdatedChange(e, field) {
    let deps = this.state.departments;
    deps[field].name = e.target.value;

    this.setState({ departments: deps });
  }

  handleCreate(e) {
    e.preventDefault();
    this.setState({ clicked_create: true });

    const nm = this.state.name;

    let new_dep_data = [];
    let missing_err = false;
    const new_departs = this.state.new_departments;
    Object.keys(new_departs).map((d) => {
      if (new_departs[d].name === "") {
        missing_err = true;
      } else {
        new_dep_data.push({ name: new_departs[d].name });
      }
    });

    let update_dep_data = [];
    const update_departs = this.state.departments;
    Object.keys(update_departs).map((d) => {
      if (update_departs[d].name === "") {
        missing_err = true;
      } else {
        update_dep_data.push({ id: d, name: update_departs[d].name });
      }
    });

    if (missing_err) {
      this.setState({ field_missing: true });
      this.setState({ clicked_create: false });
    } else {
      this.setState({ field_missing: false });
      console.log(update_dep_data);
      console.log(new_dep_data);
      UserService.createDepartment({
        data: new_dep_data,
      }).then(
        () => {
          if (update_dep_data.length === 0) {
            this.setState({ clicked_create: false });
            window.location.replace("/mod/roles");
          } else {
            UserService.updateDepartment({
              data: update_dep_data,
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
        },
        (error) => {
          this.setState({ clicked_create: false });
          this.setState({ error: true });
        }
      );
    }
  }

  handleDelete(e, id) {
    e.preventDefault();
    let new_deps = this.state.new_departments;

    delete new_deps[id];

    this.setState({ new_departments: new_deps });
  }

  handleAdd(e) {
    e.preventDefault();

    let new_deps = this.state.new_departments;
    const count = this.state.counter;

    new_deps[count] = {
      name: "",
    };

    console.log(new_deps);

    this.setState({ new_departments: new_deps });
    this.setState({ counter: count + 1 });
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
              <h2 className="text-center">Manage Departments</h2>
            </div>
          </div>
          <div className="card-body text-center align-items-center mb-2">
            {Object.keys(this.state.departments).map((dep) => {
              return (
                <div
                  key={"div_" + dep}
                  className="row m-1 form-text text-center align-items-center"
                >
                  <div
                    key={"div2_" + dep}
                    className="form-floating col-5 mb-1 ps-1"
                  >
                    <input
                      key={"input_" + dep}
                      className="form-control"
                      type="text"
                      value={this.state.departments[dep].name}
                      onChange={(e) => this.handleUpdatedChange(e, dep)}
                      placeholder="Field Name"
                      id={"inputFieldName" + dep}
                    />
                    <label
                      key={"label_" + dep}
                      htmlFor={"inputFieldName" + dep}
                    >
                      Name
                    </label>
                  </div>
                </div>
              );
            })}

            {Object.keys(this.state.new_departments).map((dep) => {
              return (
                <div
                  key={"div_" + dep}
                  className="row m-1 form-text text-center align-items-center"
                >
                  <div
                    key={"div2_" + dep}
                    className="form-floating col-5 mb-1 ps-1"
                  >
                    <input
                      key={"input_" + dep}
                      className="form-control"
                      type="text"
                      value={this.state.new_departments[dep].name}
                      onChange={(e) => this.handleNewChange(e, dep)}
                      placeholder="Field Name"
                      id={"inputFieldName" + dep}
                    />
                    <label
                      key={"label_" + dep}
                      htmlFor={"inputFieldName" + dep}
                    >
                      Name
                    </label>
                  </div>
                  <div key={"div3_" + dep} className="col-2">
                    <button
                      key={"button_" + dep}
                      className="btn btn-outline-danger btn-sm"
                      onClick={(e) => this.handleDelete(e, dep)}
                    >
                      x
                    </button>
                  </div>
                </div>
              );
            })}
            <div className="mb-3 row text-center">
              <div className="col-12">
                <button
                  className="btn btn-outline-success btn-sm"
                  onClick={this.handleAdd}
                >
                  + Add Department
                </button>
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
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                Loading...
              </button>
            ) : (
              <button className="btn btn-outline-primary">Update</button>
            )}
          </div>
        </form>
      </div>
    );
  }
}

export default DepartmentCreate;
