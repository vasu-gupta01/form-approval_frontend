import React, { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";
import UserService from "../../services/user.service";

function RoleDetails(props) {
  const location = useLocation();
  const { role } = location.state;
  const [departments, setDepartments] = useState([]);

  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [department, setDepartment] = useState("");

  const [clicked_create, setClickedCreate] = useState(false);
  const [error, setError] = useState(false);
  const [missingField, setMissingField] = useState(false);

  useEffect(() => {
    UserService.getDepartments().then((res) => {
      if (res.data) {
        setDepartments(res.data);
      }
    });
    setDescription(role.description);
    setName(role.name);
    setDepartment(role.department);
    setLevel(role.level);
  }, []);

  let handleUpdate = (e) => {
    e.preventDefault();
    setClickedCreate(true);

    if (level === "" && name == "") {
      setError(false);
      setClickedCreate(false);
      setMissingField(true);
    } else {
      setMissingField(false);

      const body = {
        id: role._id,
        description: description,
        level: level,
        name: name,
        department: department,
      };

      UserService.updateRole(body).then(
        () => {
          window.location.replace("/mod/roles");
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
      <form className="card bg-light bg-gradient" onSubmit={handleUpdate}>
        <div className="card-header">
          <div className="card-title">
            <h2 className="text-center">{role.description} - Role Details</h2>
          </div>
        </div>
        <div className="card-body">
          <div className="mb-3 row">
            <label className="col-sm-4 col-form-label">Type:</label>
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
          <div className="mb-3 row">
            <label className="col-sm-4 col-form-label">Description:</label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="mb-3 row">
            <label className="col-sm-4 col-form-label">Department:</label>
            <div className="col-sm-8">
              <select
                type="text"
                className="form-select"
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                }}
              >
                <option value="">none</option>
                {departments.map((dep) => {
                  return <option value={dep._id}>{dep.name}</option>;
                })}
              </select>
            </div>
          </div>
          <div className="mb-3 row">
            <label className="col-sm-4 col-form-label">Access Level:</label>
            <div className="col-sm-8">
              <select
                type="text"
                className="form-select"
                value={level}
                onChange={(e) => {
                  setLevel(e.target.value);
                }}
              >
                <option value="0">level 0 -- only view</option>
                <option value="1">
                  level 1 -- view/approve only department requests
                </option>
                <option value="2">level 2 -- view/approve all requests</option>
              </select>
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
              Name and Access level is required.
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

export default RoleDetails;
