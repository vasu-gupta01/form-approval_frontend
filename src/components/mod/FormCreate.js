import React, { Component, useEffect, useState } from "react";

import UserService from "../../services/user.service";

class FormCreate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      clicked_create: false,
      error: false,
      field_missing: false,
      fields: {},
      fieldTypes: [],
      final_approvers: {},
      list_of_approvers: [],
      counter: 0,
      level_one: 1,
      level_two: 2,
      level_three: 3,
    };

    this.handleCreate = this.handleCreate.bind(this);

    this.handleFieldTypeChange = this.handleFieldTypeChange.bind(this);
    this.handleFieldNameChange = this.handleFieldNameChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleAddFinalApprover = this.handleAddFinalApprover.bind(this);
  }

  componentDidMount() {
    UserService.getFieldTypes().then((res) => {
      if (res.data) {
        console.log(res.data);
        this.setState({ fieldTypes: res.data });
      }
    });

    UserService.getApprovers().then((resp) => {
      if (resp.data) {
        let approvers = {};

        resp.data.map((approver) => {
          approvers[approver._id] = false;
        });

        this.setState({ final_approvers: approvers });
        this.setState({ list_of_approvers: resp.data });
      }
    });
  }

  handleFieldTypeChange = (e, field_id) => {
    let current_fields = this.state.fields;
    current_fields[field_id].type = e.target.value;
    this.setState({ fields: current_fields });
    // setFields({ ...fields });
  };

  handleFieldNameChange = (e, field_id) => {
    let current_fields = this.state.fields;
    current_fields[field_id].name = e.target.value;
    this.setState({ fields: current_fields });
    // setFields({ ...fields });
  };

  handleDelete = (e, field_id) => {
    e.preventDefault();
    let current_fields = this.state.fields;
    const count = this.state.counter;

    delete current_fields[field_id];

    this.setState({ fields: current_fields });
    this.setState({ counter: count - 1 });
    // setFields({ ...fields });
  };

  handleAdd = (e) => {
    e.preventDefault();
    let current_fields = this.state.fields;
    const count = this.state.counter;

    current_fields[count] = {
      name: "",
      required: false,
      type: "",
    };

    console.log(current_fields);

    this.setState({ fields: current_fields });
    this.setState({ counter: count + 1 });
    // setFields({ ...fields, new_field });
  };

  handleRequiredChange = (e, field_id) => {
    let current_fields = this.state.fields;
    const value = !current_fields[field_id].required;
    current_fields[field_id].required = value;
    this.setState({ fields: current_fields });
    // setFields({ ...fields });
  };

  handleAddFinalApprover = (e, id) => {
    let current_approvers = this.state.final_approvers;
    const value = !current_approvers[id];
    current_approvers[id] = value;

    this.setState({ final_approvers: current_approvers });
  };

  handleCreate(e) {
    e.preventDefault();
    this.setState({ clicked_create: true });

    const nm = this.state.name;
    const fields = this.state.fields;

    let fields_array = [];
    let fields_error = false;

    Object.keys(fields).map((f) => {
      if (fields[f].name === "" || fields[f].type === "") {
        console.log("found error!");
        fields_error = true;
      }
      fields_array.push(fields[f]);
    });

    if (nm === "" || fields_error) {
      this.setState({ field_missing: true });
      this.setState({ clicked_create: false });
    } else {
      this.setState({ field_missing: false });

      const final_approvers = this.state.final_approvers;
      let approvers_array = [];
      Object.keys(final_approvers).map((app) => {
        if (final_approvers[app]) {
          approvers_array.push(app);
        }
      });

      let stages = { 1: [], 2: [], 3: [] };

      stages[this.state.level_one].push(1);
      stages[this.state.level_two].push(2);
      stages[this.state.level_three].push(3);

      UserService.createForm({
        name: nm,
        fields: fields_array,
        finals: approvers_array,
        stages: stages,
      }).then(
        () => {
          this.setState({ clicked_create: false });
          window.location.replace("/mod/forms");
        },
        (error) => {
          this.setState({ clicked_create: false });
          this.setState({ error: true });
        }
      );

      //   UserService.createDepartment({
      //     name: nm,
      //   }).then(
      //     () => {
      //       this.setState({ clicked_create: false });
      //       window.location.replace("/mod/roles");
      //     },
      //     (error) => {
      //       this.setState({ clicked_create: false });
      //       this.setState({ error: true });
      //     }
      //   );
      // }
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
              <h2 className="text-center">Create Form</h2>
            </div>
          </div>
          <div className="card-body">
            <div className="mb-3 row">
              <div className="col-3 m-auto">
                <strong>Form Title:</strong>
              </div>

              <div className="col-9 m-auto">
                <input
                  type="text"
                  className="form-control"
                  onChange={(e) => {
                    this.setState({ name: e.target.value });
                  }}
                />
              </div>
            </div>

            <FormFieldsEdit
              fields={this.state.fields}
              fieldTypes={this.state.fieldTypes}
              handleFieldTypeChange={this.handleFieldTypeChange}
              handleFieldNameChange={this.handleFieldNameChange}
              handleRequiredChange={this.handleRequiredChange}
              handleDelete={this.handleDelete}
            />
            <div className="mb-3 row text-center">
              <div className="col-12">
                <button
                  className="btn btn-outline-success btn-sm"
                  onClick={this.handleAdd}
                >
                  + Add Field
                </button>
              </div>
            </div>

            <div className="mb-3 row">
              <strong className="col-5 ">Select stages of approval:</strong>
              <div className="mb-3 row text-center m-1">
                <div className="col-6 text-start mb-2">
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    Level 1 - view/approve only department
                  </label>
                  <select
                    value={this.state.level_one}
                    className="form-select"
                    onChange={(e) => {
                      this.setState({ level_one: e.target.value });
                    }}
                  >
                    <option selected value="1">
                      First Stage
                    </option>
                    <option value="2">Second Stage</option>
                    <option value="3">Third Stage</option>
                  </select>
                </div>
                <div className="col-6 text-start mb-2">
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    Level 2 - view/approve all
                  </label>
                  <select
                    value={this.state.level_two}
                    className="form-select"
                    onChange={(e) => {
                      this.setState({ level_two: e.target.value });
                    }}
                  >
                    <option value="1">First Stage</option>
                    <option value="2">Second Stage</option>
                    <option value="3">Third Stage</option>
                  </select>
                </div>
                <div className="col-6 text-start">
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    Level 3 - view/approve all
                  </label>
                  <select
                    value={this.state.level_three}
                    className="form-select"
                    onChange={(e) => {
                      this.setState({ level_three: e.target.value });
                    }}
                  >
                    <option value="1">First Stage</option>
                    <option value="2">Second Stage</option>
                    <option value="3">Third Stage</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mb-3 row m-auto">
              <strong className="col-12 ">Select final approvers:</strong>

              {this.state.list_of_approvers.map((app) => {
                return (
                  <div className="form-check m-1" key={app._id}>
                    <input
                      key={"input_" + app._id}
                      className="form-check-input"
                      type="checkbox"
                      checked={this.state.final_approvers[app._id]}
                      id={"flexCheckDefault" + app._id}
                      onChange={(e) => this.handleAddFinalApprover(e, app._id)}
                    />
                    <label
                      key={"label_" + app._id}
                      className="form-check-label"
                      htmlFor={"flexCheckDefault" + app._id}
                    >
                      {app.firstname +
                        " " +
                        app.lastname +
                        " - " +
                        app.role.description}
                    </label>
                  </div>
                );
              })}
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
                Form Title field is required.
              </strong>
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
              <button className="btn btn-outline-primary">Create</button>
            )}
          </div>
        </form>
      </div>
    );
  }
}

function FormFieldsEdit(props) {
  const [fields, setFields] = useState({});
  // const [fieldChecked, setFieldChecked] = useState({});

  useEffect(() => {
    setFields(props.fields);
  }, [props.fields]);

  return (
    <div className="mb-3 row">
      <div className="col-12 m-auto mb-2">
        <strong>Fields:</strong>
      </div>

      <div className="row m-1 form-text">
        <div className="form-floating col-5 mb-1 ps-1">
          <input
            className="form-control"
            type="text"
            value="Employee Name"
            placeholder="Field Name"
            id="inputFieldName"
            disabled
          />
          <label htmlFor="inputFieldName">Field Name</label>
        </div>
        <div className="form-floating col-3 mb-1 ps-1">
          <select
            className="form-select"
            type="text"
            id="selectFieldTypes"
            disabled
          >
            <option selected>Text</option>
          </select>
          <label htmlFor="selectFieldTypes">Field Type</label>
        </div>
        <div className="form-check form-switch col-2 m-auto">
          <input
            className="form-check-input"
            type="checkbox"
            id="flexSwitchCheckDefault"
            checked={true}
            disabled
          />
          <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
            Required
          </label>
        </div>
      </div>
      <div className="row m-1 form-text">
        <div className="form-floating col-5 mb-1 ps-1">
          <input
            className="form-control"
            type="text"
            value="Department"
            placeholder="Field Name"
            id="inputFieldName"
            disabled
          />
          <label htmlFor="inputFieldName">Field Name</label>
        </div>
        <div className="form-floating col-3 mb-1 ps-1">
          <select
            className="form-select"
            type="text"
            id="selectFieldTypes"
            disabled
          >
            <option selected>Dropdown</option>
          </select>
          <label htmlFor="selectFieldTypes">Field Type</label>
        </div>
        <div className="form-check form-switch col-2 m-auto">
          <input
            className="form-check-input"
            type="checkbox"
            id="flexSwitchCheckDefault"
            checked={true}
            disabled
          />
          <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
            Required
          </label>
        </div>
      </div>
      {Object.keys(fields).map((id) => {
        return (
          <div className="row m-1 form-text">
            <div className="form-floating col-5 mb-1 ps-1">
              <input
                className="form-control"
                type="text"
                value={fields[id].name}
                onChange={(e) => props.handleFieldNameChange(e, id)}
                placeholder="Field Name"
                id="inputFieldName"
              />
              <label htmlFor="inputFieldName">Field Name</label>
            </div>
            <div className="form-floating col-3 mb-1 ps-1">
              <select
                className="form-select"
                type="text"
                value={fields[id].type}
                onChange={(e) => props.handleFieldTypeChange(e, id)}
                id="selectFieldTypes"
              >
                <option value=""></option>
                {props.fieldTypes.map((field_type) => {
                  return (
                    <option key={field_type._id} value={field_type._id}>
                      {" "}
                      {field_type.name}
                    </option>
                  );
                })}
              </select>
              <label htmlFor="selectFieldTypes">Field Type</label>
            </div>
            <div className="form-check form-switch col-2 m-auto">
              <input
                className="form-check-input"
                type="checkbox"
                id="flexSwitchCheckDefault"
                name={id}
                checked={fields[id].required}
                onChange={(e) => {
                  props.handleRequiredChange(e, id);
                }}
              />
              <label
                className="form-check-label"
                htmlFor="flexSwitchCheckDefault"
              >
                Required
              </label>
            </div>
            <div className="col-2 m-auto text-end">
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={(e) => props.handleDelete(e, id)}
              >
                x
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default FormCreate;
