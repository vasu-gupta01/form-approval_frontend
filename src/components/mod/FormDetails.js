import React, { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";
import UserService from "../../services/user.service";

function FormDetails(props) {
  const location = useLocation();
  const { form } = location.state;

  const [fieldTypes, setFieldTypes] = useState([]);

  const [name, setName] = useState("");
  const [fields, setFields] = useState({});
  const [final_approvers, setFinalApprovers] = useState([]);

  const [clicked_create, setClickedCreate] = useState(false);
  const [error, setError] = useState(false);
  const [missingField, setMissingField] = useState(false);

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

      const body = {
        id: form._id,
        name: name,
        fields: fields_array,
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
            <label className="col-sm-4 col-form-label">Name:</label>
            <div className="col-sm-8">
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
                    class="spinner-border spinner-border-sm"
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
      <label className="col-sm-2 col-form-label">Fields:</label>{" "}
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
