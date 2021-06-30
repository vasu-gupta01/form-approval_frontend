import React, { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";
import UserService from "../../services/user.service";

function FormDetails(props) {
  const location = useLocation();
  const { form } = location.state;

  const [fieldTypes, setFieldTypes] = useState([]);

  const [name, setName] = useState("");
  const [fields, setFields] = useState({});

  const [clicked_create, setClickedCreate] = useState(false);
  const [error, setError] = useState(false);
  const [missingField, setMissingField] = useState(false);

  const [level_one, setLevelOne] = useState(1);
  const [level_two, setLevelTwo] = useState(2);
  const [level_three, setLevelThree] = useState(3);

  const [final_approvers, setFinalApprovers] = useState({});
  const [list_of_approvers, setListOfApprovers] = useState([]);

  useEffect(() => {
    UserService.getFieldTypes().then((res) => {
      if (res.data) {
        setFieldTypes(res.data);
      }
    });
    let new_fields = {};
    for (let field of form.fields) {
      new_fields[field._id] = field;
    }
    form.stages[1].map((s) => {
      if (s === 1) {
        setLevelOne(1);
      }
      if (s === 2) {
        setLevelTwo(1);
      }
      if (s == 3) {
        setLevelThree(1);
      }
    });
    form.stages[2].map((s) => {
      if (s === 1) {
        setLevelOne(2);
      }
      if (s === 2) {
        setLevelTwo(2);
      }
      if (s == 3) {
        setLevelThree(2);
      }
    });
    form.stages[3].map((s) => {
      if (s === 1) {
        setLevelOne(3);
      }
      if (s === 2) {
        setLevelTwo(3);
      }
      if (s == 3) {
        setLevelThree(3);
      }
    });

    UserService.getApprovers().then((resp) => {
      if (resp.data) {
        let approvers = {};

        resp.data.map((approver) => {
          approvers[approver._id] = false;
        });

        form.finals.map((f) => {
          approvers[f._id] = true;
        });

        setFinalApprovers(approvers);
        setListOfApprovers(resp.data);
      }
    });

    setFields(new_fields);
    setName(form.name);
  }, []);

  let handleFieldTypeChange = (e, field_id) => {
    let current_fields = fields;
    current_fields[field_id].type = e.target.value;
    setFields({ ...fields });
  };

  let handleFieldNameChange = (e, field_id) => {
    let current_fields = fields;
    current_fields[field_id].name = e.target.value;
    setFields({ ...fields });
  };

  let handleDelete = (e, field_id) => {
    e.preventDefault();
    let current_fields = fields;

    delete current_fields[field_id];

    setFields({ ...fields });
  };

  let handleAdd = (e) => {
    e.preventDefault();
    let current_fields = fields;

    const new_field = {
      name: "",
      required: false,
      type: "",
    };

    setFields({ ...fields, new_field });
  };

  let handleRequiredChange = (e, field_id) => {
    let current_fields = fields;
    const value = !current_fields[field_id].required;
    current_fields[field_id].required = value;
    setFields({ ...fields });
  };

  let handleUpdate = (e) => {
    e.preventDefault();
    setClickedCreate(true);

    let fields_array = [];
    let fields_error = false;

    Object.keys(fields).map((f) => {
      if (fields[f].name === "" || fields[f].type === "") {
        console.log("found error!");
        fields_error = true;
      }
      fields_array.push(fields[f]);
    });

    if (name === "" || fields_error) {
      setError(false);
      setClickedCreate(false);
      setMissingField(true);
    } else {
      setMissingField(false);

      let stages = { 1: [], 2: [], 3: [] };

      stages[level_one].push(1);
      stages[level_two].push(2);
      stages[level_three].push(3);

      const body = {
        id: form._id,
        name: name,
        fields: fields_array,
        stages: stages,
      };

      UserService.updateForm(body).then(
        () => {
          window.location.replace("/mod/forms");
        },
        (error) => {
          setClickedCreate(false);
          setError(true);
        }
      );
    }
  };

  let handleAddFinalApprover = (e, id) => {
    let current_approvers = final_approvers;
    console.log(current_approvers);
    const value = !current_approvers[id];
    current_approvers[id] = value;
    console.log(current_approvers);
    setFinalApprovers(current_approvers);
  };

  return (
    <div className="container container-form d-flex align-items-center justify-content-center mt-5">
      <form
        className="container-form card bg-light bg-gradient"
        onSubmit={handleUpdate}
        autoComplete="off"
      >
        <div className="card-header">
          <div className="card-title">
            <h2 className="text-center">{form.name} - Form Details</h2>
          </div>
        </div>
        <div className="card-body">
          <div className="mb-3 row">
            <div className="col-4 m-auto">
              <strong>Name:</strong>
            </div>

            <div className="col-8">
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
          </div>
          <FormFieldsEdit
            fields={fields}
            fieldTypes={fieldTypes}
            handleFieldTypeChange={handleFieldTypeChange}
            handleFieldNameChange={handleFieldNameChange}
            handleRequiredChange={handleRequiredChange}
            handleDelete={handleDelete}
          />
          <div className="mb-3 row text-center">
            <div className="col-12">
              <button
                className="btn btn-outline-success btn-sm"
                onClick={handleAdd}
              >
                + Add Field
              </button>
            </div>
          </div>

          <div className="mb-3 row">
            <strong className="col-5 ">Select stages of approval:</strong>
            <div className="mb-3 row text-center m-1">
              <div className="col-6 text-start mb-2">
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  Access Level 1 - Department Only
                </label>
                <select
                  value={level_one}
                  className="form-select"
                  onChange={(e) => {
                    setLevelOne(e.target.value);
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
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  Access Level 2 - All Approvals
                </label>
                <select
                  value={level_two}
                  className="form-select"
                  onChange={(e) => {
                    setLevelTwo(e.target.value);
                  }}
                >
                  <option value="1">First Stage</option>
                  <option value="2">Second Stage</option>
                  <option value="3">Third Stage</option>
                </select>
              </div>
              <div className="col-6 text-start">
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  Level 3 - All Approvals
                </label>
                <select
                  value={level_three}
                  className="form-select"
                  onChange={(e) => {
                    setLevelThree(e.target.value);
                  }}
                >
                  <option value="1">First Stage</option>
                  <option value="2">Second Stage</option>
                  <option value="3">Third Stage</option>
                </select>
              </div>
            </div>
          </div>

          {error ? (
            <strong className="text-danger mt-2">
              Error submitting request. Check connection.
            </strong>
          ) : (
            ""
          )}
          {missingField ? (
            <strong className="text-danger">
              Form name, field names and types are required fields.
            </strong>
          ) : (
            ""
          )}
        </div>
        <div className="card-footer">
          <div className="row">
            <div className="col-12 text-end">
              {clicked_create ? (
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
          </div>
        </div>
      </form>
    </div>
  );
}

function FormFieldsEdit(props) {
  const [fields, setFields] = useState({});
  // const [fieldChecked, setFieldChecked] = useState({});

  useEffect(() => {
    setFields(props.fields);
  }, [props.fields]);

  return (
    <div className="mb-3 row">
      <div className="col-12 m-auto">
        <strong>Fields:</strong>
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

export default FormDetails;
