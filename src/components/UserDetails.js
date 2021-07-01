import React, { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";
import UserService from "../services/user.service";

function UserDetails(props) {
  const location = useLocation();
  const { user } = location.state;
  const [roles, setRoles] = useState([]);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [clicked_create, setClickedCreate] = useState(false);
  const [error, setError] = useState(false);
  const [missingField, setMissingField] = useState(false);

  useEffect(() => {
    UserService.getRoles().then((res) => {
      if (res.data) {
        setRoles(res.data);
      }
    });
    setFirstname(user.firstname);
    setLastname(user.lastname);
    setUsername(user.username);
    setEmail(user.email);
    setRole(user.role._id);
  }, []);

  let handleUpdate = (e) => {
    e.preventDefault();
    setClickedCreate(true);
    let body = {};
    if (username === "") {
      setError(false);
      setClickedCreate(false);
      setMissingField(true);
    } else {
      setMissingField(false);
      if (password === "") {
        body = {
          id: user._id,
          username: username,
          firstname: firstname,
          lastname: lastname,
          role: role,
          email: email,
        };
      } else {
        body = {
          id: user._id,
          username: username,
          firstname: firstname,
          lastname: lastname,
          role: role,
          password: password,
          email: email,
        };
      }

      UserService.updateApprover(body).then(
        () => {
          window.location.replace("/mod/users");
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
            <h2 className="text-center">{user.firstname} - User Details</h2>
          </div>
        </div>
        <div className="card-body">
          <div className="mb-3 row">
            <label className="col-sm-4 col-form-label">Firstname:</label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                value={firstname}
                onChange={(e) => {
                  setFirstname(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="mb-3 row">
            <label className="col-sm-4 col-form-label">Lastname:</label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                value={lastname}
                onChange={(e) => {
                  setLastname(e.target.value);
                }}
              />
            </div>
          </div>
          {user.role.name == "mod" ? (
            ""
          ) : (
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Username:</label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                />
              </div>
            </div>
          )}

          {user.role.name === "mod" ? (
            ""
          ) : (
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label">Role:</label>
              <div className="col-sm-8">
                <select
                  type="text"
                  className="form-select"
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value);
                  }}
                >
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
          )}
          <div className="mb-3 row">
            <label className="col-sm-4 col-form-label">Email:</label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="mb-3 row">
            <label className="col-sm-4 col-form-label">New Password:</label>
            <div
              className="col-sm-8"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            >
              <input type="password" className="form-control" />
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
            <strong className="text-danger">Username is required.</strong>
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

export default UserDetails;
